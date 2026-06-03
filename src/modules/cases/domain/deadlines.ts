import { addDays, addHours } from 'date-fns';

import { PRIORITY } from './priority';

export const DEADLINE = {
  URGENT_THRESHOLD: 1,
  NORMAL_THRESHOLD: 4,
} as const;

export function calculateDeadline(priority: number): Date | undefined {
  const now = new Date();
  if (priority === PRIORITY.HIGH) return addHours(now, 4);
  if (priority === PRIORITY.MEDIUM) return addDays(now, 1);
  if (priority === PRIORITY.NORMAL) return addDays(now, 3);
  if (priority === PRIORITY.LOW) return addDays(now, 4);
  return undefined;
}
