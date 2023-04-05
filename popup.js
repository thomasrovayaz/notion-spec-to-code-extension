const copyCommandContainer = document.getElementById('copyCommandsContainer');
const copyCommandButton = document.getElementById('copyCommands');
const generateCommandContainer = document.getElementById('generateCommandsContainer');
const generateCommandButton = document.getElementById('generateCommands');
const technologyInput = document.getElementById('technology');
const currentPromptInput = document.getElementById('currentPrompt');
const commandsDiv = document.getElementById('commands');
const notCommandsOfPage = document.getElementById('notCommandsOfPage');

function renderCommands() {
    chrome.storage.local.get(['apiKey', 'commands'], ({ apiKey, commands }) => {
        if (commands) {
            copyCommandButton.disabled = false;
            commandsDiv.innerHTML = commands;
        } else {
            copyCommandButton.disabled = true;
            commandsDiv.innerHTML = 'Click the button below to generate OpenAI commands from the current Notion page.';
        }
        if (!apiKey) {
            generateCommandButton.disabled = true;
            commandsDiv.innerHTML = 'Please set your API key in the options page.';
        } else {
            generateCommandButton.disabled = false;
        }
    });
    renderWarningOtherPageCommands()
}
function renderWarningOtherPageCommands() {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        try {
            const pageId = urlToPageId(tabs[0].url);
            if (!pageId) {
                notCommandsOfPage.style.display = "none";
                return;
            }
            chrome.storage.local.get(['lastPageGenerated', 'commands'], ({ lastPageGenerated, commands }) => {
                if (!commands || lastPageGenerated === pageId) {
                    notCommandsOfPage.style.display = "none";
                } else if (commands) {
                    notCommandsOfPage.style.display = "block";
                }
            });
        } catch (error) {
            console.error('Error generating commands from AI:', error);
        }
    });
}
async function renderLoading() {
    chrome.storage.local.get('loading', ({ loading }) => {
        generateCommandContainer.className = loading? 'loading': '';
    });
}
function renderPrompt() {
    chrome.storage.local.get(['currentPrompt'], ({ currentPrompt }) => {
        currentPromptInput.value = currentPrompt;
    });
}

chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.commands) {
        renderCommands()
    } else if (changes.loading){
        renderLoading()
    } else if (changes.currentPrompt) {
        renderPrompt()
    }
});
renderCommands()
renderLoading()
renderPrompt()

function urlToPageId(url) {
    if (!url || !url.includes('notion.so')) {
        return null;
    }
    const paths = url.split('/');
    const pageSlug = paths[paths.length - 1];
    if (!pageSlug ) {
        return null;
    }
    const pageSlugSplit = pageSlug.split('-');
    return pageSlugSplit[pageSlugSplit.length - 1];
}

copyCommandButton.addEventListener('click',  () => {
    chrome.storage.local.get('commands', ({ commands }) => {
        navigator.clipboard.writeText(commands);
    });
    copyCommandContainer.className = 'copied';
    setTimeout(() => {
        copyCommandContainer.className = '';
    }, 2000);
});

generateCommandButton.addEventListener('click', async (event) => {
    chrome.runtime.sendMessage({
        command: 'callChatGPT',
        technology: technologyInput.value,
        currentPrompt: currentPromptInput.value,
    });
});
