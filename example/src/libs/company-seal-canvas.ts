export interface CompanySealConfig {
  circularText: string;
  centerText: string;
  sealSize: number;
  strokeWidthRatio: number;
  markerType: 'dot' | 'star';
  fontFamily: string;
}

const SEAL_COLOR = '#DC2626';

export class CompanySealCanvas {
  private readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas || typeof canvas.getContext !== 'function') {
      throw new Error('Canvas API is not supported in this browser');
    }

    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.ctx = ctx;
  }

  async draw(config: CompanySealConfig): Promise<void> {
    try {
      await document.fonts.ready;

      const { circularText, centerText, sealSize, strokeWidthRatio, markerType, fontFamily } =
        config;

      if (sealSize <= 0 || !Number.isFinite(sealSize)) {
        throw new Error('sealSize must be a positive finite number');
      }

      if (strokeWidthRatio <= 0 || strokeWidthRatio >= 0.5 || !Number.isFinite(strokeWidthRatio)) {
        throw new Error('strokeWidthRatio must be between 0 and 0.5');
      }

      const strokeWidth = sealSize * strokeWidthRatio;
      const canvasSize = Math.ceil(sealSize + strokeWidth);

      this.canvas.width = canvasSize;
      this.canvas.height = canvasSize;

      this.ctx.save();

      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, canvasSize, canvasSize);

      const cx = canvasSize / 2;
      const cy = canvasSize / 2;
      const outerR = sealSize / 2 - strokeWidth / 2;
      const innerR = (sealSize / 2) * 0.5;

      const outerInnerEdge = outerR - strokeWidth / 2;
      const innerOuterEdge = innerR + strokeWidth / 2;
      const midR = (outerInnerEdge + innerOuterEdge) / 2;

      this.drawCircle(cx, cy, outerR, strokeWidth);
      this.drawCircle(cx, cy, innerR, strokeWidth);

      this.drawCenterText(centerText, cx, cy, innerR, fontFamily);

      const ringW = outerInnerEdge - innerOuterEdge;
      const textSize = ringW * 0.85;
      this.drawMarker(markerType, cx, cy - midR, textSize);

      this.drawCircularText(circularText, cx, cy, midR, ringW, fontFamily);

      this.ctx.restore();
    } catch (error) {
      this.ctx.restore();
      console.error('Failed to draw seal:', error);
      throw error instanceof Error ? error : new Error('Failed to draw seal');
    }
  }

  private drawCircle(x: number, y: number, r: number, w: number): void {
    this.ctx.save();
    this.ctx.strokeStyle = SEAL_COLOR;
    this.ctx.lineWidth = w;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawCenterText(text: string, cx: number, cy: number, innerR: number, font: string): void {
    if (!text || !text.trim()) return;

    this.ctx.save();

    const size = innerR * 0.8;
    const lineGap = size * 0.2;

    this.ctx.fillStyle = SEAL_COLOR;
    this.ctx.font = `bold ${size}px ${font}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'alphabetic';

    const mid = Math.floor(text.length / 2);
    const t1 = text.substring(0, mid);
    const t2 = text.substring(mid);

    const m1 = this.ctx.measureText(t1);
    const m2 = this.ctx.measureText(t2);
    const h1 = m1.actualBoundingBoxAscent + m1.actualBoundingBoxDescent;
    const h2 = m2.actualBoundingBoxAscent + m2.actualBoundingBoxDescent;

    const totalH = h1 + lineGap + h2;
    const startY = cy - totalH / 2;

    this.ctx.fillText(t1, cx, startY + m1.actualBoundingBoxAscent);
    this.ctx.fillText(t2, cx, startY + h1 + lineGap + m2.actualBoundingBoxAscent);

    this.ctx.restore();
  }

  private drawMarker(type: 'dot' | 'star', x: number, y: number, size: number): void {
    this.ctx.save();
    this.ctx.fillStyle = SEAL_COLOR;

    if (type === 'star') {
      this.ctx.translate(x, y);
      this.ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = size * 0.27;
        const px = r * Math.cos(angle);
        const py = r * Math.sin(angle);
        i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
      }
      this.ctx.closePath();
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(x, y, size * 0.18, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  private drawCircularText(
    text: string,
    cx: number,
    cy: number,
    midR: number,
    ringW: number,
    font: string,
  ): void {
    if (!text || !text.trim()) return;

    this.ctx.save();

    const size = ringW * 0.85;

    this.ctx.fillStyle = SEAL_COLOR;
    this.ctx.font = `bold ${size}px ${font}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'alphabetic';

    const sampleMetrics = this.ctx.measureText(text[0]);
    const ascent = sampleMetrics.actualBoundingBoxAscent;
    const descent = sampleMetrics.actualBoundingBoxDescent;
    const textCenterOffset = (ascent - descent) / 2;

    const chars = text.split('');
    const angleStep = (Math.PI * 2) / (chars.length + 1);
    const startAngle = -Math.PI / 2 + angleStep;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const angle = startAngle + angleStep * i;
      const x = cx + midR * Math.cos(angle);
      const y = cy + midR * Math.sin(angle);

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(angle + Math.PI / 2);
      this.ctx.fillText(char, 0, textCenterOffset);
      this.ctx.restore();
    }

    this.ctx.restore();
  }

  exportToPNG(filename = 'seal.png'): void {
    try {
      if (!filename || !filename.trim()) {
        throw new Error('Filename must be a non-empty string');
      }

      const link = document.createElement('a');
      link.download = filename;
      link.href = this.canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export seal:', error);
      throw error instanceof Error ? error : new Error('Failed to export PNG');
    }
  }
}
