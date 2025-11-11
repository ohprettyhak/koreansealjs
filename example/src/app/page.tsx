'use client';

import { CompanySealCanvas, type CompanySealConfig } from '@koreansealjs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<CompanySealConfig>({
    circularText: '주식회사예제',
    centerText: '대표이사',
    sealSize: 300,
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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center font-bold text-3xl text-gray-900">
          회사 도장 생성기 테스트
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-gray-800 text-xl">설정</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm">
                  원형 텍스트 (circularText)
                </label>
                <input
                  type="text"
                  value={config.circularText}
                  onChange={e => setConfig({ ...config, circularText: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="주식회사코쏘"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm">
                  중앙 텍스트 (centerText)
                </label>
                <input
                  type="text"
                  value={config.centerText}
                  onChange={e => setConfig({ ...config, centerText: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="株式會社"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-gray-700 text-sm">
                    도장 크기 (sealSize)
                  </label>
                  <input
                    type="number"
                    value={config.sealSize}
                    onChange={e =>
                      setConfig({
                        ...config,
                        sealSize: Number.parseInt(e.target.value, 10) || 300,
                      })
                    }
                    min={50}
                    max={2000}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium text-gray-700 text-sm">
                    선 두께 비율 (strokeWidthRatio)
                  </label>
                  <input
                    type="number"
                    value={config.strokeWidthRatio}
                    onChange={e =>
                      setConfig({
                        ...config,
                        strokeWidthRatio: Number.parseFloat(e.target.value) || 0.033,
                      })
                    }
                    min={0.01}
                    max={0.49}
                    step={0.001}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <p className="mt-1 text-gray-500 text-xs">0.01 ~ 0.49 (1% ~ 49%)</p>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm">
                  마커 타입 (markerType)
                </label>
                <select
                  value={config.markerType}
                  onChange={e =>
                    setConfig({
                      ...config,
                      markerType: e.target.value as 'dot' | 'star',
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="dot">점 (dot)</option>
                  <option value="star">별 (star)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm">
                  폰트 (fontFamily)
                </label>
                <input
                  type="text"
                  value={config.fontFamily}
                  onChange={e => setConfig({ ...config, fontFamily: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Noto Serif KR"
                />
                <p className="mt-1 text-gray-500 text-xs">시스템에 설치된 폰트명을 입력하세요</p>
              </div>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={drawSeal}
                  disabled={isDrawing}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isDrawing ? '그리는 중...' : '도장 그리기'}
                </button>
                <button
                  type="button"
                  onClick={exportPNG}
                  className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  PNG 다운로드
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-gray-800 text-xl">미리보기</h2>
            <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-gray-100 p-8">
              <canvas ref={canvasRef} className="h-auto max-w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
