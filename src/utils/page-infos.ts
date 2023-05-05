import { urlToPageId } from "./url-to-page-id.ts";

export async function getPageInfos(): Promise<{ id: string; content: string }> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs[0].id) {
        reject("No tab ID found");
        return;
      }
      const pageId = urlToPageId(tabs[0].url);
      if (!pageId) {
        reject("No page ID found for this URL");
        return;
      }
      const pageContentScriptResult = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getPageContentEmbedded,
      });
      resolve({ id: pageId, content: pageContentScriptResult[0].result });
    });
  });
}

function getPageContentEmbedded(): string {
  return document.getElementsByTagName("main")[0].innerText;
}
