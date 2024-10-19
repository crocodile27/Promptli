// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "fetchSuggestions") {
//       const prompt = request.prompt;
  
//       fetch('https://gemini.api/endpoint', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer <YOUR_API_KEY>',
//         },
//         body: JSON.stringify({ prompt })
//       })
//       .then(response => response.json())
//       .then(data => {
//         // Send back the suggestions to the content script
//         chrome.tabs.sendMessage(sender.tab.id, { action: "displaySuggestions", suggestions: data.suggestions });
//       })
//       .catch(error => console.error('Error fetching suggestions:', error));
//     }
//   });
  