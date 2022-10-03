export const API_URL = (sl: TemplateStringsArray) => {
  return `http://${window.location.hostname}:4000/api/` + sl.join('');
};

export const API_URL_FN = (str: string) =>
  `http://${window.location.hostname}:4000/api/${str}`;

