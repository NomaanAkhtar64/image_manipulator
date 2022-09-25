import React from 'react';
import { conditionalStyle } from '../utils';

interface TriggerInputProps {
  value: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  trueIcon: JSX.Element;
  falseIcon: JSX.Element;
}

const TriggerInput: React.FC<TriggerInputProps> = ({
  onClick,
  value,
  falseIcon,
  trueIcon,
}) => {
  return (
    <button
      className={conditionalStyle(
        'flex justify-center  rounded-sm  py-2 transition-colors duration-75 ease-in',
        value,
        'bg-teal-800 text-gray-300 dark:bg-teal-600 dark:text-zinc-700 dark:hover:bg-teal-500',
        ' bg-zinc-200 text-teal-600  hover:bg-zinc-300 dark:bg-zinc-700 dark:text-teal-600 dark:hover:bg-zinc-600 dark:hover:text-teal-600'
      )}
      onClick={onClick}
    >
      {value ? trueIcon : falseIcon}
    </button>
  );
};

export default TriggerInput;
