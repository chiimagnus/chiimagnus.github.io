import React, { useRef, useEffect, useState, ReactNode } from 'react';

// Utility functions adapted from the original script
function smoothStep(a: number, b: number, t: number): number {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function roundedRectSDF(x: number, y: number, width: number, height: number, radius: number): number {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}

// Generate unique ID
function generateId(): string {
  return 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
}

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
}

const LiquidGlass: React.FC<LiquidGlassProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const feDisplacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
  
  const [id] = useState(generateId());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const updateShader = () => {
      if (!canvasRef.current || !feImageRef.current || !feDisplacementMapRef.current) return;

      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      
      if (w === 0 || h === 0) return;

      const canvas = canvasRef.current;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      
      const data = new Uint8ClampedArray(w * h * 4);
      let maxScale = 0;
      const rawValues: number[] = [];
      
      // Fragment shader logic from the original script
      const fragment = (uv: { x: number; y: number; }) => {
        const ix = uv.x - 0.5;
        const iy = uv.y - 0.5;
        // Use aspect ratio to avoid stretching
        const aspectRatio = w / h;
        const ixAdjusted = ix * aspectRatio;

        const distanceToEdge = roundedRectSDF(ixAdjusted, iy, 0.4 * aspectRatio, 0.4, 0.4); 
        const displacement = smoothStep(0.8, 0.0, distanceToEdge - 0.15);
        const scaled = smoothStep(0, 1, displacement);
        return { x: ix * scaled + 0.5, y: iy * scaled + 0.5 };
      };
      
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % w;
        const y = Math.floor(i / 4 / w);
        const pos = fragment({ x: x / w, y: y / h });
        const dx = pos.x * w - x;
        const dy = pos.y * h - y;
        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
        rawValues.push(dx, dy);
      }
      
      // 参数-扭曲度 maxScale
      maxScale = Math.max(1, maxScale * 1); 

      let index = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = rawValues[index++] / maxScale + 0.5;
        const g = rawValues[index++] / maxScale + 0.5;
        data[i] = r * 255;
        data[i + 1] = g * 255;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }
      
      context.putImageData(new ImageData(data, w, h), 0, 0);
      feImageRef.current.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL());
      feDisplacementMapRef.current.setAttribute('scale', maxScale.toString());
    };

    updateShader(); // Initial render
    
    // 使用 ResizeObserver 监听尺寸变化并更新效果
    const resizeObserver = new ResizeObserver(() => {
        updateShader();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
    };
  }, [id]);

  return (
    <div
      ref={containerRef}
      className={className}
        style={{
        // 参数-模糊度 blur
        // 参数-对比度 contrast
        // 参数-亮度 brightness
        // 参数-饱和度 saturate
        backdropFilter: `url(#${id}_filter) blur(1px) contrast(1.2) brightness(1.05) saturate(1.1)`,
        WebkitBackdropFilter: `url(#${id}_filter) blur(1px) contrast(1.2) brightness(1.05) saturate(1.1)`,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)',
      }}
    >
      {children}
      <svg width="0" height="0" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id={`${id}_filter`} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage ref={feImageRef} result="map" />
            <feDisplacementMap
              ref={feDisplacementMapRef}
              in="SourceGraphic"
              in2="map"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default LiquidGlass; 