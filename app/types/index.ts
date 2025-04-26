export interface ExcelAttribute {
  name: string;
  values: string[];
}

export interface AttributeCombination {
  attributes: string[];
  required: boolean;
}

export interface SamplingResult {
  data: Record<string, string>[];
  coverage: {
    [key: string]: number; // 属性组合 -> 覆盖率
  };
}

export interface ExcelData {
  headers: string[];
  data: Record<string, string>[];
  attributes: ExcelAttribute[];
} 