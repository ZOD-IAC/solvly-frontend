export const getDataFromlocal = () => {
  if (typeof localStorage != 'object') return {};
  const data = localStorage.getItem('auth') ?? '{}';
  const user = JSON.parse(data);

  return user;
};

export const getHeaders = () => {
  if (typeof localStorage != 'object') return {};
  const auth = localStorage.getItem('auth') ?? '{}';
  const { token } = JSON.parse(auth);

  return {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  };
};

export const isValidEmail = (email) => {
  const emialId = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emialId != '' && regex.test(emialId)) return true;

  return false;
};

export const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const makeURLPattern = ({ url }) => {
  if (!url) return '';

  const pattern = url
    .trim()
    .split(' ')
    .join('-')
    .replaceAll('?', '%3F')
    .replaceAll('/', '%2F');

  return pattern;
};
