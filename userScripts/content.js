let typingTimer;  // Timer identifier
const typingInterval = 3000;  // Time in milliseconds (3 seconds)

function getContext() {
    // Select all previous responses (both user and assistant)
    const responseElements = document.querySelectorAll('div[data-message-id]');
    
    const context = [];
    
    responseElements.forEach(response => {
        const role = response.getAttribute('data-message-author-role');
        const messageContentElement = response.querySelector('.markdown');
        
        // Only proceed if the messageContentElement exists (avoid null error)
        if (messageContentElement) {
            const messageContent = messageContentElement.textContent.trim();
            
            context.push({
                role: role,  // "assistant" or "user"
                content: messageContent
            });
        }
    });
    
    // Optionally, get only the last 3 or 5 responses for context
    const recentContext = context.slice(-5);  // Adjust the number of responses you want to keep
    
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

// Check for the textarea and use keydown event
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
                console.log('User input after 3 seconds of inactivity:', userInput);  // Log the input
                
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
