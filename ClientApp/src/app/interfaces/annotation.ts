export default interface Annotation {
  type?: string;
  bounding?: number[];
  weight?: number;
  fill?: "solid" | "none";
  zorder?: 1;
  color?: string;
  background?: string;
  opacity?: string; // "0.0" to "1.0"
  orientation?: string;
  image?: string;
  maskcolor?: string;
  border?: Border;
  font?: Font;
  start?: LineNode;
  end?: LineNode;
  points?: Coordinates[]
}

export interface Border {
  style?: string;
  size?: number;
}

export interface Coordinates {
  x?: number;
  y?: number;
}

export interface LineNode {
  type?: string;
  fill?: string;
  size?: number;
  points?: Coordinates;
}

export interface Font {
  type: string;
  size: string;
  weight: string;
  style: string;
  decoration: string;
}