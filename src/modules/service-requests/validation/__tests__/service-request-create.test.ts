import { describe, expect, it } from 'vitest';

import { serviceRequestCreateSchema } from '../service-request-create';

const validBase = {
  summary: 'Login page is broken',
  description: 'Users cannot log in since the deploy',
  priority: 2,
};

describe('serviceRequestCreateSchema', () => {
  it('accepts valid input without impact', () => {
    const result = serviceRequestCreateSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('accepts valid input with impact', () => {
    const result = serviceRequestCreateSchema.safeParse({ ...validBase, impact: 'many' });
    expect(result.success).toBe(true);
  });

  it('transforms empty impact string to undefined', () => {
    const result = serviceRequestCreateSchema.safeParse({ ...validBase, impact: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.impact).toBeUndefined();
  });

  it('rejects invalid impact value', () => {
    const result = serviceRequestCreateSchema.safeParse({ ...validBase, impact: 'critical' });
    expect(result.success).toBe(false);
  });

  it('rejects summary shorter than 5 chars', () => {
    const result = serviceRequestCreateSchema.safeParse({ ...validBase, summary: 'Fix' });
    expect(result.success).toBe(false);
  });
});
