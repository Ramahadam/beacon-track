import { describe, expect, it } from 'vitest';

import { incidentCreateSchema } from '../incident-create';

const validBase = {
  summary: 'Login page is broken',
  description: 'Users cannot log in since the deploy',
  priority: 2,
};

describe('incidentCreateSchema', () => {
  it('accepts valid input', () => {
    const result = incidentCreateSchema.safeParse({ ...validBase, impact: 'one' });
    expect(result.success).toBe(true);
  });

  it('rejects missing impact', () => {
    const result = incidentCreateSchema.safeParse(validBase);
    expect(result.success).toBe(false);
  });

  it('rejects invalid impact value', () => {
    const result = incidentCreateSchema.safeParse({ ...validBase, impact: 'zero' });
    expect(result.success).toBe(false);
  });

  it('rejects summary shorter than 5 chars', () => {
    const result = incidentCreateSchema.safeParse({ ...validBase, impact: 'one', summary: 'Hi' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Summary must be at least 5 characters');
    }
  });

  it('rejects description shorter than 5 chars', () => {
    const result = incidentCreateSchema.safeParse({
      ...validBase,
      impact: 'one',
      description: 'bad',
    });
    expect(result.success).toBe(false);
  });

  it('rejects priority out of range', () => {
    const low = incidentCreateSchema.safeParse({ ...validBase, impact: 'one', priority: 5 });
    const high = incidentCreateSchema.safeParse({ ...validBase, impact: 'one', priority: 0 });
    expect(low.success).toBe(false);
    expect(high.success).toBe(false);
  });

  it('trims whitespace from summary and description', () => {
    const result = incidentCreateSchema.safeParse({
      ...validBase,
      summary: '  Login page is broken  ',
      description: '  Users cannot log in  ',
      impact: 'one',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.summary).toBe('Login page is broken');
      expect(result.data.description).toBe('Users cannot log in');
    }
  });

  it('transforms empty owner to undefined', () => {
    const result = incidentCreateSchema.safeParse({ ...validBase, impact: 'one', owner: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.owner).toBeUndefined();
  });

  it('keeps non-empty owner as string', () => {
    const result = incidentCreateSchema.safeParse({
      ...validBase,
      impact: 'one',
      owner: 'alice@example.com',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.owner).toBe('alice@example.com');
  });
});
