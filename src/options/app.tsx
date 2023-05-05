import "./app.css";
import { useEffect, useState } from "preact/compat";
import { getFromLocalStorage } from "../utils/get-from-local-storage.ts";

export function App() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  const loadFromStorage = async () => {
    const { apiKey } = await getFromLocalStorage(["apiKey"]);
    if (apiKey) {
      setApiKey(apiKey);
    }
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  const onSave = () => {
    chrome.storage.local.set(
      {
        apiKey,
      },
      () => {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 2000);
      }
    );
  };
  return (
    <div class="container">
      <div>
        <label for="apiKey">OpenAI api key</label>
        <input
          id="apiKey"
          type="password"
          placeholder="Your OpenAI api key"
          onInput={(e) => {
            setApiKey(e.currentTarget.value);
          }}
        />
      </div>
      <div>
        {saved ? (
          <div id="apiKeySaved">Saved !</div>
        ) : (
          <button id="saveApiKey" onClick={onSave}>
            Save
          </button>
        )}
      </div>
    </div>
  );
}
