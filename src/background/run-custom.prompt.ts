import { callChatGPTWithSpec } from "./chat-gpt.ts";

export async function runCustomPrompt(
  apiKey: string,
  technology: string,
  currentPrompt: string,
  pageContent: string,
  pageId: string
) {
  const generatedCommands = await callChatGPTWithSpec(
    apiKey,
    technology,
    currentPrompt,
    pageContent
  );
  await chrome.storage.local.set({
    commands: generatedCommands,
    lastPageGenerated: pageId,
  });
}
