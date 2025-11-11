import type { PersonalSealConfig } from '@koreansealjs/shared';

export class PersonalSeal {
  async draw(_config: PersonalSealConfig): Promise<void> {
    throw new Error('PersonalSeal is not yet implemented');
  }

  toBuffer(): Buffer {
    throw new Error('PersonalSeal is not yet implemented');
  }

  toDataURL(): string {
    throw new Error('PersonalSeal is not yet implemented');
  }
}
