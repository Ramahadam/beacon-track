export function ticketFormDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value !== 'string') continue;
    obj[key] = key === 'priority' ? Number(value) : value;
  }

  return obj;
}
