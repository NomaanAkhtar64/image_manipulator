export const API_URL = (sl: TemplateStringsArray) => {
  return 'http://localhost:4000/api/' + sl.join('');
};
