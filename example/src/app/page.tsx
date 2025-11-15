import { Demo } from './_components/demo';
import { Usage } from './_components/usage';
import { BrowserContent } from './_components/usage/browser-content';
import { NodejsContent } from './_components/usage/nodejs-content';

interface PageProps {
  searchParams: Promise<{ usage?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { usage: _usage } = await searchParams;
  const usage = _usage === 'node' ? 'node' : 'browser';

  return (
    <main className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="mb-2 font-semibold text-xl">@koreansealjs</h1>
        <p className="text-balance break-keep font-medium text-[15px] text-neutral-600">
          한국 도장을 Node.js와 브라우저 환경에서 생성할 수 있는 라이브러리입니다.
        </p>
      </div>

      <div className="border-2 border-neutral-200 bg-neutral-50 p-4 md:p-6">
        <h2 className="mb-4 border-neutral-200 border-b pb-2 font-semibold text-lg md:mb-6">
          데모
        </h2>
        <Demo />
      </div>

      <div className="border-2 border-neutral-200 bg-neutral-50 p-4 md:p-6">
        <h2 className="pb-2 font-semibold text-lg">시작하기</h2>

        <Usage tab={usage}>
          <BrowserContent />
          <NodejsContent />
        </Usage>
      </div>

      <p className="pb-8 text-center font-medium text-neutral-600 text-sm">
        Made with ❤️ by&nbsp;
        <a
          className="border border-transparent px-0.5 transition-colors duration-150 hover:border-neutral-300 hover:bg-neutral-100"
          href="https://github.com/ohprettyhak"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hak Lee
        </a>
        &nbsp;•&nbsp;
        <a
          className="border border-transparent px-0.5 transition-colors duration-150 hover:border-neutral-300 hover:bg-neutral-100"
          href="https://github.com/ohprettyhak/koreansealjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          [GitHub]
        </a>
      </p>
    </main>
  );
};

export default Page;
