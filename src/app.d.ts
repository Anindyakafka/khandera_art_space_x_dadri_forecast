/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '@chenglou/pretext' {
  export type Cursor = {
    segmentIndex: number;
    graphemeIndex: number;
  };

  export type LayoutLine = {
    text: string;
    width: number;
    start: Cursor;
    end: Cursor;
  };

  export function prepareWithSegments(
    text: string,
    font: string,
    options?: { whiteSpace?: 'normal' | 'pre-wrap' }
  ): unknown;

  export function layoutNextLine(prepared: unknown, start: Cursor, maxWidth: number): LayoutLine | null;
}
