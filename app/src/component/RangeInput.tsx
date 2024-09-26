import React from "react";
import { round2Digits } from "../utils/math";
import NumberInput from "./NumberInput";

interface RangeInputProps {
  label: string;
  value: number;
  scaleFactor?: number;
  onChange: (v: number) => void;
  defaultVal?: number;
  sliderMax: number;
  sliderMin?: number;
  percentageSign?: boolean;
}

const RangeInput: React.FC<RangeInputProps> = ({
  label,
  value,
  onChange,
  defaultVal,
  scaleFactor = 1,
  sliderMax,
  percentageSign = true,
}) => {
  const percent = ((value * scaleFactor) / sliderMax) * 100;
  const fallBackDefault = 0.5 * sliderMax;

  return (
    <div className="flex w-full flex-col items-center  justify-between">
      <NumberInput
        value={Math.round(value * scaleFactor)}
        percentageSign={percentageSign}
        label={label}
        onChange={(v) => onChange(round2Digits(v / scaleFactor))}
        defaultVal={defaultVal || fallBackDefault}
      />

      <input
        type="range"
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-teal-200 accent-teal-700 dark:bg-gray-700"
        value={percent}
        onChange={(e) => {
          const v = (e.target.valueAsNumber / 100) * sliderMax;
          onChange(round2Digits(v / scaleFactor));
        }}
      />
    </div>
  );
};

export default RangeInput;
