export const getFromLocalStorage = (
  keys: string[]
): Promise<{ [key: string]: any }> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, async (values) => {
      resolve(values);
    });
  });
};
