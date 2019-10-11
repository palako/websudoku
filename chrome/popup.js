let solveButton = document.getElementById('solveButton');

solveButton.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id,{file: 'websudoku.js'});
        chrome.tabs.executeScript(tabs[0].id,{file: 'contentScript.js'});
    });
  };