import "./generate-button.css";
import { useEffect, useState } from "preact/compat";

export function TechnologyInput() {
  const [technology, setTechnology] = useState("NestJS");

  useEffect(() => {
    chrome.storage.local.get(["technology"], ({ technology }) => {
      setTechnology(technology);
    });
  }, []);
  useEffect(() => {
    chrome.storage.local.set({
      technology,
    });
  }, [technology]);

  return (
    <div>
      <label for="technology">Technology to use</label>
      <input
        id="technology"
        type="text"
        value={technology}
        onInput={(e) => setTechnology(e.currentTarget.value)}
        placeholder="By default it is NestJS"
      />
    </div>
  );
}
