import { useState } from 'react';
import { ExcelData } from '../types';
import { readExcelFile } from '../lib/excel';

interface FileUploadProps {
  onFileProcessed: (data: ExcelData) => void;
}

export const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setIsProcessing(true);
    try {
      const data = await readExcelFile(file);
      onFileProcessed(data);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('处理文件时发生错误');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">点击上传</span> 或拖拽文件到此处
            </p>
            <p className="text-xs text-gray-500">支持 .xlsx, .xls 格式</p>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />
        </label>
      </div>
      
      {fileName && (
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm text-gray-700">{fileName}</span>
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">正在处理文件...</span>
        </div>
      )}
    </div>
  );
}; 