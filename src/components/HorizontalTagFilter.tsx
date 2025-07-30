import React from 'react';
import { X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const HorizontalTagFilter: React.FC = () => {
  const { selectedTags, setSelectedTags, availableTags } = useSearch();

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearAll = () => {
    setSelectedTags([]);
  };

  const getTagColor = (tag: string) => {
    if (tag.includes('归档')) return 'bg-red-400/20 text-red-300 border-red-400/30';
    if (tag === 'iOS') return 'bg-blue-400/20 text-blue-300 border-blue-400/30';
    if (tag === 'macOS') return 'bg-purple-400/20 text-purple-300 border-purple-400/30';
    if (tag === 'React') return 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30';
    if (tag === 'TypeScript') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (tag === 'Plugin') return 'bg-green-400/20 text-green-300 border-green-400/30';
    if (tag === 'swiftUI') return 'bg-orange-400/20 text-orange-300 border-orange-400/30';
    if (tag.includes('语音')) return 'bg-pink-400/20 text-pink-300 border-pink-400/30';
    return 'bg-white/20 text-white border-white/30';
  };

  const getSelectedTagColor = (tag: string) => {
    if (tag.includes('归档')) return 'bg-red-400 text-red-900 border-red-400';
    if (tag === 'iOS') return 'bg-blue-400 text-blue-900 border-blue-400';
    if (tag === 'macOS') return 'bg-purple-400 text-purple-900 border-purple-400';
    if (tag === 'React') return 'bg-cyan-400 text-cyan-900 border-cyan-400';
    if (tag === 'TypeScript') return 'bg-blue-500 text-blue-900 border-blue-500';
    if (tag === 'Plugin') return 'bg-green-400 text-green-900 border-green-400';
    if (tag === 'swiftUI') return 'bg-orange-400 text-orange-900 border-orange-400';
    if (tag.includes('语音')) return 'bg-pink-400 text-pink-900 border-pink-400';
    return 'bg-white text-gray-900 border-white';
  };

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3 w-full">
      {/* 清除按钮 */}
      {selectedTags.length > 0 && (
        <button
          onClick={handleClearAll}
          className="flex items-center space-x-1 text-xs text-white/60 hover:text-white/80 transition-colors whitespace-nowrap flex-shrink-0"
        >
          <X size={14} />
          <span>清除</span>
        </button>
      )}

      {/* 水平滚动标签容器 */}
      <div className="flex-1 overflow-x-auto scrollbar-hide" style={{ minWidth: 0 }}>
        <div className="flex space-x-2 pb-1" style={{ width: 'max-content' }}>
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`
                  text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 
                  hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0
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

      {/* 选中计数 */}
      {selectedTags.length > 0 && (
        <div className="text-xs text-white/60 whitespace-nowrap">
          {selectedTags.length}个
        </div>
      )}
    </div>
  );
};

export default HorizontalTagFilter;
