import { ExcelData, AttributeCombination, SamplingResult } from '../types';

export const sampleData = (
  excelData: ExcelData,
  combinations: AttributeCombination[]
): SamplingResult => {
  const { data } = excelData;
  const sampledData: Record<string, string>[] = [];
  const coverage: Record<string, number> = {};
  
  // 初始化覆盖率
  combinations.forEach(comb => {
    const key = comb.attributes.join('+');
    coverage[key] = 0;
  });
  
  // 收集所有需要覆盖的属性
  const attributesToCover = new Set<string>();
  combinations.forEach(comb => {
    comb.attributes.forEach(attr => attributesToCover.add(attr));
  });
  
  // 对于每个需要覆盖的属性
  attributesToCover.forEach(attr => {
    // 收集该属性的所有唯一值
    const uniqueValues = new Set<string>();
    data.forEach(row => {
      uniqueValues.add(row[attr]);
    });
    
    // 为每个唯一值选择一行数据
    uniqueValues.forEach(value => {
      // 找到包含该属性值的一行数据
      const matchingRow = data.find(row => row[attr] === value);
      
      if (matchingRow) {
        // 如果这行数据还没有被采样，则添加到采样结果中
        if (!sampledData.some(sampled => sampled[attr] === value)) {
          sampledData.push(matchingRow);
        }
      }
    });
  });
  
  // 更新覆盖率
  combinations.forEach(comb => {
    const key = comb.attributes.join('+');
    const isCovered = comb.attributes.every(attr => {
      const uniqueValues = new Set(data.map(row => row[attr]));
      return uniqueValues.size === 0 || sampledData.some(sampled => uniqueValues.has(sampled[attr]));
    });
    coverage[key] = isCovered ? 1 : 0;
  });
  
  return {
    data: sampledData,
    coverage
  };
}; 