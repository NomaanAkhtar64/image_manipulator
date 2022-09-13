import { useRef } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { COLOR, CROP, RESIZE, SLICE } from '../services';

import { conditionalStyle } from '../utils';

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname == '/';

  const resizeRef = useRef<HTMLDivElement>(null);
  const cropRef = useRef<HTMLDivElement>(null);
  const sliceRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const Refs: RefDictionary = {
    RESIZE: resizeRef,
    CROP: cropRef,
    SLICE: sliceRef,
    COLOR: colorRef,
  };

  let services: ServiceDictionary = {
    '/': [RESIZE, CROP, SLICE, COLOR],
    '/resize': [RESIZE, CROP, SLICE, COLOR],
    '/crop': [CROP, RESIZE, SLICE, COLOR],
    '/slice': [SLICE, RESIZE, CROP, COLOR],
    '/color': [COLOR, RESIZE, CROP, SLICE],
  };

  const [serviceParent] = useAutoAnimate<HTMLDivElement>({
    duration: 300,
  });

  let title: string;

  if (isHome) {
    title = 'Image Manipulator';
  } else {
    title = 'I M';
  }

  return (
    <div
      className={conditionalStyle(
        'flex flex-col items-center menu-cont',
        isHome,
        'h-fit my-auto',
        'px-3 h-fit md:h-full bg-zinc-800 dark:bg-white'
      )}
    >
      <Link
        to='/'
        className={conditionalStyle(
          'font-roboto text-center tracking-widest text-teal-500 text-outline-1 py-2',
          isHome,
          'text-4xl',
          'text-3xl hidden md:block'
        )}
        style={{ WebkitTextStroke: '1px #8BC2B5' }}
      >
        {title}
      </Link>
      <div
        className={conditionalStyle(
          'py-4 md:py-10  services',
          isHome,
          'grid  grid-cols-2 gap-10',
          'flex md:flex-col flex-wrap flex-row gap-2 sm:gap-10'
        )}
        ref={serviceParent}
      >
        {services[location.pathname as AppPaths].map((service) => (
          <div
            className={conditionalStyle(
              'service-cont flex flex-col items-center',
              isHome,
              'home',
              'w-fit'
            )}
            key={service.text}
            ref={Refs[service.text]}
          >
            <button
              onClick={() => navigate(service.path)}
              className={conditionalStyle(
                'rounded-2xl',
                isHome,
                'p-8 bg-zinc-800 dark:bg-zinc-200',
                'p-5 bg-white dark:bg-zinc-800'
              )}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={conditionalStyle(
                  'fill-teal-700',
                  isHome,
                  'w-14 h-14',
                  'w-8 h-8'
                )}
                viewBox='0 0 16 16'
              >
                {service.icon}
              </svg>
            </button>
            {isHome && (
              <p
                style={{ letterSpacing: 6 }}
                className='text-md font-roboto font-semibold py-2 dark:text-zinc-300'
              >
                {service.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
