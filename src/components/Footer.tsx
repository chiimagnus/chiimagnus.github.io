import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-white text-opacity-80 text-xs text-center py-4 px-8 mt-auto">
      <div className="flex justify-between items-center">
        <span>© 2025 𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼. 保留所有权利。</span>
        <div className="flex items-center space-x-4">
          <span>Update: 2025-06-27 Friday</span>
          <div>
            <img 
              src="https://profile-counter.glitch.me/chii_magnus'blog/count.svg" 
              alt="访问计数"
              className="w-20"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 