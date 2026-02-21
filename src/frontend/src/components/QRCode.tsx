import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 256 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code generation using a library would be better
    // For now, we'll create a placeholder pattern
    const moduleSize = 8;
    const modules = Math.floor(size / moduleSize);
    
    canvas.width = size;
    canvas.height = size;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Black modules (simplified pattern)
    ctx.fillStyle = '#000000';
    
    // Create a simple pattern based on the value hash
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i);
      hash = hash & hash;
    }

    // Draw a pattern
    for (let y = 0; y < modules; y++) {
      for (let x = 0; x < modules; x++) {
        const shouldFill = ((x * y + hash) % 3) === 0;
        if (shouldFill) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Draw finder patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
    };

    drawFinderPattern(0, 0);
    drawFinderPattern(size - moduleSize * 7, 0);
    drawFinderPattern(0, size - moduleSize * 7);

  }, [value, size]);

  return (
    <div className="flex justify-center">
      <canvas 
        ref={canvasRef} 
        className="border-4 border-border rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}
