export const TICKET_STATUS = {
  LOGGED: 'loged',
  PROGRESS: 'progress',
  HOLD: 'hold',
  FULFILLED: 'fulfilled',
  CANCELED: 'canceled',
} as const;

export const TICKET_STATUS_OPTIONS = [
  { value: TICKET_STATUS.LOGGED, label: 'Logged' },
  { value: TICKET_STATUS.FULFILLED, label: 'Fulfilled' },
  { value: TICKET_STATUS.PROGRESS, label: 'Progress' },
  { value: TICKET_STATUS.HOLD, label: 'On hold' },
  { value: TICKET_STATUS.CANCELED, label: 'Canceled' },
];

export const TICKET_FILTER_OPTIONS = [
  { label: 'loged', value: TICKET_STATUS.LOGGED },
  { label: 'progress', value: TICKET_STATUS.PROGRESS },
  { label: 'hold', value: TICKET_STATUS.HOLD },
  { label: 'fulfilled', value: TICKET_STATUS.FULFILLED },
];

export const TICKET_SORT_OPTIONS = [
  { label: 'Sort by status asc', value: 'status-asc' },
  { label: 'Sort by status desc', value: 'status-desc' },
  { label: 'Sort by priority asc', value: 'priority-asc' },
  { label: 'Sort by priority desc', value: 'priority-desc' },
];
