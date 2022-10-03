import React from 'react';
import { conditionalStyle } from '../utils';

interface SwitchInputProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

const SwitchInput: React.FC<SwitchInputProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className='flex w-full flex-row items-center justify-between'>
      <label className='font-bold uppercase'>{label}</label>

      <div
        className='relative items-center gap-4  bg-zinc-300 text-center  dark:bg-zinc-700'
        style={{ width: '100px', height: '40px' }}
      >
        <button
          className={conditionalStyle(
            'absolute left-1/2 flex w-1/2 items-center justify-center transition-all delay-200 ease-linear',
            value,
            'bg-teal-600 text-white dark:bg-teal-700'
          )}
          onClick={() => onChange(true)}
          style={{ height: '40px' }}
        >
          ON
        </button>
        <button
          className={conditionalStyle(
            'absolute left-0 flex w-1/2 items-center justify-center  transition-all  delay-200 ease-linear',
            value,
            ' ',
            ' bg-teal-600 text-white dark:bg-teal-700'
          )}
          style={{ height: '40px' }}
          onClick={() => onChange(false)}
        >
          OFF
        </button>
      </div>
    </div>
  );
};

export default SwitchInput;
