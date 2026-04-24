import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "wistia-player": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          "media-id"?: string;
          aspect?: string;
        },
        HTMLElement
      >;
    }
  }

  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    _wq?: Array<{
      id: string;
      onReady?: (video: { bind: (event: string, cb: () => void) => void }) => void;
    }>;
    Calendly?: {
      initInlineWidget: (opts: Record<string, unknown>) => void;
    };
  }
}

export {};
