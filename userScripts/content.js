// Create a MutationObserver to monitor DOM changes
const observer = new MutationObserver((mutationsList, observer) => {
    const TEXT_AREA_ID = '#prompt-textarea';
    console.log('MutationObserver: Observing DOM for changes...');
  
    // Try to find the text area
    const textArea = document.querySelector(TEXT_AREA_ID);
  
    if (textArea) {
      console.log('Text area detected by MutationObserver:', textArea);
  
      let typingTimer; // Timer identifier
      const debounceTime = 3000; // Time in milliseconds (3 seconds)
  
      // Add the input event listener once the text area is found
      textArea.addEventListener('input', function() {
        // Clear the previous timer if the user is still typing
        clearTimeout(typingTimer);
  
        // Set a new timer that will execute the function after 3 seconds of inactivity
        typingTimer = setTimeout(function() {
          const userInput = textArea.textContent.trim();
          console.log('User stopped typing. Input:', userInput);
          
          // Here you would call the backend API or log the message
          // Example: chrome.runtime.sendMessage({ action: "fetchSuggestions", prompt: userInput });
        }, debounceTime);
      });
  
      // Stop observing after finding the text area
      observer.disconnect();
    } else {
      console.log('Text area not found by MutationObserver yet');
    }
  });
  
  // Start observing the body for changes in child elements
  observer.observe(document.body, { childList: true, subtree: true });
  