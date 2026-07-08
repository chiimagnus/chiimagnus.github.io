function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '';
}

function setTheme(name) {
  state.theme = themes.find((theme) => theme.name === name) || state.theme;
  const { colors } = state.theme;
  const root = document.documentElement;
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--secondary-color', colors.secondary);
  root.style.setProperty('--accent-color', colors.accent);
  root.style.setProperty('--bg-gradient', colors.gradient);
  root.style.setProperty('--link-color', colors.primary);
  root.style.setProperty('--hover-color', colors.secondary);
  root.style.setProperty('--primary-color-rgb', hexToRgb(colors.primary));
  root.style.setProperty('--secondary-color-rgb', hexToRgb(colors.secondary));
  document.body.style.backgroundColor = colors.bottomBarColor;
  document.body.style.backgroundImage = colors.gradient;
  document.body.style.backgroundSize = '400% 400%';
  document.body.style.backgroundRepeat = 'no-repeat';
  $('meta[name="theme-color"]')?.setAttribute('content', colors.topBarColor);
  localStorage.setItem('theme', state.theme.name);
}

function startGradientClock() {
  const startedAt = performance.now();
  const tick = (now) => {
    const phase = ((now - startedAt) / 15000) % 1;
    const wave = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
    document.body.style.backgroundPosition = `${(wave * 100).toFixed(3)}% 50%`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
