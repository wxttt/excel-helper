import { useState, useEffect } from 'react';
import { ExcelAttribute, AttributeCombination } from '../types';

interface AttributeSelectorProps {
  attributes: ExcelAttribute[];
  onCombinationsChange: (combinations: AttributeCombination[]) => void;
  initialCombinations?: AttributeCombination[];
}

export const AttributeSelector = ({ 
  attributes, 
  onCombinationsChange,
  initialCombinations = [] 
}: AttributeSelectorProps) => {
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [combinations, setCombinations] = useState<AttributeCombination[]>(initialCombinations);
  
  // 响应外部组合变化
  useEffect(() => {
    setCombinations(initialCombinations);
  }, [initialCombinations]);
  
  const handleAttributeToggle = (attribute: string) => {
    setSelectedAttributes(prev => {
      if (prev.includes(attribute)) {
        return prev.filter(a => a !== attribute);
      }
      return [...prev, attribute];
    });
  };
  
  const handleAddCombination = () => {
    if (selectedAttributes.length === 0) {
      alert('请至少选择一个属性');
      return;
    }
    
    const newCombination: AttributeCombination = {
      attributes: [...selectedAttributes],
      required: true
    };
    
    setCombinations(prev => [...prev, newCombination]);
    setSelectedAttributes([]);
    onCombinationsChange([...combinations, newCombination]);
  };
  
  const handleRemoveCombination = (index: number) => {
    setCombinations(prev => {
      const newCombinations = prev.filter((_, i) => i !== index);
      onCombinationsChange(newCombinations);
      return newCombinations;
    });
  };
  
  const handleToggleRequired = (index: number) => {
    setCombinations(prev => {
      const newCombinations = prev.map((comb, i) => 
        i === index ? { ...comb, required: !comb.required } : comb
      );
      onCombinationsChange(newCombinations);
      return newCombinations;
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">选择属性</h3>
        <div className="flex flex-wrap gap-2">
          {attributes.map(attr => (
            <button
              key={attr.name}
              onClick={() => handleAttributeToggle(attr.name)}
              className={`
                inline-flex items-center justify-center
                px-4 py-2
                rounded-full
                text-sm font-medium
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${selectedAttributes.includes(attr.name)
                  ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }
              `}
            >
              {attr.name}
            </button>
          ))}
        </div>
        
        {selectedAttributes.length > 0 && (
          <div className="mt-4 flex items-center">
            <span className="text-sm text-slate-500 mr-2">已选择: </span>
            <div className="flex flex-wrap gap-2">
              {selectedAttributes.map(attr => (
                <span
                  key={attr}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddCombination}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            添加到组合
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">属性组合</h3>
        <div className="space-y-4">
          {combinations.map((comb, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">组合 {index + 1}:</span>
                <div className="flex flex-wrap gap-2">
                  {comb.attributes.map(attr => (
                    <span
                      key={attr}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleRequired(index)}
                  className={`
                    text-sm font-medium
                    ${comb.required
                      ? 'text-emerald-600 hover:text-emerald-700'
                      : 'text-slate-500 hover:text-slate-600'
                    }
                  `}
                >
                  {comb.required ? '必需' : '可选'}
                </button>
                <button
                  onClick={() => handleRemoveCombination(index)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 