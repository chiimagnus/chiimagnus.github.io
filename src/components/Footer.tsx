import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white text-opacity-80 text-xs text-center py-4 px-8 mt-auto">
      <div className="flex justify-between items-center">
        <span>© {currentYear} 𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼. 保留所有权利。</span>
        <div className="flex items-center space-x-4">
          <span>Update: 2025-06-14 Saturday</span>
          <div className="flex space-x-1 bg-black bg-opacity-50 px-2 py-1 rounded">
            {'00000812'.split('').map((digit, index) => (
              <span key={index} className="bg-gray-700 text-white px-1 py-0.5 rounded-sm text-xs">{digit}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 