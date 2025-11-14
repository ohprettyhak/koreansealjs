'use client';

import type { CompanySealConfig } from '@koreansealjs/core';
import { CompanySealCanvas } from '@koreansealjs/react';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Select, Slider } from '~/components/ui';

const DEFAULT_CONFIG: CompanySealConfig = {
  circularText: '주식회사예제',
  centerText: '株式會社',
  sealSize: 128,
  strokeWidthRatio: 0.02,
  markerType: 'star',
  fontFamily: 'Noto Serif KR',
};

export const Demo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<CompanySealConfig>(DEFAULT_CONFIG);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const drawSeal = async () => {
      setError(null);
      try {
        const seal = new CompanySealCanvas(canvasRef.current!);
        await seal.draw(config);
      } catch (err) {
        setError(err instanceof Error ? err.message : '도장 그리기 실패');
        console.error(err);
      }
    };

    void drawSeal();
  }, [config]);

  const handleExportPNG = () => {
    if (!canvasRef.current) return;

    try {
      const seal = new CompanySealCanvas(canvasRef.current);
      const filename = config.circularText.trim() || 'company-seal';
      const sanitizedFilename = filename.replace(/[<>:"/\\|?*]/g, '').trim() || 'company-seal';
      seal.exportToPNG(`${sanitizedFilename}.png`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PNG 내보내기 실패');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="card-primary flex h-fit flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="label-base">원형 텍스트</label>
            <Input
              value={config.circularText}
              onChange={e => setConfig(prev => ({ ...prev, circularText: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">중앙 텍스트</label>
            <Input
              value={config.centerText}
              onChange={e => setConfig(prev => ({ ...prev, centerText: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
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

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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

      <div className="card-preview flex h-fit shrink-0 flex-col gap-4 p-4 md:w-80">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base text-primary">미리보기</h2>
          {error && <span className="text-red-600 text-xs">오류</span>}
        </div>

        <div className="transparent-layer flex items-center justify-center p-4">
          <canvas ref={canvasRef} />
        </div>

        <Button type="button" onClick={handleExportPNG} disabled={!!error}>
          PNG로 내보내기 →
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
