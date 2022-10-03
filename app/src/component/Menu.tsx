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
        'menu-cont flex flex-col items-center',
        isHome,
        'my-auto h-fit',
        'h-fit bg-zinc-200 px-3 dark:bg-zinc-800 lg:h-full'
      )}
    >
      <Link
        to='/'
        className={conditionalStyle(
          'font-roboto text-outline-1 py-2 text-center tracking-widest text-teal-500',
          isHome,
          'text-4xl',
          'hidden text-3xl lg:block'
        )}
        style={{ WebkitTextStroke: '1px #8BC2B5' }}
      >
        {title}
      </Link>
      <div
        className={conditionalStyle(
          'services py-4  lg:py-10',
          isHome,
          'grid  grid-cols-2 gap-10',
          'flex flex-row flex-wrap gap-2 sm:gap-10 lg:flex-col'
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
                conditionalStyle(
                  'rounded-2xl',
                  location.pathname === service.path,
                  'active'
                ),
                isHome,
                'bg-zinc-200 p-8 dark:bg-zinc-800',
                'bg-transparent p-5 '
              )}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={conditionalStyle(
                  'fill-teal-700',
                  isHome,
                  'h-14 w-14',
                  'h-8 w-8'
                )}
                viewBox='0 0 16 16'
              >
                {service.icon}
              </svg>
            </button>
            {isHome && (
              <p
                style={{ letterSpacing: 6 }}
                className='text-md font-roboto py-2 font-semibold text-teal-700'
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

