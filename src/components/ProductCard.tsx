import React from 'react';

interface ProductCardProps {
  title: string;
  description: string;
  tags: string[];
  status?: string;
  links: Array<{ text: string; url: string; }>;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, tags, status, links }) => {
  const getTagColor = (tag: string) => {
    if (tag.includes('发布')) return 'bg-yellow-400 text-yellow-900';
    if (tag.includes('归档')) return 'bg-red-400 text-red-900';
    if (tag.includes('已发布')) return 'bg-green-400 text-green-900';
    return 'bg-white bg-opacity-25 text-white';
  };
  
  return (
    <div className="glass-card p-5 flex flex-col">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-200 text-sm mb-4 flex-grow">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span key={index} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getTagColor(tag)}`}>
            {tag}
          </span>
        ))}
        {status && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400 text-blue-900">
            {status}
          </span>
        )}
      </div>
      <div className="mt-auto space-y-1">
        {links.map((link, index) => (
          <a key={index} href={link.url} className="block text-sm font-semibold text-purple-300 hover:text-purple-200">
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProductCard; 