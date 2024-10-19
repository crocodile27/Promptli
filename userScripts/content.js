let typingTimer;  // Timer identifier
const typingInterval = 2000;  // Time in milliseconds (2 seconds)
let lastUrl = window.location.href;  // Track the current URL

// Function to detect changes in the URL
function checkUrlChange() {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
        console.log('URL changed:', currentUrl);
        lastUrl = currentUrl;
        initChatInputDetection();  // Run the detection function again
    }
}

// Function to detect the chat input
function initChatInputDetection() {
    const checkTextArea = setInterval(() => {
        console.log('Looking for #prompt-textarea...');
        const textArea = document.querySelector('#prompt-textarea');
    
        if (textArea) {
            console.log('Text area detected!');
        
            // Use keydown event as a fallback
            textArea.addEventListener('keydown', function(event) {
                console.log('Keydown event fired');
                
                // Clear the previous timer
                clearTimeout(typingTimer);
                
                // Start a new timer for 3 seconds after typing stops
                typingTimer = setTimeout(function() {
                    const userInput = textArea.textContent.trim();  // Use textContent to capture inner text
                    console.log('User input after 2 seconds of inactivity:', userInput);  // Log the input
                    
                    // Collect the context (previous responses)
                    const context = getContext();
                    console.log('User input with context:', { userInput, context });
                }, typingInterval);
            });
        
            clearInterval(checkTextArea);  // Stop checking once detected
        } else {
            console.log('#prompt-textarea not found yet...');
        }
    }, 1000);  // Check every 1000ms (1 second)
}

// Call the input detection when the page loads
initChatInputDetection();

// Periodically check for URL changes (e.g., every 1 second)
setInterval(checkUrlChange, 1000);  // Check URL changes every 1 second

// Collect context from previous conversations
function getContext() {
    const responseElements = document.querySelectorAll('div[data-message-id]');
    
    const context = [];
    
    responseElements.forEach(response => {
        const role = response.getAttribute('data-message-author-role');
        
        // Assistant responses are within '.markdown'
        const messageContentElement = response.querySelector('.markdown');
        
        // User inputs are within '.whitespace-pre-wrap'
        const userContentElement = response.querySelector('.whitespace-pre-wrap');
        
        // If it's an assistant response and the content exists
        if (messageContentElement) {
            const messageContent = messageContentElement.textContent.trim();
            context.push({
                role: 'assistant',
                content: messageContent
            });
        }

        // If it's a user input and the content exists
        if (userContentElement) {
            const userContent = userContentElement.textContent.trim();
            context.push({
                role: 'user',
                content: userContent
            });
        }
    });
    
    // Optionally, get only the last 5 responses for context
    const recentContext = context.slice(-5);
    
    // Format the output for the console
    recentContext.forEach(item => {
        if (item.role === 'assistant') {
            console.log(`Assistant: ${item.content}`);
        } else if (item.role === 'user') {
            console.log(`User: ${item.content}`);
        }
    });
    
    return recentContext;
}
