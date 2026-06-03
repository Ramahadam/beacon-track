export const CR_STATUS = {
  APPROVED: 'approved',
  IMPLEMENTED: 'implemented',
  REQUESTED: 'requested',
  PENDING_APPROVAL: 'pending approval',
  CANCELLED: 'cancelled',
} as const;

export const CR_STATUS_OPTIONS = [
  { value: CR_STATUS.APPROVED, label: 'Approved' },
  { value: CR_STATUS.IMPLEMENTED, label: 'Implemented' },
  { value: CR_STATUS.REQUESTED, label: 'Requested' },
  { value: CR_STATUS.PENDING_APPROVAL, label: 'Pending approval' },
  { value: CR_STATUS.CANCELLED, label: 'Cancelled' },
];

export const CR_SORT_OPTIONS = [
  { label: 'Sort by status asc', value: 'status-asc' },
  { label: 'Sort by status desc', value: 'status-desc' },
  { label: 'Sort by classification asc', value: 'classification-asc' },
  { label: 'Sort by classification desc', value: 'classification-desc' },
];

export const CATEGORY_OPTIONS = [
  { value: 'software', label: 'Software' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'network', label: 'Network' },
  { value: 'servers', label: 'Servers' },
  { value: 'storage', label: 'Storage' },
  { value: 'exchange', label: 'Exchange' },
];

export const CR_FILTER_OPTIONS = [
  { label: 'requested', value: 'requested' },
  { label: 'pending approval', value: 'pending approval' },
  { label: 'approved', value: 'approved' },
  { label: 'implemented', value: 'implemented' },
];
