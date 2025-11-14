export const createPageUrl = (pageName, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return `/${pageName}${queryString ? '?' + queryString : ''}`;
};
