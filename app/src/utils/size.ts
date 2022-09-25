type SizePropertyName = 'width' | 'height';

type Size = {
  [key in SizePropertyName]: number;
};

export function getSize(current: Size, element: Size, maxVal: number): Size {
  let active: SizePropertyName, other: SizePropertyName;

  if (current.width >= current.height) {
    // LANDSCAPE/SQUARE
    active = 'width';
    other = 'height';
  } else {
    //PORTRAIT
    active = 'height';
    other = 'width';
  }

  let aspectRatio = current[other] / current[active]; // less than 1
  let value: number = current[active];

  if (current[active] > maxVal) {
    value = maxVal;
  }

  if (maxVal > element[active]) {
    value = element[active];
  }
  if (maxVal > element[other]) {
    value = element[other];
  }

  return {
    [active]: value,
    [other]: value * aspectRatio,
  } as Size;
}

export function getDiagonalPercent(wp: number, hp: number) {
  return 1 - Math.sqrt((1 - wp) ** 2 + (1 - hp) ** 2);
}

