import "./commands.css";
import { useEffect, useState } from "preact/compat";
import { getFromLocalStorage } from "../utils/get-from-local-storage.ts";

export function Commands() {
  const [commands, setCommands] = useState("");

  const loadFromStorage = async () => {
    const { apiKey, commands: commandsFromLocalStorage } =
      await getFromLocalStorage(["apiKey", "commands"]);
    if (commandsFromLocalStorage) {
      setCommands(commandsFromLocalStorage);
    } else if (!apiKey) {
      setCommands("Please set your API key in the options page.");
    } else {
      setCommands(
        "Click the button below to generate OpenAI commands from the current Notion page."
      );
    }
  };

  useEffect(() => {
    loadFromStorage();
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.commands) {
        setCommands(changes.commands.newValue);
      }
    });
  }, []);

  return (
    <div id="commandsContainer">
      <b>Copy and run the generated shell commands</b>
      <p id="commands">{commands}</p>
    </div>
  );
}
