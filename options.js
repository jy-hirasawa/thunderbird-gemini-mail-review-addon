// Options script for Gemini Mail Review add-on

// Initialize i18n
function localizeUI() {
  // Localize all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const messageId = element.getAttribute('data-i18n');
    const message = browser.i18n.getMessage(messageId);
    if (message) {
      element.textContent = message;
    }
  });
  
  // Localize placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const messageId = element.getAttribute('data-i18n-placeholder');
    const message = browser.i18n.getMessage(messageId);
    if (message) {
      element.placeholder = message;
    }
  });
  
  // Localize title
  const titleElement = document.querySelector('title[data-i18n]');
  if (titleElement) {
    const messageId = titleElement.getAttribute('data-i18n');
    const message = browser.i18n.getMessage(messageId);
    if (message) {
      document.title = message;
    }
  }
}

const apiKeyInput = document.getElementById('api-key');
const apiEndpointInput = document.getElementById('api-endpoint');
const toggleButton = document.getElementById('toggle-visibility');
const saveButton = document.getElementById('save');
const testButton = document.getElementById('test');
const statusDiv = document.getElementById('status');

// Default API endpoint
const DEFAULT_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

// Load saved settings
async function loadSettings() {
  try {
    const { geminiApiKey, geminiApiEndpoint } = await browser.storage.local.get(['geminiApiKey', 'geminiApiEndpoint']);
    if (geminiApiKey) {
      apiKeyInput.value = geminiApiKey;
    }
    // Set API endpoint to saved value or default
    apiEndpointInput.value = geminiApiEndpoint || DEFAULT_API_ENDPOINT;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Save settings
async function saveSettings() {
  const apiKey = apiKeyInput.value.trim();
  const apiEndpoint = apiEndpointInput.value.trim();
  
  if (!apiKey) {
    showStatus(browser.i18n.getMessage('errorApiKeyRequired'), 'error');
    return;
  }
  
  if (!apiEndpoint) {
    showStatus(browser.i18n.getMessage('errorEndpointRequired'), 'error');
    return;
  }
  
  try {
    await browser.storage.local.set({ 
      geminiApiKey: apiKey,
      geminiApiEndpoint: apiEndpoint
    });
    showStatus(browser.i18n.getMessage('successSaved'), 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus(browser.i18n.getMessage('errorSaving') + ' ' + error.message, 'error');
  }
}

// Test API connection
async function testConnection() {
  const apiKey = apiKeyInput.value.trim();
  const apiEndpoint = apiEndpointInput.value.trim();
  
  if (!apiKey) {
    showStatus(browser.i18n.getMessage('errorTestApiKeyFirst'), 'error');
    return;
  }
  
  if (!apiEndpoint) {
    showStatus(browser.i18n.getMessage('errorTestEndpointFirst'), 'error');
    return;
  }
  
  // Basic API key format validation (Google API keys are typically 39 characters)
  if (apiKey.length < 20) {
    showStatus(browser.i18n.getMessage('errorApiKeyTooShort'), 'error');
    return;
  }
  
  testButton.disabled = true;
  testButton.textContent = browser.i18n.getMessage('testingButton');
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, this is a test. Please respond with "OK".'
          }]
        }]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      showStatus(browser.i18n.getMessage('successTestConnection'), 'success');
    } else {
      showStatus(browser.i18n.getMessage('errorTestUnexpectedResponse'), 'error');
    }
  } catch (error) {
    console.error('Error testing connection:', error);
    showStatus(browser.i18n.getMessage('errorTestConnectionFailed') + ' ' + error.message, 'error');
  } finally {
    testButton.disabled = false;
    testButton.textContent = browser.i18n.getMessage('testButton');
  }
}

// Toggle password visibility
function toggleVisibility() {
  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    toggleButton.textContent = browser.i18n.getMessage('hideButton');
  } else {
    apiKeyInput.type = 'password';
    toggleButton.textContent = browser.i18n.getMessage('showButton');
  }
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.className = 'status';
    }, 3000);
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  localizeUI();
  loadSettings();
});
saveButton.addEventListener('click', saveSettings);
testButton.addEventListener('click', testConnection);
toggleButton.addEventListener('click', toggleVisibility);

// Save on Enter key
apiKeyInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveSettings();
  }
});
