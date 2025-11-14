import { codeToHtml } from 'shiki';
import { CodeBlock } from '~/components/ui';

const installCode = 'npm install @koreansealjs/react';

const usageCode = `import { CompanySeal } from '@koreansealjs/react';
import { useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const drawSeal = async () => {
      const seal = new CompanySeal(canvasRef.current!);
      await seal.draw({
        circularText: '주식회사 예제',
        centerText: '대표이사',
        sealSize: 300,
        strokeWidthRatio: 0.02,
        markerType: 'star',
        fontFamily: 'Noto Serif KR',
      });
    };

    drawSeal();
  }, []);

  return <canvas ref={canvasRef} />;
}`;

export const BrowserContent = async () => {
  const [installHtml, usageHtml] = await Promise.all([
    codeToHtml(installCode, { lang: 'bash', theme: 'github-dark' }),
    codeToHtml(usageCode, { lang: 'tsx', theme: 'github-dark' }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 font-semibold text-base">설치</h3>
        <CodeBlock html={installHtml} />
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-base">사용법</h3>
        <CodeBlock html={usageHtml} />
      </div>
    </div>
  );
};
