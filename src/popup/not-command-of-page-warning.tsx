import "./not-command-of-page-warning.css";
import { useEffect, useState } from "preact/compat";
import { getFromLocalStorage } from "../utils/get-from-local-storage.ts";
import { getPageInfos } from "../utils/page-infos.ts";

export function NotCommandOfPageWarning() {
  const [display, setDisplay] = useState(false);

  const loadFromChromeApi = async () => {
    try {
      const { id: pageId } = await getPageInfos();
      const { lastPageGenerated, commands } = await getFromLocalStorage([
        "lastPageGenerated",
        "commands",
      ]);
      if (!commands || lastPageGenerated === pageId) {
        setDisplay(false);
      } else if (commands) {
        setDisplay(true);
      }
    } catch (e) {
      console.error(e);
      setDisplay(true);
    }
  };

  useEffect(() => {
    loadFromChromeApi();
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.lastPageGenerated || changes.commands) {
        loadFromChromeApi();
      }
    });
  }, []);

  if (!display) {
    return null;
  }

  return (
    <h4 class="error" id="notCommandsOfPage">
      Those commands were not generated for the current page!
    </h4>
  );
}
