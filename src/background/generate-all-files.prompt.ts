import { callChatGPTWithSpec } from "./chat-gpt.ts";
import { generators } from "./generators.ts";

export async function generateAllFiles(
  technology: string,
  pageContent: string,
  pageId: string
) {
  const generatedCommands = await callChatGPTWithSpec(
    technology,
    "You should create all the folders and files. " +
      "You should not write anything in the files. " +
      "You should only use mkdir and touch commands. " +
      `Generate shell commands to make the previous instructions.` +
      `Do not write any other text than the shell commands. Do not write any comment. Do not write the language used. ` +
      `You should reply ONLY the shell commands so I can copy and paste your response directly in the terminal. The response should be a list of shell commands.`,
    pageContent
  );
  if (!generatedCommands) {
    return;
  }
  console.log("generatedCommands", generatedCommands);
  const files = generatedCommands
    .split("\n")
    .filter((line) => line.startsWith('echo "" >') || line.startsWith("touch "))
    .map((line) => line.replace('echo "" >', "").replace("touch ", ""));

  const results = (
    await Promise.all(
      files.map(async (file) => {
        const nestJSFile = generators.find(
          (nestJSGeneratorElement) =>
            nestJSGeneratorElement.regex &&
            nestJSGeneratorElement.regex.test(file)
        );
        if (!nestJSFile || !nestJSFile.promptOneFile) {
          console.log(`no nest file description found for ${file}`);
          return undefined;
        }
        const generatedCommands = await callChatGPTWithSpec(
          technology,
          `${nestJSFile.promptOneFile.replace(
            "FILENAME",
            file
          )}. You should not write any other file. You should understand this example of code: "${
            nestJSFile.example
          }". You should transform this example to match the specifications. `,
          pageContent
        );
        console.log(`${file} loaded`);
        console.log(generatedCommands);
        return {
          id: nestJSFile.id,
          title: nestJSFile.title,
          result: `echo "${generatedCommands}" > ${file}`,
        };
      })
    )
  ).filter((result) => result !== undefined);

  console.log("results");
  console.log(results);

  const eslintCommand = `eslint ${files.map((file) => file).join(" ")} --fix`;
  console.log("eslintCommand", eslintCommand);

  await chrome.storage.local.set({
    commands: [
      generatedCommands,
      ...results.map((result) => result?.result),
      eslintCommand,
    ].join("\n"),
    lastPageGenerated: pageId,
  });
}
