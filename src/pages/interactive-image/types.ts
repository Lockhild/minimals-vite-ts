export interface BaseElement {
  id: string;
  type: 'text' | 'hotspot';
  x: number;
  y: number;
  selected?: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  color: string;
}

export interface HotspotElement extends BaseElement {
  type: 'hotspot';
  size: 'small' | 'medium' | 'large';
  backgroundColor: string;
  icon: string;
}

export type CanvasElement = TextElement | HotspotElement;

export interface CanvasState {
  backgroundImage: string | null;
  elements: CanvasElement[];
  selectedElementId: string | null;
  currentTool: 'select' | 'text' | 'hotspot';
  zoom: number;
}

export const HOTSPOT_SIZES = {
  small: 20,
  medium: 30,
  large: 40,
} as const;

export const FONT_SIZES = [14, 18, 24, 32] as const;

export const ZOOM_LEVELS = [0.5, 1, 1.5] as const;

export const HOTSPOT_ICONS = ['info', 'star', 'heart', 'home', 'camera'] as const;
