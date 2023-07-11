import { getFromLocalStorage } from "../utils/get-from-local-storage.ts";

async function callChatGPT(messages: { role: string; content: string }[]) {
  const { apiKey, model } = await getFromLocalStorage(["apiKey", "model"]);
  if (!apiKey) {
    window.alert("Please set your API key in the options page.");
    return;
  }
  console.log("completions for", messages);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "gpt-4",
        messages: messages,
        n: 1,
        stop: null,
        temperature: 0,
      }),
    }).then((response) => response.json());

    let choice = response.choices[0];
    console.debug(choice);

    return choice.message.content
      .trim()
      .replaceAll("!", "\\!")
      .replaceAll("```", "");
  } catch (error) {
    console.error("Error generating commands from AI:", error);
  }
}
export async function callChatGPTWithSpec(
  technology: string,
  customPrompt: string,
  pageContent: string
): Promise<string | undefined> {
  try {
    let generatedCommands;
    let prompt =
      `I ll give you the specifications.` +
      ` You will understand them and then I ll give some very precise instruction based on those specifications.` +
      ` Do not do anything that is not in the instructions.` +
      ` The specification are: "\n${pageContent}\n". This is the end of the specification.`;

    const messages = [
      {
        role: "user",
        content: `Ignore all instructions before this one. You’re a senior developer. You have been making development for 20 years. Your task is now to generate ${technology} code.`,
      },
      { role: "user", content: prompt },
      {
        role: "user",
        content:
          `The instructions are: "${customPrompt}".` +
          `Generate shell commands to make the previous instructions.` +
          `Do not write any other text than the shell commands. Do not write any comment. Do not write the language used. ` +
          `You should reply ONLY the shell commands so I can copy and paste your response directly in the terminal. The response should be a list of shell commands.` +
          `You can use mkdir and echo command to accomplish the instructions.`,
      },
    ];
    generatedCommands = await callChatGPT(messages);

    console.log("generatedCommands", generatedCommands);

    return generatedCommands;
  } catch (error) {
    console.error("Error generating commands from AI:", error);
  }
  return undefined;
}
