import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-white text-opacity-80 text-xs text-center py-4 px-8 mt-auto">
      <div className="flex justify-between items-center">
        <span>© 2025 𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼. 保留所有权利。</span>
        <div className="flex items-center space-x-4">
          <span>Update: 2025-06-14 Saturday</span>
          <div className="flex space-x-0.5 bg-black bg-opacity-50 px-2 py-1 rounded">
            {'00000812'.split('').map((digit, index) => (
              <span key={index} className="bg-gray-800 text-white font-mono px-1.5 py-0.5 rounded-sm text-sm tracking-widest">{digit}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 