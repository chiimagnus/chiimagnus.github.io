import React from 'react';
import { useSearch } from '../../context/SearchContext';

const TagFilter: React.FC = () => {
  const { selectedTags, setSelectedTags, availableTags } = useSearch();

  const handleTagToggle = (tag: string) => {
    // 单选模式：如果点击已选中的标签，则取消选择；否则选择新标签
    if (selectedTags.includes(tag)) {
      setSelectedTags([]);
    } else {
      setSelectedTags([tag]);
    }
  };



  const getTagColor = (tag: string) => {
    if (tag === 'DOING') return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30';
    if (tag === 'DONE') return 'bg-green-400/20 text-green-300 border-green-400/30';
    if (tag === 'Archive') return 'bg-red-400/20 text-red-300 border-red-400/30';
    return 'bg-white/20 text-white border-white/30';
  };

  const getSelectedTagColor = (tag: string) => {
    if (tag === 'DOING') return 'bg-yellow-400 text-yellow-900 border-yellow-400';
    if (tag === 'DONE') return 'bg-green-400 text-green-900 border-green-400';
    if (tag === 'Archive') return 'bg-red-400 text-red-900 border-red-400';
    return 'bg-white text-gray-900 border-white';
  };

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* 标题 */}
      <div>
        <h3 className="text-sm font-medium text-white/80">产品标签</h3>
      </div>

      {/* 标签列表 */}
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`
                text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all duration-200 
                hover:scale-105 active:scale-95
                ${isSelected 
                  ? getSelectedTagColor(tag) 
                  : getTagColor(tag) + ' hover:bg-white/30'
                }
              `}
            >
              {tag}
            </button>
          );
        })}
      </div>


    </div>
  );
};

export default TagFilter;
