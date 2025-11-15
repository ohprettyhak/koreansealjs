import type { CompanySealConfig } from '@koreansealjs/shared';
import { DEFAULT_SEAL_COLOR } from '@koreansealjs/shared';
import type { Canvas, SKRSContext2D } from '@napi-rs/canvas';
import { createCanvas } from '@napi-rs/canvas';

export class CompanySeal {
  private canvas: Canvas;
  private readonly ctx: SKRSContext2D;

  constructor(width: number, height: number) {
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
  }

  async draw(config: CompanySealConfig): Promise<void> {
    try {
      const {
        circularText,
        centerText,
        sealSize,
        strokeWidthRatio,
        markerType,
        fontFamily,
        color = DEFAULT_SEAL_COLOR,
      } = config;

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

      const ctx = this.ctx;
      ctx.save();

      const cx = canvasSize / 2;
      const cy = canvasSize / 2;
      const outerR = sealSize / 2 - strokeWidth / 2;
      const innerR = (sealSize / 2) * 0.5;

      const outerInnerEdge = outerR - strokeWidth / 2;
      const innerOuterEdge = innerR + strokeWidth / 2;
      const midR = (outerInnerEdge + innerOuterEdge) / 2;

      this.drawCircle(ctx, cx, cy, outerR, strokeWidth, color);
      this.drawCircle(ctx, cx, cy, innerR, strokeWidth, color);

      this.drawCenterText(ctx, centerText, cx, cy, innerR, fontFamily, color);

      const ringW = outerInnerEdge - innerOuterEdge;
      const textSize = ringW * 0.85;
      this.drawMarker(ctx, markerType, cx, cy - midR, textSize, color);

      this.drawCircularText(ctx, circularText, cx, cy, midR, ringW, fontFamily, color);

      ctx.restore();
    } catch (error) {
      this.ctx.restore();
      console.error('[@koreansealjs] Failed to draw seal:', error);
      throw error instanceof Error ? error : new Error('Failed to draw seal');
    }
  }

  private drawCircle(
    ctx: SKRSContext2D,
    x: number,
    y: number,
    r: number,
    w: number,
    color: string,
  ): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private drawCenterText(
    ctx: SKRSContext2D,
    text: string,
    cx: number,
    cy: number,
    innerR: number,
    font: string,
    color: string,
  ): void {
    if (!text || text.trim().length === 0) return;

    ctx.save();

    const size = innerR * 0.8;
    const lineGap = size * 0.1;

    ctx.fillStyle = color;
    ctx.font = `600 ${size}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const mid = Math.floor(text.length / 2);
    const t1 = text.substring(0, mid);
    const t2 = text.substring(mid);

    const m1 = ctx.measureText(t1);
    const m2 = ctx.measureText(t2);
    const h1 = m1.actualBoundingBoxAscent + m1.actualBoundingBoxDescent;
    const h2 = m2.actualBoundingBoxAscent + m2.actualBoundingBoxDescent;

    const totalH = h1 + lineGap + h2;
    const startY = cy - totalH / 2;

    ctx.fillText(t1, cx, startY + m1.actualBoundingBoxAscent);
    ctx.fillText(t2, cx, startY + h1 + lineGap + m2.actualBoundingBoxAscent);

    ctx.restore();
  }

  private drawMarker(
    ctx: SKRSContext2D,
    type: 'dot' | 'star',
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.fillStyle = color;

    if (type === 'star') {
      ctx.translate(x, y);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = size * 0.27;
        const px = r * Math.cos(angle);
        const py = r * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawCircularText(
    ctx: SKRSContext2D,
    text: string,
    cx: number,
    cy: number,
    midR: number,
    ringW: number,
    font: string,
    color: string,
  ): void {
    if (!text || text.trim().length === 0) return;

    ctx.save();

    const size = ringW * 0.85;

    ctx.fillStyle = color;
    ctx.font = `600 ${size}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const sampleMetrics = ctx.measureText(text[0]!);
    const ascent = sampleMetrics.actualBoundingBoxAscent;
    const descent = sampleMetrics.actualBoundingBoxDescent;
    const textCenterOffset = (ascent - descent) / 2;

    const chars = text.split('');
    const angleStep = (Math.PI * 2) / (chars.length + 1);
    const startAngle = -Math.PI / 2 + angleStep;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]!;
      const angle = startAngle + angleStep * i;
      const x = cx + midR * Math.cos(angle);
      const y = cy + midR * Math.sin(angle);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(char, 0, textCenterOffset);
      ctx.restore();
    }

    ctx.restore();
  }

  toBuffer(): Buffer {
    return this.canvas.toBuffer('image/png');
  }

  toDataURL(): string {
    return this.canvas.toDataURL('image/png');
  }
}
