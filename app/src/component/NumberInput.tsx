import React from 'react';
import { DIGIT } from '../utils/regex';

interface NumberInputProps {
  label: string;
  value: string | number;
  onChange: (v: number) => void;
  defaultVal?: number;
  percentageSign?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  defaultVal,
  percentageSign = false,
}) => {
  return (
    <div className='flex w-full flex-row items-center  justify-between'>
      <label className='font-bold uppercase'>{label}</label>
      <input
        type='text'
        className='w-14 bg-transparent py-2 text-center focus:outline focus:outline-2 focus:outline-teal-500'
        value={`${value}${percentageSign ? '%' : ''}`}
        onChange={(e) => {
          let digitStr = e.target.value.replace(DIGIT, '');
          onChange(parseInt(digitStr || `${defaultVal || 0}`));
        }}
      />
    </div>
  );
};

export default NumberInput;
