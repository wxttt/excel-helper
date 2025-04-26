import * as XLSX from 'xlsx';
import { ExcelData, ExcelAttribute } from '../types';

export const readExcelFile = async (file: File): Promise<ExcelData> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // 转换为JSON数据
  const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);
  
  // 获取表头
  const headers = Object.keys(jsonData[0] || {});
  
  // 分析每个属性的可能取值
  const attributes: ExcelAttribute[] = headers.map(header => ({
    name: header,
    values: [...new Set(jsonData.map(row => row[header]))]
  }));
  
  return {
    headers,
    data: jsonData,
    attributes
  };
};

export const generateExcelFile = (data: Record<string, string>[]): Blob => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
  // 生成Excel文件的二进制数据
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // 转换为Blob对象
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}; 