# AI Ticket Classification

## What It Does

When a user clicks **"New Ticket"** on the dashboard or My Tickets page, a modal opens instead of navigating directly to a form. The user types a free-text description of their issue, clicks **"Analyze with AI"**, and the system returns:

- **Ticket type** — Incident, Service Request, or Change Request
- **Priority** — High / Medium / Normal / Low (1–4)
- **Reason** — one-sentence explanation of the classification

Clicking "Continue to form" navigates to the correct form (`/incidents/new`, `/requests/new`, or `/change/new`) with the description and priority pre-filled. The user only needs to add a summary and submit.

## How It Works

```
User types description
        │
        ▼
POST /api/ai/classify
        │
        ▼
Vercel AI SDK — generateObject()
   model: gpt-4o-mini
   schema: { type, priority, reason }
        │
        ▼
Structured JSON response (no parsing needed)
        │
        ▼
Modal shows result badges
        │
        ▼
router.push(`/<form>?description=...&priority=...`)
        │
        ▼
Server component reads searchParams → passes as prefill
        │
        ▼
React Hook Form initialises with defaultValues from prefill
```

**Key packages:**
- `ai` (Vercel AI SDK v6) — `generateObject` with Zod schema enforces structured output natively; no JSON parsing, no hallucinated fields.
- `@ai-sdk/openai` — OpenAI provider for the SDK.
- `gpt-4o-mini` — cheap, fast, accurate for classification tasks. No need for GPT-4o here.

**Auth:** The `/api/ai/classify` route is protected by the existing middleware (Rule 2 in `auth.config.ts`) — only logged-in users can call it.

**RBAC routing:** The modal accepts an `isStaff: boolean` prop. Staff users are routed to `/incidents/new`, `/requests/new`, `/change/new`. Standard users go to `/my-tickets/incidents/new` etc. The same classification logic serves both.

## Tradeoffs

| Decision | What was chosen | Alternative | Why this was chosen |
|---|---|---|---|
| Trigger | Button click ("Analyze with AI") | Real-time debounced | Avoids burning API quota on every keystroke; one intentional call is cleaner for a demo |
| Entry point | Single unified modal | AI button on each individual form | Better UX story — user doesn't need to know the type before asking AI |
| Model | `gpt-4o-mini` | `gpt-4o`, Claude Sonnet | Cost: gpt-4o-mini is ~30× cheaper per token; classification is a simple task |
| Output | `generateObject` with Zod schema | Prompt + JSON.parse | Structured output is guaranteed — no parsing failures, no schema drift |
| Pre-fill | URL search params | Server-side session/cache | Stateless; works across page navigation without any server state |
| Change request priority | Maps AI `priority` (1–4) → `classification` (1–4) | Separate AI field | Same numeric scale; mapping is reasonable (High→Major, Low→Normal) |

## Known Limitations

1. **No summary pre-fill** — the description is pre-filled but the summary field is left blank. The user still has to write a short summary. The AI could generate one.

2. **No confidence score** — the model returns a classification but not how confident it is. A borderline case (e.g. "my password expired" could be Incident or Service Request) is returned without any indication of ambiguity.

3. **Modal is not accessible from individual forms** — if a user navigates directly to `/my-tickets/incidents/new`, they can't trigger the AI from there. The entry point is only on the listing/dashboard pages.

4. **No streaming** — the classify call is a single round-trip. For longer descriptions the user sees a spinner with no feedback. Streaming the reason word-by-word would feel faster.

5. **No retry on the form** — once the user lands on the pre-filled form, there's no "re-classify" button if they want to change their mind.

6. **API key must be set manually** — `OPENAI_API_KEY` must be in `.env.local`. There's no graceful fallback if the key is missing; the route returns a 500.

## What I Would Do Next

### Short-term (high value, low effort)

- **Generate the summary too** — add `summary` to the `generateObject` schema and pre-fill that field as well. Cuts the user's work to near zero.
- **Confidence / ambiguity flag** — add an optional `alternativeType` field to the schema. If the model returns one, show "Could also be a Service Request" as a secondary badge in the modal.
- **Graceful error for missing API key** — detect `OPENAI_API_KEY` absence at startup and return a clear 503 with a message instead of a generic 500.

### Medium-term (higher effort, strong recruiter signal)

- **Sentiment analysis on the same call** — extend the schema with `sentiment: z.enum(['frustrated', 'neutral', 'calm'])` and a `urgency` boolean. One extra field, zero extra API calls. Show a sentiment badge on the ticket detail page so staff see emotional context at a glance.
- **Feedback loop** — let staff mark a classification as wrong. Store corrections in a `ClassificationFeedback` table. Use the history as few-shot examples in the system prompt to improve accuracy over time.
- **Rate limiting** — add a per-user rate limit (e.g. 10 calls/minute) on the classify route using an in-memory or Redis counter. Prevents abuse and controls API costs.

### Long-term (architectural)

- **RAG-powered response drafting** — index closed tickets into a vector store (pgvector on Neon). When staff open a ticket, a "Suggest Reply" button retrieves similar resolved tickets and drafts a response. Builds naturally on top of the existing classification work.
- **Move to background job** — for large-scale use, offload classification to a queue (e.g. Inngest) so the modal doesn't block on the OpenAI round-trip. Return a job ID, poll for result.
