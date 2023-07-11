import { generateAllFiles } from "./generate-all-files.prompt.ts";
import { runCustomPrompt } from "./run-custom.prompt.ts";
import { getPageInfos } from "../utils/page-infos.ts";

chrome.runtime.onMessage.addListener(async (msg) => {
  const interval = keepAlive();

  if (msg.command === "callChatGPT") {
    await chrome.storage.local.set({ loading: true });

    try {
      const { content: pageContent, id: pageId } = await getPageInfos();

      await chrome.storage.local.set({
        currentPrompt: msg.currentPrompt,
      });

      if (msg.currentPrompt) {
        await runCustomPrompt(
          msg.technology || "NestJS",
          msg.currentPrompt,
          pageContent,
          pageId
        );
      } else {
        await generateAllFiles(msg.technology || "NestJS", pageContent, pageId);
      }
    } catch (error) {
      console.error("Error generating commands from AI:", error);
    }
    await chrome.storage.local.set({ loading: false });
    chrome.notifications.create("commandsGenerated", {
      type: "basic",
      iconUrl: "assets/rocket.png",
      title: "Commands Generated!",
      message:
        "The shell commands have been generated. Click the button below to copy them to your clipboard.",
      priority: 0,
    });
  }

  clearInterval(interval);
});

async function onNotificationClicked() {
  return chrome.windows.create({
    focused: true,
    type: "popup",
    url: "popup.html",
    width: 530,
    height: 511,
  });
}

chrome.notifications.onClicked.addListener(onNotificationClicked);

chrome.runtime.onInstalled.addListener(({ reason }) => {
  console.log("onInstalled", reason);
  chrome.storage.local.remove(["commands", "lastPageGenerated", "loading"]);
});

const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
