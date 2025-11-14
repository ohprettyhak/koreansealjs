'use client';

import type { CompanySealConfig } from '@koreansealjs/core';
import { CompanySealCanvas } from '@koreansealjs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Slider } from '~/components/ui';

export const Demo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<CompanySealConfig>({
    circularText: '주식회사예제',
    centerText: '대표이사',
    sealSize: 100,
    strokeWidthRatio: 0.02,
    markerType: 'star',
    fontFamily: 'Noto Serif KR',
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drawSeal = useCallback(async () => {
    if (!canvasRef.current) return;

    setIsDrawing(true);
    setError(null);

    try {
      const seal = new CompanySealCanvas(canvasRef.current);
      await seal.draw(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : '도장 그리기 실패');
      console.error(err);
    } finally {
      setIsDrawing(false);
    }
  }, [config]);

  const exportPNG = () => {
    if (!canvasRef.current) return;

    try {
      const seal = new CompanySealCanvas(canvasRef.current);
      seal.exportToPNG('company-seal.png');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PNG 내보내기 실패');
      console.error(err);
    }
  };

  useEffect(() => {
    drawSeal();
  }, [drawSeal]);

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex h-fit flex-1 flex-col gap-3 border-2 border-neutral-400 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <label className="font-medium text-neutral-600 text-xs">원형 텍스트</label>
            <input className="border border-neutral-300 bg-neutral-100 px-2 py-1 text-neutral-950 text-sm" />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="font-medium text-neutral-600 text-xs">중앙 텍스트</label>
            <input className="border border-neutral-300 bg-neutral-100 px-2 py-1 text-neutral-950 text-sm" />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="font-medium text-neutral-600 text-xs">시작 기호</label>
            <select className="border border-neutral-300 bg-neutral-100 px-2 py-1 text-neutral-950 text-sm" />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="font-medium text-neutral-600 text-xs">폰트</label>
            <select className="border border-neutral-300 bg-neutral-100 px-2 py-1 text-neutral-950 text-sm" />
          </div>
        </div>

        <Slider />
      </div>

      <div className="h-fit shrink-0 border-2 border-neutral-500 bg-white p-4">
        <p className="mb-3 font-semibold">미리보기</p>
        <div className="transparent-layer size-fit p-2">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};
