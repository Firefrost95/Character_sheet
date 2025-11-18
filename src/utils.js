export function createPageUrl(page) {
  const pageMap = {
    CharacterList: '/',
    CharacterSheet: '/character-sheet'
  };

  const basePath = pageMap[page.split('?')[0]] || '/';
  const params = page.includes('?') ? '?' + page.split('?')[1] : '';

  return basePath + params;
}
