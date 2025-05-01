import browser from "webextension-polyfill";

function createContextMenu() {
  browser.contextMenus.create(
    {
      id: "speech-selection",
      title: "Speech Selection",
      contexts: ["selection"],
    },
    () => {
      if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError.message}`);
      }
    }
  );
}

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    createContextMenu();
  }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "speech-selection":
      if (!tab?.id) return;
      browser.tabs.sendMessage(tab?.id, {
        selection: info.selectionText,
      });
      break;
  }
});
