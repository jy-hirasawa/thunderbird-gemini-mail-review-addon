// Background script for Gemini Mail Review add-on
console.log("Gemini Mail Review add-on loaded");

// Initialize the extension
browser.runtime.onInstalled.addListener(() => {
  console.log("Gemini Mail Review add-on installed");
});

// Handle compose action button click
browser.composeAction.onClicked.addListener((tab) => {
  console.log("Gemini Mail Review button clicked for tab:", tab.id);
  
  // Open popup.html in a new window
  browser.windows.create({
    url: "popup.html",
    type: "popup",
    width: 600,
    height: 700
  }).then((window) => {
    console.log("Review window opened:", window.id);
  }).catch((error) => {
    console.error("Error opening review window:", error);
  });
});
