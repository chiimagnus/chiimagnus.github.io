import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-600 text-sm text-center py-4 border-t">
      <div className="max-w-4xl mx-auto">
        <p>&copy; {currentYear} 𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼. 保留所有权利。</p>
        <div className="flex justify-center items-center space-x-4 mt-2">
          <span>Update: 2024-07-21</span>
          <a href="https://github.com/chiimagnus/chiiBlog" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
            Source Code
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 