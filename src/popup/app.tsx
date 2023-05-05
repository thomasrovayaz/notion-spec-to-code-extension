import "./app.css";
import { CopyButton } from "./copy-button.tsx";
import { GenerateButton } from "./generate-button.tsx";
import { NotCommandOfPageWarning } from "./not-command-of-page-warning.tsx";
import { Commands } from "./commands.tsx";
import { CurrentPromptInput } from "./current-prompt-input.tsx";
import { TechnologyInput } from "./technology-input.tsx";

export function App() {
  return (
    <>
      <h1>🚀 Notion specifications to code</h1>

      <NotCommandOfPageWarning />

      <Commands />

      <TechnologyInput />
      <CurrentPromptInput />

      <div class="actions">
        <CopyButton />
        <GenerateButton />
      </div>
    </>
  );
}
