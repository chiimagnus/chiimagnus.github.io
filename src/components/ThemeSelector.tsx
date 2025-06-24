import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSelector = () => {
  const { setTheme, availableThemes, theme: currentTheme } = useTheme();

  return (
    <div>
      <h3 className="text-base font-semibold mb-3 text-gray-300">主题切换</h3>
      <div className="flex flex-nowrap items-center justify-between">
        {availableThemes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => setTheme(theme.name)}
            className={`w-7 h-7 rounded-full cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-110 focus:outline-none ${
              currentTheme.name === theme.name 
                ? 'ring-2 ring-offset-2 ring-accent ring-offset-gray-800' 
                : ''
            }`}
            style={{ background: theme.colors.gradient }}
            aria-label={`Select ${theme.name} theme`}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
}; 