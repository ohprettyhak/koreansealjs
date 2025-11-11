import { writeFileSync } from 'node:fs';
import { CompanySeal } from '@koreansealjs/core';

async function main() {
  const seal = new CompanySeal(500, 500);

  await seal.draw({
    circularText: '주식회사코쏘',
    centerText: '株式會社',
    sealSize: 300,
    strokeWidthRatio: 0.033,
    markerType: 'star',
    fontFamily: 'Arial',
  });

  writeFileSync('seal.png', seal.toBuffer());
  console.log('✅ seal.png 생성 완료');
}

main().catch(console.error);
