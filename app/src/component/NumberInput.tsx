import React from 'react';

interface NumberInputProps {
  label: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className='flex w-full flex-row items-center justify-between'>
      <label className='font-bold uppercase'>{label}</label>
      <input
        type='text'
        className='w-14 bg-transparent py-2 text-center dark:bg-zinc-700'
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default NumberInput;
