import type { PersonalSealConfig } from '@koreansealjs/shared';

export class PersonalSeal {
  constructor(_canvas: HTMLCanvasElement) {
    throw new Error('PersonalSeal is not yet implemented');
  }

  async draw(_config: PersonalSealConfig): Promise<void> {
    throw new Error('PersonalSeal is not yet implemented');
  }

  exportToPNG(_filename = 'seal.png'): void {
    throw new Error('PersonalSeal is not yet implemented');
  }
}
