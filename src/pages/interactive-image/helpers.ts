import type { CanvasElement } from './types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getCanvasPosition = (
  event: React.MouseEvent<HTMLDivElement>,
  canvasRect: DOMRect,
  zoom: number
): { x: number; y: number } => {
  const x = (event.clientX - canvasRect.left) / zoom;
  const y = (event.clientY - canvasRect.top) / zoom;
  return { x: Math.round(x), y: Math.round(y) };
};

export const isElementSelected = (element: CanvasElement, selectedId: string | null): boolean => {
  return element.id === selectedId;
};

export const getElementDisplayName = (element: CanvasElement): string => {
  if (element.type === 'text') {
    return `Text: ${element.content.slice(0, 20)}${element.content.length > 20 ? '...' : ''}`;
  }
  return `Hotspot: ${element.icon}`;
};

export const isPointInElement = (x: number, y: number, element: CanvasElement): boolean => {
  if (element.type === 'text') {
    // Approximate text bounds - simple implementation
    const width = element.content.length * (element.fontSize * 0.6);
    const height = element.fontSize * 1.2;
    return x >= element.x && x <= element.x + width && y >= element.y - height && y <= element.y;
  } else {
    // Hotspot bounds
    const size = element.size === 'small' ? 20 : element.size === 'medium' ? 30 : 40;
    const radius = size / 2;
    return (
      x >= element.x - radius &&
      x <= element.x + radius &&
      y >= element.y - radius &&
      y <= element.y + radius
    );
  }
};
