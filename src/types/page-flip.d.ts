/** הצהרת טיפוסים מקומית ל-page-flip (StPageFlip 2.0.7) — החבילה מופצת בלי typings */
declare module 'page-flip' {
  export type FlipCorner = 'top' | 'bottom';

  export interface FlipSetting {
    startPage?: number;
    size?: 'fixed' | 'stretch';
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export interface FlipEvent {
    data: number | string;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: FlipSetting);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    updateFromHtml(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    destroy(): void;
    flip(pageNum: number, corner?: FlipCorner): void;
    flipNext(corner?: FlipCorner): void;
    flipPrev(corner?: FlipCorner): void;
    turnToPage(pageNum: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): 'portrait' | 'landscape';
    on(event: 'flip' | 'changeState' | 'changeOrientation' | 'init' | 'update', callback: (e: FlipEvent) => void): void;
  }
}
