type ToNumberOptions = {
  default?: number;
  min?: number;
  max?: number;
};

export const toNumber = (value: string, options: ToNumberOptions = {}) => {
  let newValue: number = Number.parseInt(value || String(options.default));

  if (Number.isNaN(newValue)) {
    newValue = options.default;
  }

  if (newValue < options.min) {
    newValue = options.min;
  }

  return newValue;
};

export const checkSortDirection = (value) => {
  return value === ('asc' || 'desc') ? value : 'desc';
};
