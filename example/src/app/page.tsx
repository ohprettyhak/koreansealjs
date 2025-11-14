import { Demo } from './demo';

const Page = () => {
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
    </main>
  );
};

export default Page;
