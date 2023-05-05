import "./generate-button.css";
import { useEffect, useState } from "preact/compat";

export function CurrentPromptInput() {
  const [currentPrompt, setCurrentPrompt] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["currentPrompt"], ({ currentPrompt }) => {
      setCurrentPrompt(currentPrompt);
    });
  }, []);
  useEffect(() => {
    chrome.storage.local.set({
      currentPrompt,
    });
  }, [currentPrompt]);

  return (
    <div>
      <label for="currentPrompt">Custom prompt</label>
      <textarea
        id="currentPrompt"
        value={currentPrompt}
        onInput={(e) => setCurrentPrompt(e.currentTarget.value)}
        rows={4}
        placeholder="A custom prompt to add on the ChatGPT message"
      ></textarea>
    </div>
  );
}
