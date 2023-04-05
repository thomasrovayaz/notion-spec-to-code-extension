chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.command === 'callChatGPT') {
        await chrome.storage.local.get(['apiKey', 'customPrompt'], async ({ apiKey, customPrompt }) => {
            if (!apiKey) {
                window.alert('Please set your API key in the options page.');
                return;
            }
            await chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                chrome.storage.local.set({ 'loading': true });
                try {
                    const pageId = urlToPageId(tabs[0].url);

                    chrome.storage.local.set({
                            currentPrompt: msg.currentPrompt
                        }
                    );

                    await chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        args: [
                            pageId,
                            apiKey,
                            customPrompt || '',
                            msg.technology || 'NestJS',
                            msg.currentPrompt || ''
                        ],
                        func: callChatGPT
                    });
                } catch (error) {
                    console.error('Error generating commands from AI:', error);
                }
                chrome.storage.local.set({ 'loading': false });
                chrome.notifications.create('commandsGenerated', {
                    type: 'basic',
                    iconUrl: 'icon48.png',
                    title: 'Commands Generated!',
                    message: "The shell commands have been generated. Click the button below to copy them to your clipboard.",
                    priority: 0
                });
            });
        });
    }
});

function urlToPageId(url) {
    const paths = url.split('/');
    const pageSlug = paths[paths.length - 1];
    const pageSlugSplit = pageSlug.split('-');
    return pageSlugSplit[pageSlugSplit.length - 1];
}

function onNotificationClicked() {
    chrome.windows.create({
        focused: true,
        type: 'popup',
        url: 'popup.html',
        width: 530,
        height: 511,
    });
}

chrome.notifications.onClicked.addListener(onNotificationClicked)

chrome.runtime.onInstalled.addListener(({ reason, version }) => {
    console.log('onInstalled', reason, version);
    chrome.storage.local.remove(['commands', 'lastPageGenerated', 'loading']);
});


async function callChatGPT(pageId, apiKey, customPrompt, technology, customPromptTmp) {
    const pageContent = document.getElementsByTagName('main')[0].innerText;
    try {
        let generatedCommands;
        let prompt = `Generate the shell commands to create the files based on the following specifications:\n${pageContent}\n`
            + `Do not write any other text than the shell commands.`
            + `You should reply ONLY the shell commands so I can copy and paste your response directly in the terminal.`
            + `Use the echo command to write the code in the files.`
            + `${customPrompt}\n`
            + `${customPromptTmp}\n`;

        console.log(prompt);
        const messages = [
            {"role": "user", "content": `Ignore all instructions before this one. You’re a senior developer. You have been making development for 20 years. Your task is now to generate ${technology} code. You must ALWAYS review your code and correct it BEFORE you answer so you can improve the quality of your code.`},
            {"role": "user", "content": prompt}
        ]
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": messages,
                n: 1,
                stop: null,
                temperature: 0.2,
            })
        }).then(response => response.json());

        let choice = response.choices[0]
        generatedCommands = choice.message.content.trim()
            .replaceAll('!', '\\!')
            .replaceAll('$', '\\$');

        console.log('Generated commands:\n');
        console.log(generatedCommands);

        chrome.storage.local.set({ 'commands': generatedCommands, 'lastPageGenerated': pageId });
    } catch (error) {
        console.error('Error generating commands from AI:', error);
    }
}
