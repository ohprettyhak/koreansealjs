import { CompanySeal } from '@koreansealjs/core';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const circularText = searchParams.get('circularText') || '주식회사 예제';
    const centerText = searchParams.get('centerText') || '대표이사';
    const sealSize = Number.parseFloat(searchParams.get('sealSize') || '300');
    const strokeWidthRatio = Number.parseFloat(searchParams.get('strokeWidthRatio') || '0.02');
    const markerType = (searchParams.get('markerType') || 'dot') as 'dot' | 'star';
    const fontFamily = searchParams.get('fontFamily') || 'Arial';

    const seal = new CompanySeal(
      sealSize + sealSize * strokeWidthRatio,
      sealSize + sealSize * strokeWidthRatio,
    );

    await seal.draw({
      circularText,
      centerText,
      sealSize,
      strokeWidthRatio,
      markerType,
      fontFamily,
    });

    const buffer = seal.toBuffer();

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Seal generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '도장 생성 실패' },
      { status: 500 },
    );
  }
}
