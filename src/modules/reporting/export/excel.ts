import { format } from 'date-fns';
import * as XLSX from 'xlsx';

export function exportToExcel(data: Record<string, unknown>[], filename = 'Export') {
  const finalFilename = `${filename}-${format(new Date(), 'dd-MM-HH-mm-ss')}.xlsx`;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, finalFilename);
}
