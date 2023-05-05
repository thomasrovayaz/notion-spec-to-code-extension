import "./copy-button.css";
import { useEffect, useState } from "preact/compat";
import { getFromLocalStorage } from "../utils/get-from-local-storage.ts";

export function CopyButton() {
  const [copied, setCopied] = useState(false);
  const [copyDisabled, setCopyDisabled] = useState(true);
  const onCopy = async () => {
    const { commands } = await getFromLocalStorage(["commands"]);
    await navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    chrome.storage.local.get(["commands"], ({ commands }) => {
      if (commands) {
        setCopyDisabled(false);
      } else {
        setCopyDisabled(true);
      }
    });
    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes.commands) {
        if (changes.commands.newValue) {
          setCopyDisabled(false);
        } else {
          setCopyDisabled(true);
        }
      }
    });
  }, []);

  if (copied) {
    return (
      <div>
        <div id="commandsCopied">Copied !</div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onCopy} disabled={copyDisabled}>
        Copy
      </button>
    </div>
  );
}
