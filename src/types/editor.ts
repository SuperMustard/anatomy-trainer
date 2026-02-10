export interface EditorZone {
  id: string;
  x: number;
  y: number;
  answer: string;
}

export interface EditorState {
  image?: string;
  zones: EditorZone[];
}

export type EditorBox = {
  id: string;
  x: number;
  y: number;
  text: string;
};
