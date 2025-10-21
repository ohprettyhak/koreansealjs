import opentype, {Font} from 'opentype.js';

const fontCache = new Map<string, Promise<Font>>();

async function loadFont(url: string): Promise<Font> {
  if (fontCache.has(url)) {
    return fontCache.get(url)!;
  }

  const fontPromise = new Promise<Font>((resolve, reject) => {
    opentype.load(url, (err, font) => {
      if (err) {
        fontCache.delete(url);
        reject(new Error(`Font load failed: ${url}. ${err.message}`));
      } else if (font) {
        resolve(font);
      } else {
        fontCache.delete(url);
        reject(new Error(`Font load failed (unknown error): ${url}`));
      }
    });
  });

  fontCache.set(url, fontPromise);
  return fontPromise;
}

export interface SealOptions {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

function createSealSVGPath(
  text: string,
  font: Font,
  options: SealOptions = {}
): SVGSVGElement {
  const size = options.size ?? 100;
  const color = options.color ?? '#D00000';
  const strokeWidth = options.strokeWidth ?? size * 0.05;

  const viewBoxPadding = strokeWidth * 1.5;
  const viewBoxMinX = -viewBoxPadding;
  const viewBoxMinY = -viewBoxPadding;
  const viewBoxWidth = size + viewBoxPadding * 2;
  const viewBoxHeight = size + viewBoxPadding * 2;
  const radius = size / 2 - strokeWidth / 2;
  const center = size / 2;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', size.toString());
  svg.setAttribute('height', size.toString());
  svg.setAttribute(
    'viewBox',
    `${viewBoxMinX} ${viewBoxMinY} ${viewBoxWidth} ${viewBoxHeight}`
  );
  svg.setAttribute('xmlns', svgNS);

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', color);
  circle.setAttribute('stroke-width', strokeWidth.toString());
  circle.setAttribute('cx', center.toString());
  circle.setAttribute('cy', center.toString());
  circle.setAttribute('r', radius.toString());
  svg.appendChild(circle);

  const createPathElement = (
    char: string,
    desiredX: number,
    desiredY: number,
    fontSize: number
  ): SVGPathElement => {
    const openPath = font.getPath(char, 0, 0, fontSize);
    const bbox = openPath.getBoundingBox();
    const pathWidth = bbox.x2 - bbox.x1;
    const pathHeight = bbox.y2 - bbox.y1;
    const pathCenterX = bbox.x1 + pathWidth / 2;
    const pathCenterY = bbox.y1 + pathHeight / 2;
    const dx = desiredX - pathCenterX;
    const dy = desiredY - pathCenterY;

    const pathEl = document.createElementNS(svgNS, 'path');
    pathEl.setAttribute('d', openPath.toPathData(2));
    pathEl.setAttribute('fill', color);
    pathEl.setAttribute('transform', `translate(${dx}, ${dy})`);
    return pathEl;
  };

  const chars = text.split('');
  const len = chars.length;
  const charElements: SVGPathElement[] = [];

  const baseFontSize = size * 0.35;
  const xOffset = size * 0.15;
  const yOffset = size * 0.15;
  const singleCharScale = 1.3;

  if (len === 1) {
    const fontSize = baseFontSize * singleCharScale;
    charElements.push(createPathElement(chars[0]!, center, center, fontSize));
  } else if (len === 2) {
    const fontSize = baseFontSize * 0.9;
    charElements.push(
      createPathElement(chars[0]!, center, center - yOffset, fontSize)
    );
    charElements.push(
      createPathElement(chars[1]!, center, center + yOffset, fontSize)
    );
  } else if (len === 3) {
    const firstCharFontSize = baseFontSize * 1.1;
    charElements.push(
      createPathElement(chars[0]!, center + xOffset, center, firstCharFontSize)
    );
    const otherCharFontSize = baseFontSize * 0.8;
    charElements.push(
      createPathElement(
        chars[1]!,
        center - xOffset,
        center - yOffset,
        otherCharFontSize
      )
    );
    charElements.push(
      createPathElement(
        chars[2]!,
        center - xOffset,
        center + yOffset,
        otherCharFontSize
      )
    );
  } else if (len === 4) {
    const fontSize = baseFontSize * 0.75;
    const gridOffset = size * 0.18;
    charElements.push(
      createPathElement(
        chars[0]!,
        center - gridOffset,
        center - gridOffset,
        fontSize
      )
    );
    charElements.push(
      createPathElement(
        chars[1]!,
        center + gridOffset,
        center - gridOffset,
        fontSize
      )
    );
    charElements.push(
      createPathElement(
        chars[2]!,
        center - gridOffset,
        center + gridOffset,
        fontSize
      )
    );
    charElements.push(
      createPathElement(
        chars[3]!,
        center + gridOffset,
        center + gridOffset,
        fontSize
      )
    );
  } else {
    const lineHeight = (size * 0.8) / len;
    const fontSize = Math.min(baseFontSize * 0.7, lineHeight * 0.8);
    const totalTextHeight = fontSize * len * 1.2;
    const startY = center - totalTextHeight / 2 + fontSize * 0.6;
    chars.forEach((char, index) => {
      const yPos = startY + index * lineHeight * 1.2;
      charElements.push(createPathElement(char, center, yPos, fontSize));
    });
  }

  charElements.forEach((el) => svg.appendChild(el));
  return svg;
}

export interface RenderSealOptions extends SealOptions {
  text: string;
  fontUrl: string;
}

export async function renderSeal(
  container: HTMLElement,
  options: RenderSealOptions
): Promise<SVGSVGElement> {
  const {text, fontUrl, ...sealOptions} = options;

  if (!container) {
    throw new Error('Container element not provided.');
  }

  try {
    const font = await loadFont(fontUrl);
    const svgElement = createSealSVGPath(text, font, sealOptions);

    container.innerHTML = '';
    container.appendChild(svgElement);

    return svgElement;
  } catch (error) {
    console.error('Failed to render seal:', error);
    container.style.backgroundColor = 'transparent';
    container.style.border = '1px dashed red';
    container.style.borderRadius = '50%';
    container.style.color = 'red';
    container.style.fontSize = '14px';
    container.textContent = 'Error';
    throw error;
  }
}
