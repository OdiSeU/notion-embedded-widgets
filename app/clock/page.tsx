'use client';

import { useEffect, useRef } from 'react';

const AnalogClock = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawClock = () => {
      const now = new Date();
      const width = canvas.width;
      const height = canvas.height;
      const radius = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Adjust rotation to correct orientation
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-Math.PI / 2);

      // Draw clock face
      ctx.beginPath();
      ctx.arc(0, 0, radius - 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Draw hour marks
      ctx.lineWidth = 3;
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x1 = Math.cos(angle) * (radius - 20);
        const y1 = Math.sin(angle) * (radius - 20);
        const x2 = Math.cos(angle) * (radius - 10);
        const y2 = Math.sin(angle) * (radius - 10);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw minute marks
      ctx.lineWidth = 1;
      for (let i = 0; i < 60; i++) {
        const angle = (i * Math.PI) / 30;
        const x1 = Math.cos(angle) * (radius - 15);
        const y1 = Math.sin(angle) * (radius - 15);
        const x2 = Math.cos(angle) * (radius - 10);
        const y2 = Math.sin(angle) * (radius - 10);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw hands
      const hour = now.getHours() % 12;
      const minute = now.getMinutes();
      const second = now.getSeconds();
      const millisecond = now.getMilliseconds();

      // Hour hand
      const hourAngle = ((hour + minute / 60) * Math.PI) / 6;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(hourAngle) * (radius / 2),
        Math.sin(hourAngle) * (radius / 2)
      );
      ctx.stroke();

      // Minute hand
      const minuteAngle = ((minute + second / 60) * Math.PI) / 30;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(minuteAngle) * (radius - 30),
        Math.sin(minuteAngle) * (radius - 30)
      );
      ctx.stroke();

      // Second hand
      const secondAngle = ((second + millisecond / 1000) * Math.PI) / 30;
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(secondAngle) * (radius - 20),
        Math.sin(secondAngle) * (radius - 20)
      );
      ctx.stroke();

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
  return <AnalogClock />;
}
