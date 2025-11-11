export interface CompanySealConfig {
  circularText: string;
  centerText: string;
  sealSize: number;
  strokeWidthRatio: number;
  markerType: 'dot' | 'star';
  fontFamily: string;
}

export interface PersonalSealConfig {
  name: string;
  sealSize: number;
  strokeWidthRatio: number;
  fontFamily: string;
}
