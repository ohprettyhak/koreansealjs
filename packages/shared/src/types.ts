export interface CompanySealConfig {
  circularText: string;
  centerText: string;
  sealSize: number;
  strokeWidthRatio: number;
  markerType: 'dot' | 'star';
  fontFamily: string;
  color?: string;
}

export interface PersonalSealConfig {
  name: string;
  sealSize: number;
  strokeWidthRatio: number;
  fontFamily: string;
  color?: string;
}
