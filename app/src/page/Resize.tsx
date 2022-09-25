import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { ImageAPI } from '../api/image';
import Layout from '../component/Layout';
import TriggerInput from '../component/TriggerInput';
import NumberInput from '../component/NumberInput';
import { useViewerMaxSize } from '../hooks/viewer';
import { conditionalStyle } from '../utils';
import { CloseLock } from '../icons/CloseLock';
import { OpenLock } from '../icons/OpenLock';
import { getDiagonalPercent } from '../utils/size';
import { useWindowEvent } from '../hooks/window';

interface EditorProps {
  image: IMImage;
}

function Editor({ image }: EditorProps) {
  const [widthPercent, setWidthPercent] = useState(1); // percent
  const [heightPercent, setHeightPercent] = useState(1); // percent
  const max = useViewerMaxSize(image); // maximum image size of viewer (not the actual image)
  const width = Math.round(widthPercent * max.width); // maximum image size of selected region in viewer
  const height = Math.round(heightPercent * max.height);
  const actualWidth = Math.round(image.w * widthPercent); // actual size
  const actualHeight = Math.round(image.h * heightPercent);
  const downloaderRef = useRef<HTMLAnchorElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [isLocked, setIsLocked] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [top, setTop] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);

  function setBounds() {
    if (!bgRef.current) return;
    const rect = bgRef.current.getBoundingClientRect();
    setTop(Math.round(rect.top));
    setLeft(Math.round(rect.left));
  }

  useLayoutEffect(setBounds, [max.width, max.width]);

  const scaleImageFromUIEvent = (clientX: number, clientY: number) => {
    if (top === null || left === null) {
      setBounds();
      return;
    }
    let w = clientX - left;
    let h = max.height - (clientY - top);

    h = Math.max(h, 0);
    h = Math.min(h, max.height);

    w = Math.max(w, 0);
    w = Math.min(w, max.width);

    let hpercent = h / max.height;
    let wpercent = w / max.width;

    if (isLocked) {
      const percent = getDiagonalPercent(wpercent, hpercent);
      setWidthPercent(percent);
      setHeightPercent(percent);
    } else {
      setWidthPercent(wpercent);
      setHeightPercent(hpercent);
    }
  };
  useWindowEvent('mouseup', () => {
    setIsDragging(false);
  });

  useWindowEvent(
    'mousemove',
    ({ clientX, clientY }) => {
      if (isDragging) {
        scaleImageFromUIEvent(clientX, clientY);
      }
    },
    [isDragging]
  );
  useWindowEvent('mousedown', ({ target, clientX, clientY }) => {
    if (target === btnRef.current) {
      setIsDragging(true);
    } else {
      console.log(clientX, clientY);
      scaleImageFromUIEvent(clientX, clientY);
    }
  });

  // function onTouchStart(e: React.TouchEvent<HTMLButtonElement>) {
  //   const { touches } = e.nativeEvent;

  //   for (let touch of touches) {
  //     if (touch.target == btnRef.current) {
  //       const { clientX, clientY } = touch;
  //       scaleImageFromUIEvent(clientX, clientY);
  //       break;
  //     }
  //   }

  //   // const touch = touches.length
  // }

  return (
    <div className='mx-auto flex flex-col  py-4 lg:flex-row'>
      <div className='relative'>
        <div
          ref={bgRef}
          style={{
            width: max.width,
            height: max.height,
            background: `url("${image.url}")`,
            WebkitFilter: 'blur(8px)',
            filter: 'blur(8px)',
            backgroundSize: `${max.width}px ${max.height}px`,
          }}
        />
        <div className='content absolute left-0 bottom-0 outline outline-4 outline-teal-500 dark:outline-teal-900'>
          <img src={image.url} style={{ width, height }} />
          <div className='relative'></div>
        </div>
        <button
          className='absolute z-10 bg-teal-600'
          ref={btnRef}
          style={{
            width: 12,
            height: 12,
            left: width - 6,
            bottom: height - 6,
          }}
        />
      </div>
      <div
        className='border-1 font-roboto mx-auto flex w-full flex-col gap-4 border-solid border-zinc-400 py-4 px-4 dark:text-zinc-300'
        style={{
          maxWidth: '400px',
          minWidth: '250px',
        }}
      >
        <NumberInput
          label='Width'
          value={actualWidth}
          onChange={(e) => {
            let newActualWidth = parseInt(
              e.target.value.replace(/[^0-9]/gi, '') || '0'
            );
            let percent = Math.min(newActualWidth / image.w, 1);
            setWidthPercent(percent);
            if (isLocked) {
              setHeightPercent(percent);
            }
          }}
        />
        <NumberInput
          label='Height'
          value={actualHeight}
          onChange={(e) => {
            let newActualHeight = parseInt(
              e.target.value.replace(/[^0-9]/gi, '') || '0'
            );
            let percent = Math.min(newActualHeight / image.h, 1);
            setHeightPercent(percent);
            if (isLocked) {
              setWidthPercent(percent);
            }
          }}
        />
        <TriggerInput
          value={isLocked}
          onClick={() => {
            if (!isLocked) {
              setHeightPercent(widthPercent);
            }
            setIsLocked(!isLocked);
          }}
          trueIcon={<CloseLock />}
          falseIcon={<OpenLock />}
        />
        <button
          onClick={async () => {
            setIsDisabled(true);
            const resizedURL = await ImageAPI.resize({
              id: image.id,
              ext: image.ext,
              width,
              height,
            });
            if (downloaderRef.current) {
              downloaderRef.current.href = resizedURL;
              downloaderRef.current.click();
            }
          }}
          className='rounded-sm  bg-teal-600 p-4 text-white hover:bg-teal-700  dark:bg-teal-800 dark:text-zinc-300 dark:hover:bg-teal-600 '
        >
          Download
        </button>
        <a href='#' ref={downloaderRef} target='_blank' download hidden></a>
      </div>
    </div>
  );
}

const ResizePage = () => {
  const [image, setImage] = useState<IMImage | null>({
    id: '40b7bd1906a544b68d936758191808be',
    client: '3c39158a-660b-4081-bf6b-83bc655e7f09',
    url: `http://${window.location.hostname}:4000/images/upload/40b7bd1906a544b68d936758191808be.jpg`,
    w: 1920,
    h: 1280,
    ext: 'jpg',
  });
  const [contentRef] = useAutoAnimate<HTMLDivElement>({
    duration: 300,
  });
  return (
    <Layout
      name='Resize'
      onUpload={(image) => setImage(image)}
      hasImage={image !== null}
      contentRef={contentRef}
    >
      {image && contentRef.current && <Editor image={image} />}
    </Layout>
  );
};

export default ResizePage;

