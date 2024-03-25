function syncState() {
  return fetch("http://localhost:4999/ping")
    .then((response) => response.text())
    .then((data) => {
      if (data) {
        chrome.action.setBadgeText({
          text: "ON",
        });
      }
      return true;
    })
    .catch((error) => {
      chrome.action.setBadgeText({
        text: "OFF",
      });
      return false;
    });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
  syncState();
});

chrome.action.onClicked.addListener(async (tab) => {
  syncState();
});

// 在扩展的背景脚本中
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "GitCopilot",
    title: "GitCopilot",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  console.log("===contextMenus.onClicked", info, tab);
  if (info.menuItemId === "GitCopilot") {
    // 复制选中内容到剪贴板
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyToTheClipboardAndSendToCopilotServer,
      args: [info.selectionText],
    });
  }
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === "Copy2Copilot") {
    console.log("Copy2Copilot");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("tabs", tabs);
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getSelectionCopyToTheClipboardAndSendToCopilotServer,
      });
    });
  }
});

async function copyToTheClipboardAndSendToCopilotServer(textToCopy) {
  const el = document.createElement("textarea");
  el.value = textToCopy + "\n 详细解释上文以及其中提到的名词和概念";
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  fetch("http://localhost:4999/send");
}

function getSelectionCopyToTheClipboardAndSendToCopilotServer() {
  var selection = window.getSelection();
  console.log("selection", selection.rangeCount);
  if (selection.rangeCount > 0) {
    var range = selection.getRangeAt(0);
    var textToCopy = range.toString();
    const el = document.createElement("textarea");
    el.value = textToCopy + "\n 详细解释上文以及其中提到的名词和概念";
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    fetch("http://localhost:4999/send");
  }
}
