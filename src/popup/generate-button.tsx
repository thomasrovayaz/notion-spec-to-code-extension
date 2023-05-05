import "./generate-button.css";
import { useEffect, useState } from "preact/compat";
import { getFromLocalStorage } from "../utils/get-from-local-storage.ts";

export function GenerateButton() {
  const [generateDisabled, setGenerateDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onGenerate = async () => {
    const { currentPrompt, technology } = await getFromLocalStorage([
      "currentPrompt",
      "technology",
    ]);
    await chrome.runtime.sendMessage({
      command: "callChatGPT",
      technology,
      currentPrompt,
    });
  };

  const loadFromStorage = async () => {
    const { apiKey, loading: loadingFromLocalStorage } =
      await getFromLocalStorage(["apiKey", "loading"]);
    setGenerateDisabled(!Boolean(apiKey));
    setIsLoading(loadingFromLocalStorage);
  };

  useEffect(() => {
    loadFromStorage();

    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes.loading) {
        setIsLoading(changes.loading.newValue);
      }
    });
  }, []);

  if (isLoading) {
    return (
      <div>
        <div class="loader"></div>
      </div>
    );
  }
  return (
    <div>
      <button
        id="generateCommands"
        disabled={generateDisabled}
        onClick={onGenerate}
      >
        Generate
      </button>
    </div>
  );
}
