import { useRef, useState } from 'react';
import { ImageAPI } from '../api/image';
import Layout from '../component/Layout';
import RangeInput from '../component/RangeInput';
import SwitchInput from '../component/SwitchInput';
import { useViewerMaxSize } from '../hooks/viewer';

interface EditorProps {
  image: IMImage;
}

function Editor({ image }: EditorProps) {
  const [greyscale, setGreyScale] = useState(false);
  const max = useViewerMaxSize(image); // maximum size of viewer (not the actual image)
  const downloaderRef = useRef<HTMLAnchorElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [hue, setHue] = useState(0); // 0 to 360deg
  const [brightness, setBrightness] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [contrast, setContrast] = useState(1);

  let filter = `saturate(${saturation}) contrast(${contrast}) brightness(${brightness}) hue-rotate(${hue}deg)`;
  if (greyscale) filter += 'grayscale(100%)';

  return (
    <div className='flex w-full justify-center py-4'>
      <div className='z-10 flex flex-col  lg:flex-row'>
        <div
          className='relative flex'
          style={{
            minWidth: max.width,
            minHeight: max.height,
          }}
          ref={bgRef}
        >
          <div
            className='absolute top-0 left-0 right-0 bottom-0 -z-10 outline outline-2 outline-teal-500'
            style={{
              width: max.width,
              height: max.height,
              overflow: 'hidden',
              background: `url("${image.url}")`,
              transition: 'filter 200ms ease-in-out',
              WebkitFilter: filter,
              filter: filter,
              backgroundSize: `${max.width}px ${max.height}px`,
            }}
          />
        </div>

        <div
          className='border-1 font-roboto mx-auto flex w-full flex-col gap-4 border-solid border-zinc-400 py-4 px-4 dark:text-zinc-300'
          style={{
            minWidth: '300px',
          }}
        >
          <SwitchInput
            label='Grey Scale'
            value={greyscale}
            onChange={(v) => setGreyScale(v)}
          />
          <div className='grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-8'>
            <RangeInput
              label='Saturation'
              value={saturation}
              onChange={(v) => setSaturation(v)}
              scaleFactor={100}
              sliderMax={200}
            />
            <RangeInput
              label='Hue'
              value={hue}
              onChange={(v) => setHue(v)}
              scaleFactor={1 / 1.8}
              sliderMax={200}
              defaultVal={0}
            />
            <RangeInput
              label='Contrast'
              value={contrast}
              onChange={(v) => setContrast(v)}
              scaleFactor={100}
              sliderMax={200}
            />
            <RangeInput
              label='Brightness'
              value={brightness}
              onChange={(v) => setBrightness(v)}
              scaleFactor={100}
              sliderMax={200}
            />
          </div>
          <button
            onClick={async () => {
              if (downloaderRef.current) {
                downloaderRef.current.href = await ImageAPI.use('color', {
                  id: image.id,
                  ext: image.ext,
                  greyscale,
                  brightness,
                  hue: Math.round(hue),
                  contrast,
                  saturation,
                });
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
    </div>
  );
}
const ColorPage = () => {
  const [image, setImage] = useState<IMImage | null>({
    id: '257cc6fca478493ca4afb9e1abecae40',
    client: 'cc9a538a-9567-4342-b94c-bb7a34a9f68b',
    url: `http://${location.hostname}:4000/images/upload/257cc6fca478493ca4afb9e1abecae40.jpg`,
    w: 5464,
    h: 3643,
    ext: 'jpg',
  });
  return (
    <Layout
      name='Color'
      onUpload={(image) => setImage(image)}
      hasImage={image !== null}
    >
      {image && <Editor image={image} />}
    </Layout>
  );
};

export default ColorPage;

