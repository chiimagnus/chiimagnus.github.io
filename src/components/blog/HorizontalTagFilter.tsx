import React from 'react';
import { X } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

const HorizontalTagFilter: React.FC = () => {
  const { selectedTags, setSelectedTags, availableTags } = useSearch();

  const handleTagToggle = (tag: string) => {
    // 单选模式：如果点击已选中的标签，则取消选择；否则选择新标签
    if (selectedTags.includes(tag)) {
      setSelectedTags([]);
    } else {
      setSelectedTags([tag]);
    }
  };

  const handleClearAll = () => {
    setSelectedTags([]);
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
    <div className="flex items-center w-full" style={{ minWidth: 0 }}>
      {/* 清除按钮 */}
      {selectedTags.length > 0 && (
        <button
          onClick={handleClearAll}
          className="flex items-center space-x-1 text-xs text-white/60 hover:text-white/80 transition-colors whitespace-nowrap flex-shrink-0 touch-manipulation min-h-[32px] px-1 mr-2"
        >
          <X size={14} />
          <span className="hidden sm:inline">清除</span>
        </button>
      )}

      {/* 水平滚动标签容器 */}
      <div
        className="overflow-x-auto scrollbar-hide py-1"
        style={{
          flex: '1 1 0%',
          minWidth: 0,
          width: 0
        }}
      >
        <div className="flex space-x-2 sm:space-x-2" style={{ width: 'max-content' }}>
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`
                  text-xs sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-full border
                  transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0
                  touch-manipulation min-h-[32px] sm:min-h-auto
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

      {/* 选中状态 */}
      {selectedTags.length > 0 && (
        <div className="text-xs text-white/60 whitespace-nowrap flex-shrink-0 ml-2">
          ✓
        </div>
      )}
    </div>
  );
};

export default HorizontalTagFilter;
