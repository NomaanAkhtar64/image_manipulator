import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useRef, useState } from 'react';
import { ImageAPI } from '../api/image';
import { conditionalStyle, isImage } from '../utils';
import { FileDrop } from 'react-file-drop';
import ErrorLine from './ErrorLine';

interface UploaderProps {
  onUpload: (image: IMImage) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const [isHoveringFile, setIsHoveringFile] = useState(false);

  const onTargetClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setError('');
  };

  const onDrop = (
    files: FileList | null,
    _: React.DragEvent<HTMLDivElement>
  ) => {
    setIsHoveringFile(false);
    if (!files) return;

    const file = files.item(0);

    if (!file) return;

    if (!isImage(file.name)) {
      setError('File Format Unsupported');
      return;
    }

    ImageAPI.upload(file)
      .then((img) => onUpload(img))
      .catch((_) => setError('Server Error'));

    setError('');
  };

  const [iconParent] = useAutoAnimate<HTMLDivElement>({
    duration: 300,
  });

  return (
    <div
      className={conditionalStyle(
        'h-48 w-full p-10 md:w-96 ',
        error !== '',
        'mb-auto',
        'my-auto'
      )}
    >
      <FileDrop
        className={conditionalStyle(
          'font-roboto flex h-full w-full  items-center justify-center rounded-lg border-2 border-teal-700 bg-zinc-200 p-2 text-teal-900 transition-colors delay-150 ease-linear dark:hover:bg-teal-700',
          isHoveringFile,
          'border-dashed  dark:bg-teal-700',
          'border-solid  dark:bg-zinc-900'
        )}
        onTargetClick={onTargetClick}
        onDragOver={() => setIsHoveringFile(true)}
        onDragLeave={() => setIsHoveringFile(false)}
        onDrop={onDrop}
      >
        <div
          className='flex cursor-pointer flex-row items-center justify-between gap-10'
          ref={iconParent}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='48'
            height='48'
            fill='currentColor'
            className={conditionalStyle(
              'transition-transform',
              isHoveringFile,
              'rotate-180',
              'rotate-0 cursor-pointer'
            )}
            viewBox='0 0 16 16'
          >
            <path
              fillRule='evenodd'
              d='M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z'
            />
            <path
              fillRule='evenodd'
              d='M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z'
            />
          </svg>
          {!isHoveringFile && (
            <span
              className='hidden text-lg uppercase sm:block'
              style={{ letterSpacing: '5px' }}
            >
              Upload(s)
            </span>
          )}
        </div>
      </FileDrop>
      <input
        type='file'
        className='hidden'
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            ImageAPI.upload(e.target.files[0])
              .then((img) => onUpload(img))
              .catch((_) => setError('Server Error'));
          }
        }}
        ref={fileInputRef}
        accept='image/png, image/jpeg'
      />
      <ErrorLine message={error} />
    </div>
  );
};

export default Uploader;

