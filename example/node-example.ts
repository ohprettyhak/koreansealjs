import { writeFileSync } from 'node:fs';
import { CompanySeal } from '@koreansealjs/core';

async function main() {
  console.log('🎨 회사 도장 생성 시작...');

  const seal = new CompanySeal(500, 500);

  await seal.draw({
    circularText: '주식회사코쏘',
    centerText: '株式會社',
    sealSize: 300,
    strokeWidthRatio: 0.033,
    markerType: 'star',
    fontFamily: 'Arial',
  });

  const buffer = seal.toBuffer();
  writeFileSync('company-seal.png', buffer);

  console.log('✅ 도장 생성 완료: company-seal.png');
  console.log(`📊 파일 크기: ${(buffer.length / 1024).toFixed(2)} KB`);

  console.log('\n🎨 다른 설정으로 도장 생성...');

  const seal2 = new CompanySeal(800, 800);

  await seal2.draw({
    circularText: '주식회사예제테스트',
    centerText: '대표이사인',
    sealSize: 500,
    strokeWidthRatio: 0.025,
    markerType: 'dot',
    fontFamily: 'Arial',
  });

  const buffer2 = seal2.toBuffer();
  writeFileSync('company-seal-2.png', buffer2);

  console.log('✅ 도장 생성 완료: company-seal-2.png');
  console.log(`📊 파일 크기: ${(buffer2.length / 1024).toFixed(2)} KB`);
}

main().catch(console.error);
