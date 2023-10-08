const canvas = document.createElement('canvas');
const canvasCtx = canvas.getContext('2d');

canvas.height = 1;
canvas.width = 1;

interface RGB {
    b: number;
    g: number;
    r: number;
}

/**
 * Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
 * @param {string} cssColor Must be a valid canvas fillStyle
 * @returns RGBA
 */
function colorToRGBA (cssColor: string): RGB|undefined {
    if (canvasCtx === null) return undefined;

    canvasCtx.fillStyle = cssColor;
    canvasCtx.fillRect(0, 0, 1, 1);

    const data = canvasCtx.getImageData(0, 0, 1, 1).data;

    return { r: data[0], g: data[1], b: data[2] };
}

function rgbToYIQ ({ r, g, b }: RGB): number {
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

export const DARK_COLOR = 'rgba(0, 0, 0, 0.8)';
export const LIGHT_COLOR = 'rgba(255, 255, 255, 0.8)';

/**
 * Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
 * @param {string} cssColor Must be a valid canvas fillStyle
 * @param {number} [threshold] (default = 218)
 * @returns {undefined|string}
 */
export function contrastColor (cssColor: string, threshold = 128): string|undefined {
    const rgb: RGB | undefined = colorToRGBA(cssColor);

    if (rgb === undefined) {
        return undefined;
    }

    return rgbToYIQ(rgb) >= threshold ? DARK_COLOR : LIGHT_COLOR;
}
