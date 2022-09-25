import { useEffect, useState } from 'react';
import { useIsMobile } from './mobile';
import { useWindowSize } from './window';

export function useViewerMaxSize(image: IMImage): {
  width: number;
  height: number;
} {
  let aspectRatio = image.w / image.h;
  const win = useWindowSize();
  const isMobile = useIsMobile();
  const [maxWidth, setMaxWidth] = useState(600);
  const [maxHeight, setMaxHeight] = useState(600 * (image.h / image.w));

  useEffect(() => {
    if (isMobile || win.width < 640) {
      let PADDING = 6;
      let width = win.width - PADDING * 2;
      let mHeight = Math.round(width / aspectRatio);
      if (mHeight < win.height) {
        setMaxWidth(width);
        setMaxHeight(mHeight);
      } else {
        setMaxWidth(Math.round(win.height * aspectRatio));
        setMaxHeight(win.height);
      }
    } else if (win.width >= 1024) {
      // lg
      let w = Math.min(win.width - 500, 900);
      setMaxWidth(w);
      setMaxHeight(Math.round(w / aspectRatio));
    } else if (win.width >= 768) {
      // md
      setMaxWidth(700);
      setMaxHeight(Math.round(700 / aspectRatio));
    } else if (win.width >= 640) {
      // sm
      setMaxWidth(600);
      setMaxHeight(Math.round(600 / aspectRatio));
    }
  }, [win.width, win.height]);

  return {
    width: maxWidth,
    height: maxHeight,
  };
}

