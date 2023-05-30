const booleanToText = (bool: boolean) => {
  return bool ? '표시' : '비표시';
};

const uniqueFileNameToFileName = (uniqueFileName: string) => {
  return uniqueFileName.replace(/^[^_]*_/, '');
};
export { booleanToText, uniqueFileNameToFileName };
