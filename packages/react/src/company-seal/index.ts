import type { CompanySealConfig } from '@koreansealjs/shared';
import { DEFAULT_SEAL_COLOR } from '@koreansealjs/shared';

export class CompanySeal {
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

  private async ensureFontLoaded(fontFamily: string): Promise<void> {
    if (!fontFamily || document.fonts.check(`12px ${fontFamily}`)) return;

    await document.fonts.ready;
    if (document.fonts.check(`12px ${fontFamily}`)) return;

    const rule = this.findFontFaceRule(fontFamily);
    if (rule) {
      try {
        const fontFace = new FontFace(fontFamily, rule.src, rule.descriptors);
        await fontFace.load();
        document.fonts.add(fontFace);
        return;
      } catch (error) {
        console.warn('[@koreansealjs] Failed to load font:', error);
      }
    }
    
    const startTime = Date.now();
    while (!document.fonts.check(`12px ${fontFamily}`) && Date.now() - startTime < 5000) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private findFontFaceRule(
    fontFamily: string,
  ): { src: string; descriptors: FontFaceDescriptors } | null {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || sheet.rules)) {
          if (
            rule instanceof CSSFontFaceRule &&
            rule.style.getPropertyValue('font-family').replace(/['"]/g, '') === fontFamily
          ) {
            const src = rule.style.getPropertyValue('src');
            const match = src.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match) {
              return {
                src: `url(${match[1]})`,
                descriptors: {
                  weight: rule.style.getPropertyValue('font-weight') || 'normal',
                  style: rule.style.getPropertyValue('font-style') || 'normal',
                  display: 'swap',
                },
              };
            }
          }
        }
      } catch (error) {
        console.warn('[@koreansealjs] Failed to access stylesheet:', error);
      }
    }
    return null;
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

      await this.ensureFontLoaded(fontFamily);

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

      const cx = canvasSize / 2;
      const cy = canvasSize / 2;
      const outerR = sealSize / 2 - strokeWidth / 2;
      const innerR = (sealSize / 2) * 0.5;

      const outerInnerEdge = outerR - strokeWidth / 2;
      const innerOuterEdge = innerR + strokeWidth / 2;
      const midR = (outerInnerEdge + innerOuterEdge) / 2;

      this.drawCircle(cx, cy, outerR, strokeWidth, color);
      this.drawCircle(cx, cy, innerR, strokeWidth, color);

      this.drawCenterText(centerText, cx, cy, innerR, fontFamily, color);

      const ringW = outerInnerEdge - innerOuterEdge;
      const textSize = ringW * 0.85;
      this.drawMarker(markerType, cx, cy - midR, textSize, color);

      this.drawCircularText(circularText, cx, cy, midR, ringW, fontFamily, color);

      this.ctx.restore();
    } catch (error) {
      this.ctx.restore();
      console.error('[@koreansealjs] Failed to draw seal:', error);
      throw error instanceof Error ? error : new Error('Failed to draw seal');
    }
  }

  private drawCircle(x: number, y: number, r: number, w: number, color: string): void {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = w;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawCenterText(
    text: string,
    cx: number,
    cy: number,
    innerR: number,
    font: string,
    color: string,
  ): void {
    if (!text || text.trim().length === 0) return;

    this.ctx.save();

    const size = innerR * 0.8;
    const lineGap = size * 0.1;

    this.ctx.fillStyle = color;
    this.ctx.font = `600 ${size}px ${font}`;
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

  private drawMarker(
    type: 'dot' | 'star',
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.beginPath();

    if (type === 'star') {
      this.ctx.translate(x, y);
      const radius = size * 0.27;

      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = radius * Math.cos(angle);
        const py = radius * Math.sin(angle);

        if (i === 0) {
          this.ctx.moveTo(px, py);
        } else {
          this.ctx.lineTo(px, py);
        }
      }

      this.ctx.closePath();
    } else {
      this.ctx.arc(x, y, size * 0.18, 0, Math.PI * 2);
    }

    this.ctx.fill();
    this.ctx.restore();
  }

  private drawCircularText(
    text: string,
    cx: number,
    cy: number,
    midR: number,
    ringW: number,
    font: string,
    color: string,
  ): void {
    if (!text || text.trim().length === 0) return;

    this.ctx.save();

    const size = ringW * 0.85;

    this.ctx.fillStyle = color;
    this.ctx.font = `600 ${size}px ${font}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'alphabetic';

    const sampleMetrics = this.ctx.measureText(text[0]!);
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
      console.error('[@koreansealjs] Failed to export seal:', error);
      throw error instanceof Error ? error : new Error('Failed to export PNG');
    }
  }
}
