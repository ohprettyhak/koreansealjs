import { codeToHtml } from 'shiki';
import { CodeBlock } from '~/components/ui';

const installCode = 'npm install @koreansealjs/core @napi-rs/canvas';

const usageCode = `import { CompanySeal } from '@koreansealjs/core';
import { writeFileSync } from 'fs';

async function generateSeal() {
  const seal = new CompanySeal(300, 300);

  await seal.draw({
    circularText: '주식회사 예제',
    centerText: '대표이사',
    sealSize: 300,
    strokeWidthRatio: 0.02,
    markerType: 'star',
    fontFamily: 'Arial',
  });

  const buffer = seal.toBuffer();
  writeFileSync('seal.png', buffer);
}

generateSeal();`;

const nextjsConfigCode = `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@napi-rs/canvas'],
};

export default nextConfig;`;

export const NodejsContent = async () => {
  const [installHtml, usageHtml, configHtml] = await Promise.all([
    codeToHtml(installCode, { lang: 'bash', theme: 'github-dark' }),
    codeToHtml(usageCode, { lang: 'ts', theme: 'github-dark' }),
    codeToHtml(nextjsConfigCode, { lang: 'ts', theme: 'github-dark' }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 font-semibold text-base">설치</h3>
        <CodeBlock html={installHtml} />
        <p className="mt-2 font-medium text-neutral-600 text-sm">
          <code className="border border-neutral-300 bg-neutral-100 px-1 py-0.5 text-xs">
            @napi-rs/canvas
          </code>
          는 네이티브 바인딩을 사용하므로 필수 의존성입니다.
        </p>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-base">사용법</h3>
        <CodeBlock html={usageHtml} />
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-base">Next.js API Routes 사용 시</h3>
        <p className="mb-3 font-medium text-neutral-600 text-sm">
          Next.js의 API Routes(Serverless Function)에서 사용하는 경우,{' '}
          <code className="border border-neutral-300 bg-neutral-100 px-1 py-0.5 text-xs">
            next.config.ts
          </code>
          에 다음 설정을 추가해야 합니다:
        </p>
        <CodeBlock html={configHtml} />
      </div>
    </div>
  );
};
