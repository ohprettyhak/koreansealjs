'use client';

import type { CompanySealConfig } from '@koreansealjs/core';
import { CompanySealCanvas } from '@koreansealjs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Select, Slider } from '~/components/ui';

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
      {/* Settings Panel - Primary Card */}
      <div className="card-primary flex h-fit flex-1 flex-col gap-4 p-4">
        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="label-base">원형 텍스트</label>
            <Input
              value={config.circularText}
              onChange={e => setConfig(prev => ({ ...prev, circularText: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-base">중앙 텍스트</label>
            <Input
              value={config.centerText}
              onChange={e => setConfig(prev => ({ ...prev, centerText: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-base">시작 기호</label>
            <Select
              value={config.markerType}
              onChange={e =>
                setConfig(prev => ({
                  ...prev,
                  markerType: e.target.value as 'dot' | 'star',
                }))
              }
            >
              <option value="dot">점</option>
              <option value="star">별</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-base">폰트</label>
            <Select
              value={config.fontFamily}
              onChange={e => setConfig(prev => ({ ...prev, fontFamily: e.target.value }))}
            >
              <option value="Noto Serif KR">Noto Serif KR</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
            </Select>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="label-base">도장 크기</label>
              <span className="text-secondary text-xs tabular-nums">{config.sealSize}px</span>
            </div>
            <Slider
              value={[config.sealSize]}
              onValueChange={values => setConfig(prev => ({ ...prev, sealSize: values[0] }))}
              min={50}
              max={300}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="label-base">선 두께</label>
              <span className="text-secondary text-xs tabular-nums">
                {config.strokeWidthRatio.toFixed(3)}
              </span>
            </div>
            <Slider
              value={[config.strokeWidthRatio]}
              onValueChange={values =>
                setConfig(prev => ({ ...prev, strokeWidthRatio: values[0] }))
              }
              min={0.01}
              max={0.1}
              step={0.001}
            />
          </div>
        </div>
      </div>

      {/* Preview Panel - Card Preview */}
      <div className="card-preview flex h-fit shrink-0 flex-col gap-4 p-4 md:w-80">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base text-primary">미리보기</h2>
          {error && <span className="text-red-600 text-xs">오류</span>}
        </div>

        {/* Canvas Container */}
        <div className="transparent-layer flex items-center justify-center p-4">
          <canvas ref={canvasRef} />
        </div>

        {/* Export Button */}
        <Button type="button" onClick={exportPNG} disabled={isDrawing || !!error}>
          PNG로 내보내기
        </Button>

        {error && (
          <div className="card-secondary p-3">
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
