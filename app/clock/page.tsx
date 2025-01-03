'use client';

import { useEffect, useRef } from 'react';

const AnalogClock = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawClockFrame = (options: {
    ctx: CanvasRenderingContext2D;
    radius: number;
    fillStyle: CanvasFillStrokeStyles['fillStyle'];
    strokeStyle: CanvasFillStrokeStyles['strokeStyle'];
    lineWidth: CanvasPathDrawingStyles['lineWidth'];
    lineCap: CanvasPathDrawingStyles['lineCap'];
  }) => {
    const { ctx, radius, fillStyle, strokeStyle, lineWidth, lineCap } = options;

    ctx.beginPath();
    ctx.arc(0, 0, radius - lineWidth / 2, 0, 2 * Math.PI);

    ctx.fillStyle = fillStyle;
    ctx.fill();

    ctx.strokeStyle = strokeStyle;
    ctx.lineCap = lineCap;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  const drawMarks = (options: {
    ctx: CanvasRenderingContext2D;
    num: number;
    radius: number;
    offset: number;
    length: number;
    strokeStyle: CanvasFillStrokeStyles['strokeStyle'];
    lineWidth: CanvasPathDrawingStyles['lineWidth'];
    lineCap: CanvasPathDrawingStyles['lineCap'];
  }) => {
    const {
      ctx,
      num,
      radius,
      offset,
      length,
      strokeStyle,
      lineWidth,
      lineCap,
    } = options;

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;

    for (let i = 0; i < num; i++) {
      const angle = (i * Math.PI * 2) / num;
      const vec = radius - offset - lineWidth;
      const x1 = Math.cos(angle) * (vec - length);
      const y1 = Math.sin(angle) * (vec - length);
      const x2 = Math.cos(angle) * vec;
      const y2 = Math.sin(angle) * vec;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const drawHand = (options: {
    ctx: CanvasRenderingContext2D;
    angle: number;
    offset: number;
    length: number;
    strokeStyle: CanvasFillStrokeStyles['strokeStyle'];
    lineWidth: CanvasPathDrawingStyles['lineWidth'];
    lineCap: CanvasPathDrawingStyles['lineCap'];
  }) => {
    const { ctx, angle, offset, length, strokeStyle, lineWidth, lineCap } =
      options;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.beginPath();
    ctx.moveTo(offset, offset);
    ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawClock = () => {
      const width = canvas.width;
      const height = canvas.height;
      const radius = Math.min(width, height) / 2;

      // Clear & Init clock
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI / 2);

      // Draw clock frame
      drawClockFrame({
        ctx,
        radius,
        fillStyle: '#fff',
        strokeStyle: '#000',
        lineWidth: 5,
        lineCap: 'round',
      });

      // Draw hour marks
      drawMarks({
        ctx,
        num: 12,
        radius,
        offset: 0,
        length: 15,
        strokeStyle: '#000',
        lineWidth: 3,
        lineCap: 'round',
      });

      // Draw minute marks
      drawMarks({
        ctx,
        num: 60,
        radius,
        offset: 0,
        length: 10,
        strokeStyle: '#000',
        lineWidth: 1,
        lineCap: 'round',
      });

      // Draw hands
      const now = new Date();
      const hour = now.getHours() % 12;
      const minute = now.getMinutes();
      const second = now.getSeconds();
      const millisecond = now.getMilliseconds();

      // Hour hand
      drawHand({
        ctx,
        angle: ((hour + minute / 60) * Math.PI) / 6,
        offset: 0,
        length: radius * 0.55,
        strokeStyle: '#000',
        lineWidth: 6,
        lineCap: 'round',
      });

      // Minute hand
      drawHand({
        ctx,
        angle: ((minute + second / 60) * Math.PI) / 30,
        offset: 0,
        length: radius * 0.85,
        strokeStyle: '#000',
        lineWidth: 4,
        lineCap: 'round',
      });

      // Second hand
      drawHand({
        ctx,
        angle: ((second + millisecond / 1000) * Math.PI) / 30,
        offset: 0,
        length: radius * 0.9,
        strokeStyle: '#f00',
        lineWidth: 2,
        lineCap: 'round',
      });

      ctx.restore();
    };

    const updateClock = () => {
      drawClock();
      const now = new Date();
      const delay = 1000 - now.getMilliseconds();
      setTimeout(updateClock, delay);
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      drawClock();
    };

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    updateClock();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default function ClockPage() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <AnalogClock />
    </div>
  );
}
