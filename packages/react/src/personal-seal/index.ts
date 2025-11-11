import type { PersonalSealConfig } from '@koreansealjs/shared';

export class PersonalSealCanvas {
  constructor(_canvas: HTMLCanvasElement) {
    throw new Error('PersonalSealCanvas is not yet implemented');
  }

  async draw(_config: PersonalSealConfig): Promise<void> {
    throw new Error('PersonalSealCanvas is not yet implemented');
  }

  exportToPNG(_filename = 'seal.png'): void {
    throw new Error('PersonalSealCanvas is not yet implemented');
  }
}
