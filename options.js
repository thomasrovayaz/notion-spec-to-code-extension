const apiKeyInput = document.getElementById('apiKey');
const customPromptInput = document.getElementById('customPrompt');
const apiKeySaveButton = document.getElementById('saveApiKey');
const saveApiKeyContainer = document.getElementById('saveApiKeyContainer');

apiKeySaveButton.addEventListener('click', () => {
    chrome.storage.local.set({
            apiKey: apiKeyInput.value,
            customPrompt: customPromptInput.value
        },
        () => {
            saveApiKeyContainer.className = 'saved';
            setTimeout(() => {
                saveApiKeyContainer.className = '';
            }, 2000);
        }
    );
})

chrome.storage.local.get(['apiKey', 'customPrompt'], ({ apiKey, customPrompt }) => {
    console.log("apiKey", apiKey);
    if (apiKey) {
        apiKeyInput.value = apiKey;
    }
    if (customPrompt) {
        customPromptInput.value = customPrompt;
    }
})
