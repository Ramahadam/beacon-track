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
   model: gemini-2.0-flash (Google AI)
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
- `@ai-sdk/google` — Google Generative AI provider (Gemini). Free tier via Google AI Studio key.
- `gemini-2.0-flash` — fast, capable model available on the Gemini free tier.

**Auth:** The `/api/ai/classify` route is protected by the existing middleware (Rule 2 in `auth.config.ts`) — only logged-in users can call it.

**RBAC routing:** The modal accepts an `isStaff: boolean` prop. Staff users are routed to `/incidents/new`, `/requests/new`, `/change/new`. Standard users go to `/my-tickets/incidents/new` etc. The same classification logic serves both.

## Provider History & Issues Faced

### OpenAI (original)
- **Attempted:** `gpt-4o-mini` via `@ai-sdk/openai`
- **Issue:** OpenAI removed the free API tier. The account had no billing credits, resulting in a quota exceeded error (HTTP 500 after 29s timeout).
- **Lesson:** Never depend on a paid API for a portfolio demo with no fallback.

### Google Gemini (current)
- **Attempted:** `gemini-2.0-flash` via `@ai-sdk/google`
- **Issue:** API key created from Google Cloud Console rather than Google AI Studio resulted in `free_tier_input_token_count limit: 0` — the free tier quota was explicitly 0 for that project type.
- **Fix:** Key must be created at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) to get the proper free tier quota (1,500 requests/day).
- **Status:** Gemini provider is wired in and correct. Feature works once a valid AI Studio key is in `GOOGLE_GENERATIVE_AI_API_KEY` in `.env.local`.

### Root cause of both failures
Both failures have the same underlying problem: **no local fallback**. If the API call fails for any reason (quota, network, key misconfiguration), the feature returns a generic 500 and the user sees "AI classification failed." A local keyword-based classifier would keep the feature functional at all times.

## Tradeoffs

| Decision | What was chosen | Alternative | Why this was chosen |
|---|---|---|---|
| Trigger | Button click ("Analyze with AI") | Real-time debounced | Avoids burning API quota on every keystroke; one intentional call is cleaner for a demo |
| Entry point | Single unified modal | AI button on each individual form | Better UX story — user doesn't need to know the type before asking AI |
| Provider | Google Gemini (free tier) | OpenAI, Anthropic | Only option with a genuinely free tier suitable for portfolio demos |
| Output | `generateObject` with Zod schema | Prompt + JSON.parse | Structured output is guaranteed — no parsing failures, no schema drift |
| Pre-fill | URL search params | Server-side session/cache | Stateless; works across page navigation without any server state |
| Change request priority | Maps AI `priority` (1–4) → `classification` (1–4) | Separate AI field | Same numeric scale; mapping is reasonable (High→Major, Low→Normal) |

## Known Limitations

1. **No local fallback** — if the API key is missing, expired, or quota-exceeded, the feature returns a 500. A keyword-based fallback would keep it functional at all times. *(Critical for portfolio reliability)*

2. **No summary pre-fill** — the description is pre-filled but the summary field is left blank. The user still has to write a short summary. The AI could generate one.

3. **No confidence score** — the model returns a classification but not how confident it is. A borderline case (e.g. "my password expired" could be Incident or Service Request) is returned without any indication of ambiguity.

4. **Modal is not accessible from individual forms** — if a user navigates directly to `/my-tickets/incidents/new`, they can't trigger the AI from there. The entry point is only on the listing/dashboard pages.

5. **No streaming** — the classify call is a single round-trip. For longer descriptions the user sees a spinner with no feedback. Streaming the reason word-by-word would feel faster.

6. **No retry on the form** — once the user lands on the pre-filled form, there's no "re-classify" button if they want to change their mind.

## What I Would Do Next

### Immediate (non-negotiable for portfolio)

- **Local keyword fallback** — when the API call fails, run a simple keyword classifier locally (e.g. "print", "access", "error" → incident; "install", "request", "need" → service_request; "upgrade", "migrate", "deploy" → change_request). Show a "Demo mode" badge so it's honest. Feature never breaks for interviewers.

### Short-term (high value, low effort)

- **Generate the summary too** — add `summary` to the `generateObject` schema and pre-fill that field as well. Cuts the user's work to near zero.
- **Confidence / ambiguity flag** — add an optional `alternativeType` field to the schema. If the model returns one, show "Could also be a Service Request" as a secondary badge in the modal.
- **Env check at startup** — detect missing `GOOGLE_GENERATIVE_AI_API_KEY` early and return a clear 503 with a human-readable message instead of a timeout.

### Medium-term (higher effort, strong recruiter signal)

- **Sentiment analysis on the same call** — extend the schema with `sentiment: z.enum(['frustrated', 'neutral', 'calm'])` and a `urgency` boolean. One extra field, zero extra API calls. Show a sentiment badge on the ticket detail page so staff see emotional context at a glance.
- **Feedback loop** — let staff mark a classification as wrong. Store corrections in a `ClassificationFeedback` table. Use the history as few-shot examples in the system prompt to improve accuracy over time.
- **Rate limiting** — add a per-user rate limit (e.g. 10 calls/minute) on the classify route using an in-memory or Redis counter. Prevents abuse and controls API costs.

### Long-term (architectural)

- **RAG-powered response drafting** — index closed tickets into a vector store (pgvector on Neon). When staff open a ticket, a "Suggest Reply" button retrieves similar resolved tickets and drafts a response. Builds naturally on top of the existing classification work.
- **Move to background job** — for large-scale use, offload classification to a queue (e.g. Inngest) so the modal doesn't block on the API round-trip. Return a job ID, poll for result.
