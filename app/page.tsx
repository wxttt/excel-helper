'use client';

import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AttributeSelector } from './components/AttributeSelector';
import { ExcelData, AttributeCombination, SamplingResult } from './types';
import { sampleData } from './lib/sampling';
import { generateExcelFile } from './lib/excel';

export default function Home() {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [combinations, setCombinations] = useState<AttributeCombination[]>([]);
  const [samplingResult, setSamplingResult] = useState<SamplingResult | null>(null);
  
  const handleFileProcessed = (data: ExcelData) => {
    setExcelData(data);
    setCombinations([]);
    setSamplingResult(null);
  };
  
  const handleCombinationsChange = (newCombinations: AttributeCombination[]) => {
    setCombinations(newCombinations);
    setSamplingResult(null);
  };
  
  const handleSample = () => {
    if (!excelData || combinations.length === 0) {
      alert('请先上传文件并选择属性组合');
      return;
    }
    
    const result = sampleData(excelData, combinations);
    setSamplingResult(result);
  };
  
  const handleDownload = () => {
    if (!samplingResult) return;
    
    const blob = generateExcelFile(samplingResult.data);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sampled_data.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Excel数据采样工具</h1>
          <p className="text-gray-600">基于属性组合的智能数据采样</p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">上传Excel文件</h2>
            <FileUpload onFileProcessed={handleFileProcessed} />
          </div>
          
          {excelData && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">选择属性组合</h2>
                <AttributeSelector
                  attributes={excelData.attributes}
                  onCombinationsChange={handleCombinationsChange}
                  initialCombinations={combinations}
                />
              </div>
              
              {combinations.length > 0 && (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleSample}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    执行采样
                  </button>
                  
                  {samplingResult && (
                    <button
                      onClick={handleDownload}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      下载结果
                    </button>
                  )}
                </div>
              )}
              
              {samplingResult && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">采样结果</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">采样数据行数</span>
                      <span className="text-lg font-medium text-gray-900">{samplingResult.data.length}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">覆盖率</h3>
                      {Object.entries(samplingResult.coverage).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">{key}</span>
                          <span className={`font-medium ${
                            value === 1 ? 'text-green-500' : 'text-yellow-500'
                          }`}>
                            {value === 1 ? '100%' : '未完全覆盖'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
} 