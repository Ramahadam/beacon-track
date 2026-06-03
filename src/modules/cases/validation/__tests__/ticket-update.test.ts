import { describe, expect, it } from 'vitest';

import { ticketUpdateSchema } from '../ticket-update';

describe('ticketUpdateSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    const result = ticketUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts valid status', () => {
    const result = ticketUpdateSchema.safeParse({ status: 'loged' });
    expect(result.success).toBe(true);
  });

  it('rejects unknown status', () => {
    const result = ticketUpdateSchema.safeParse({ status: 'unknown-status' });
    expect(result.success).toBe(false);
  });

  it('accepts priority within range', () => {
    const result = ticketUpdateSchema.safeParse({ priority: 3 });
    expect(result.success).toBe(true);
  });

  it('rejects priority out of range', () => {
    const result = ticketUpdateSchema.safeParse({ priority: 10 });
    expect(result.success).toBe(false);
  });

  it('transforms empty noteValue to undefined', () => {
    const result = ticketUpdateSchema.safeParse({ noteValue: '   ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.noteValue).toBeUndefined();
  });
});
