
// Create one test item for each context type.
var contexts = ["selection"];

chrome.contextMenus.create({
  "title":"将这一句记录到\"茴香\"",
  "contexts":["selection"],
  "onclick":function(info,tab){
    console.log(info,tab);
  }
});


chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    console.log(sender);
    console.log(request);
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    sendResponse("I'm the response.");

});