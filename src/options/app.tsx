import "./app.css";
import { useEffect, useState } from "preact/compat";
import { getFromLocalStorage } from "../utils/get-from-local-storage.ts";

export function App() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4");
  const [saved, setSaved] = useState(false);

  const loadFromStorage = async () => {
    const { apiKey, model } = await getFromLocalStorage(["apiKey", "model"]);
    if (apiKey) {
      setApiKey(apiKey);
    }
    if (model) {
      setModel(model);
    }
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  const onSave = () => {
    chrome.storage.local.set(
      {
        apiKey,
        model,
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
          value={apiKey}
          placeholder="Your OpenAI api key"
          onInput={(e) => {
            setApiKey(e.currentTarget.value);
          }}
        />
      </div>
      <div>
        <label for="model">OpenAI model</label>
        <input
          id="model"
          type="text"
          placeholder="The OpenAI model to use"
          value={model}
          onInput={(e) => {
            setModel(e.currentTarget.value);
          }}
        />
      </div>
      <div>
        {saved ? (
          <div id="apiKeySaved">Saved !</div>
        ) : (
          <button onClick={onSave}>Save</button>
        )}
      </div>
    </div>
  );
}
