"use client";

import { AnalogClock, IAnalogClockProps } from "@/components/AnalogClock";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

const getParam = <T extends number | string>(
  params: URLSearchParams,
  key: string,
  defaultValue: T
): T => {
  const value = params.get(key);
  if (typeof defaultValue === "number") {
    return (value ? Number(value) : defaultValue) as T;
  }
  if (typeof defaultValue === "string") {
    const temp = value || defaultValue;
    const isHex = /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(temp);

    return `${isHex ? "#" : ""}${temp}` as T;
  }
  return defaultValue;
};

const Clock = () => {
  const params = useSearchParams();

  const clockProps: IAnalogClockProps = useMemo(
    () => ({
      frameOptions: {
        radius: getParam(params, "f.r", 1),
        fillStyle: getParam(params, "f.f", "fff"),
        strokeStyle: getParam(params, "f.s", "000"),
        lineWidth: getParam(params, "f.w", 5),
        lineCap: getParam(params, "f.c", "round") as CanvasLineCap,
      },
      hourMarksOptions: {
        radius: getParam(params, "h.r", 1),
        offset: getParam(params, "h.o", 0),
        length: getParam(params, "h.l", 15),
        strokeStyle: getParam(params, "h.s", "000"),
        lineWidth: getParam(params, "h.w", 3),
        lineCap: getParam(params, "h.c", "round") as CanvasLineCap,
      },
      minuteMarksOptions: {
        radius: getParam(params, "m.r", 1),
        offset: getParam(params, "m.o", 0),
        length: getParam(params, "m.l", 10),
        strokeStyle: getParam(params, "m.s", "000"),
        lineWidth: getParam(params, "m.w", 1),
        lineCap: getParam(params, "m.c", "round") as CanvasLineCap,
      },
      hourHandOptions: {
        offset: getParam(params, "hh.o", 0),
        length: getParam(params, "hh.l", 0.55),
        strokeStyle: getParam(params, "hh.s", "000"),
        lineWidth: getParam(params, "hh.w", 6),
        lineCap: getParam(params, "hh.c", "round") as CanvasLineCap,
      },
      minuteHandOptions: {
        offset: getParam(params, "mh.o", 0),
        length: getParam(params, "mh.l", 0.85),
        strokeStyle: getParam(params, "mh.s", "222"),
        lineWidth: getParam(params, "mh.w", 4),
        lineCap: getParam(params, "mh.c", "round") as CanvasLineCap,
      },
      secondHandOptions: {
        offset: getParam(params, "sh.o", 0),
        length: getParam(params, "sh.l", 0.9),
        strokeStyle: getParam(params, "sh.s", "f00"),
        lineWidth: getParam(params, "sh.w", 2),
        lineCap: getParam(params, "sh.c", "round") as CanvasLineCap,
      },
    }),
    [params]
  );

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <AnalogClock {...clockProps} />
    </div>
  );
};

export default function ClockPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Clock />
    </Suspense>
  );
}
