import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(['incident', 'service_request', 'change_request']),
  priority: z.number().int().min(1).max(4),
  reason: z.string(),
});

export async function POST(request: Request) {
  try {
    const { description } = (await request.json()) as { description: string };

    if (typeof description !== 'string' || description.trim().length < 10) {
      return Response.json({ error: 'Description too short' }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema,
      system: `You classify IT support tickets.

Ticket types:
- incident: An unplanned disruption or degradation of an IT service (outage, error, system failure, broken functionality)
- service_request: A formal request for something standard (account access, software install, hardware, password reset)
- change_request: A request to modify existing IT infrastructure or processes (config change, upgrade, migration, deployment)

Priority: 1=High (critical, many users affected), 2=Medium (significant, workaround exists), 3=Normal (moderate), 4=Low (minor)`,
      prompt: `Classify this IT support description: "${description.trim()}"`,
    });

    return Response.json(object);
  } catch {
    return Response.json({ error: 'Classification failed' }, { status: 500 });
  }
}
