const coinList = (KEY) => () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const coinSort = (KEY) => () => {
  return localStorage.getItem(KEY) ?? "average_0";
};

const color = (KEY) => () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return value ?? { value: "orange", use: false };
  } catch {
    return {};
  }
};

const lower = (KEY) => () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return value ?? { value: "1", use: false };
  } catch {
    return {};
  }
};

const noter = (KEY) => () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return value ?? { use: false };
  } catch {
    return {};
  }
};

export const initial = {
  coinList,
  coinSort,
  color,
  lower,
  noter,
};
