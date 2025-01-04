import { useEffect, useRef } from "react";

interface IAnalogClockFrameOptions {
  radius: number;
  fillStyle: CanvasFillStrokeStyles["fillStyle"];
  strokeStyle: CanvasFillStrokeStyles["strokeStyle"];
  lineWidth: CanvasPathDrawingStyles["lineWidth"];
  lineCap: CanvasPathDrawingStyles["lineCap"];
}

interface IAnalogClockMarksOptions {
  num: number;
  radius: number;
  offset: number;
  length: number;
  strokeStyle: CanvasFillStrokeStyles["strokeStyle"];
  lineWidth: CanvasPathDrawingStyles["lineWidth"];
  lineCap: CanvasPathDrawingStyles["lineCap"];
}

interface IAnalogClockHandOptions {
  angle: number;
  offset: number;
  length: number;
  strokeStyle: CanvasFillStrokeStyles["strokeStyle"];
  lineWidth: CanvasPathDrawingStyles["lineWidth"];
  lineCap: CanvasPathDrawingStyles["lineCap"];
}

export interface IAnalogClockProps {
  frameOptions?: Partial<IAnalogClockFrameOptions>;
  hourMarksOptions?: Partial<Omit<IAnalogClockMarksOptions, "num">>;
  minuteMarksOptions?: Partial<Omit<IAnalogClockMarksOptions, "num">>;
  hourHandOptions?: Partial<Omit<IAnalogClockHandOptions, "angle">>;
  minuteHandOptions?: Partial<Omit<IAnalogClockHandOptions, "angle">>;
  secondHandOptions?: Partial<Omit<IAnalogClockHandOptions, "angle">>;
}

export const AnalogClock = ({
  frameOptions = {},
  hourMarksOptions = {},
  minuteMarksOptions = {},
  hourHandOptions = {},
  minuteHandOptions = {},
  secondHandOptions = {},
}: IAnalogClockProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawClockFrame = (ctx: CanvasRenderingContext2D, options: IAnalogClockFrameOptions) => {
    const { radius, fillStyle, strokeStyle, lineWidth, lineCap } = options;

    ctx.beginPath();
    ctx.arc(0, 0, radius - lineWidth / 2, 0, 2 * Math.PI);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.stroke();
  };

  const drawMarks = (ctx: CanvasRenderingContext2D, options: IAnalogClockMarksOptions) => {
    const { num, radius, offset, length, strokeStyle, lineWidth, lineCap } = options;

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

  const drawHand = (ctx: CanvasRenderingContext2D, options: IAnalogClockHandOptions) => {
    const { angle, offset, length, strokeStyle, lineWidth, lineCap } = options;

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.beginPath();
    ctx.moveTo(offset, offset);
    ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
    ctx.stroke();
  };

  const drawClock = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 2);

    drawClockFrame(ctx, {
      radius: radius * (frameOptions.radius || 1),
      fillStyle: frameOptions.fillStyle || "#fff",
      strokeStyle: frameOptions.strokeStyle || "#000",
      lineWidth: frameOptions.lineWidth || 5,
      lineCap: frameOptions.lineCap || "round",
    });

    drawMarks(ctx, {
      radius: radius * (hourMarksOptions.radius || 1),
      num: 12,
      offset: hourMarksOptions.offset || 0,
      length: hourMarksOptions.length || 15,
      strokeStyle: hourMarksOptions.strokeStyle || "#000",
      lineWidth: hourMarksOptions.lineWidth || 3,
      lineCap: hourMarksOptions.lineCap || "round",
    });

    drawMarks(ctx, {
      radius: radius * (minuteMarksOptions.radius || 1),
      num: 60,
      offset: minuteMarksOptions.offset || 0,
      length: minuteMarksOptions.length || 10,
      strokeStyle: minuteMarksOptions.strokeStyle || "#000",
      lineWidth: minuteMarksOptions.lineWidth || 1,
      lineCap: minuteMarksOptions.lineCap || "round",
    });

    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const millisecond = now.getMilliseconds();

    drawHand(ctx, {
      angle: ((hour + minute / 60) * Math.PI) / 6,
      offset: hourHandOptions.offset || 0,
      length: radius * (hourHandOptions.length || 0.55),
      strokeStyle: hourHandOptions.strokeStyle || "#000",
      lineWidth: hourHandOptions.lineWidth || 6,
      lineCap: hourHandOptions.lineCap || "round",
    });

    drawHand(ctx, {
      angle: ((minute + second / 60) * Math.PI) / 30,
      offset: minuteHandOptions.offset || 0,
      length: radius * (minuteHandOptions.length || 0.85),
      strokeStyle: minuteHandOptions.strokeStyle || "#000",
      lineWidth: minuteHandOptions.lineWidth || 4,
      lineCap: minuteHandOptions.lineCap || "round",
    });

    drawHand(ctx, {
      angle: ((second + millisecond / 1000) * Math.PI) / 30,
      offset: secondHandOptions.offset || 0,
      length: radius * (secondHandOptions.length || 0.9),
      strokeStyle: secondHandOptions.strokeStyle || "#f00",
      lineWidth: secondHandOptions.lineWidth || 2,
      lineCap: secondHandOptions.lineCap || "round",
    });

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      drawClock(ctx, canvas);
    };

    const updateClock = () => {
      drawClock(ctx, canvas);
      setTimeout(updateClock, 1000 - new Date().getMilliseconds());
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    updateClock();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}></canvas>;
};
