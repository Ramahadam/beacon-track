export const PRIORITY = {
  HIGH: 1,
  MEDIUM: 2,
  NORMAL: 3,
  LOW: 4,
} as const;

export const PRIORITY_LABELS: Record<number, string> = {
  [PRIORITY.HIGH]: 'High',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.NORMAL]: 'Normal',
  [PRIORITY.LOW]: 'Low',
};

export function priorityToString(priority: number): string {
  const map: Record<number, string> = {
    [PRIORITY.HIGH]: 'high',
    [PRIORITY.MEDIUM]: 'medium',
    [PRIORITY.NORMAL]: 'normal',
    [PRIORITY.LOW]: 'low',
  };
  return map[priority] ?? 'low';
}

export const PRIORITY_SELECT_OPTIONS = [
  { value: PRIORITY.NORMAL, label: PRIORITY_LABELS[PRIORITY.NORMAL] },
  { value: PRIORITY.HIGH, label: PRIORITY_LABELS[PRIORITY.HIGH] },
  { value: PRIORITY.LOW, label: PRIORITY_LABELS[PRIORITY.LOW] },
  { value: PRIORITY.MEDIUM, label: PRIORITY_LABELS[PRIORITY.MEDIUM] },
];
