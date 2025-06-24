export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    topBarColor: string;
  };
}

export const themes: Theme[] = [
  {
    name: 'rainbow',
    colors: {
      primary: '#ff6b6b',
      secondary: '#6c5ce7',
      accent: '#ff6b6b',
      gradient: 'linear-gradient(45deg, #ff6b6b 0%, #ffd93d 20%, #6c5ce7 40%, #00b894 60%, #0984e3 80%, #e84393 100%)',
      topBarColor: '#ff6b6b',
    },
  },
  {
    name: 'aurora',
    colors: {
      primary: '#2d3436',
      secondary: '#81ecec',
      accent: '#2d3436',
      gradient: 'linear-gradient(45deg, #2d3436 0%, #6c5ce7 30%, #00b894 60%, #81ecec 100%)',
      topBarColor: '#2d3436',
    },
  },
  {
    name: 'sunset-beach',
    colors: {
      primary: '#e17055',
      secondary: '#00cec9',
      accent: '#e17055',
      gradient: 'linear-gradient(45deg, #e17055 0%, #fdcb6e 30%, #0984e3 70%, #00cec9 100%)',
      topBarColor: '#e17055',
    },
  },
  {
    name: 'cherry-blossom',
    colors: {
      primary: '#e84393',
      secondary: '#dfe6e9',
      accent: '#e84393',
      gradient: 'linear-gradient(45deg, #e84393 0%, #fd79a8 30%, #fab1a0 60%, #dfe6e9 100%)',
      topBarColor: '#e84393',
    },
  },
  {
    name: 'autumn',
    colors: {
      primary: '#d63031',
      secondary: '#ffeaa7',
      accent: '#d63031',
      gradient: 'linear-gradient(45deg, #d63031 0%, #fdcb6e 50%, #ffeaa7 100%)',
      topBarColor: '#d63031',
    },
  },
  {
    name: 'neon-noir',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ff00ff',
      gradient: 'linear-gradient(45deg, #000000 0%, #1a1a1a 30%, #ff00ff 60%, #00ffff 80%, #000000 100%)',
      topBarColor: '#000000',
    },
  },
];

export const defaultTheme = themes[0]; 