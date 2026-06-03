export type TicketNote = {
  noteId: string | number;
  noteValue: string | undefined;
  createBy: string;
  createdAt: Date;
};

export function mergeNotes(
  existing: TicketNote[] | null | undefined,
  incoming: TicketNote | null | undefined,
): TicketNote[] {
  if (!incoming) return existing ?? [];
  return existing ? [...existing, incoming] : [incoming];
}
