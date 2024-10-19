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
            
            // Inject the buttons after text input is detected
            injectButtons(); 
            
            // Use keydown event as a fallback
            textArea.addEventListener('keydown', function(event) {
                console.log('Keydown event fired');
                
                // Clear the previous timer
                clearTimeout(typingTimer);
                
                // Start a new timer for 3 seconds after typing stops
                typingTimer = setTimeout(function() {
                    const userInput = textArea.textContent.trim();  // Use textContent to capture inner text
                    if (!userInput) {
                        console.log('User input is empty. Skipping context collection.');
                        return;  // Skip if input is empty
                    }
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

// Inject buttons only after text input is detected
function injectButtons() {
    // Select the target element where you want to inject the buttons above
    const targetElement = document.querySelector('.md\\:pt-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.w-full');

    // Check if the target element exists
    if (targetElement) {
        console.log('Target element found, injecting buttons.');

// Create button container
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'relative'; // Add relative positioning for absolute elements inside
buttonContainer.style.display = 'flex';
buttonContainer.style.flexDirection = 'column';
buttonContainer.style.alignItems = 'center'; // Center children horizontally
buttonContainer.style.gap = '10px'; 
buttonContainer.style.marginBottom = '20px';  
buttonContainer.style.marginTop = '20px';  
buttonContainer.style.backgroundColor = '#e98f41';
buttonContainer.style.paddingTop = '10px';
buttonContainer.style.paddingBottom = '10px';
buttonContainer.style.width = '700px'; // Set width to control the size of the container
buttonContainer.style.borderRadius = '10px';
buttonContainer.style.marginLeft = 'auto'; // Center horizontally
buttonContainer.style.marginRight = 'auto'; // Center horizontally
buttonContainer.style.maxWidth = '90%'; // Allow responsiveness on smaller screens

// Create close button
const closeButton = document.createElement('button');
closeButton.textContent = 'x';
closeButton.style.position = 'absolute';
closeButton.style.top = '5px';
closeButton.style.right = '10px';
closeButton.style.background = 'transparent';
closeButton.style.border = 'none';
closeButton.style.fontSize = '18px';
closeButton.style.color = '#166f40';
closeButton.style.cursor = 'pointer';

// Event listener for closing the container
closeButton.addEventListener('click', () => {
    buttonContainer.style.display = 'none'; // Hide the container when close button is clicked
});

// Append the close button to the button container
buttonContainer.appendChild(closeButton);

// Variable to keep track of the currently expanded button
let expandedButton = null;

// Function to create a button with a link
const createButtonWithLink = (buttonText) => {
    // Create button container
    const button = document.createElement('div');
    button.style.position = 'relative'; // Position for absolute elements inside
    button.style.width = '650px'; 
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#fff2d0'; 
    button.style.cursor = 'pointer';
    button.style.overflow = 'hidden'; // Prevent content from overflowing

    // Create button content
    const buttonContent = document.createElement('button');
    buttonContent.textContent = buttonText;
    buttonContent.style.padding = '10px 20px';
    buttonContent.style.backgroundColor = '#fff2d0'; 
    buttonContent.style.color = 'black';
    buttonContent.style.border = 'none';
    buttonContent.style.borderRadius = '5px';
    buttonContent.style.width = '100%'; // Full width of the parent div
    buttonContent.style.cursor = 'pointer';
    buttonContent.style.display = 'flex'; // Use flex to align the link properly
    buttonContent.style.justifyContent = 'space-between'; // Space between the text and the link
    buttonContent.style.alignItems = 'center'; // Align items vertically

    // Create the expand link
    const expandLink = document.createElement('a');
    expandLink.textContent = 'Read more...';
    expandLink.href = '#'; 
    expandLink.style.color = '#166f40';
    expandLink.style.textDecoration = 'underline';
    expandLink.style.fontWeight = '300';

    // Event listener for expand link
    expandLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        if (expandedButton && expandedButton !== button) {
            // Collapse the previously expanded button
            expandedButton.style.height = 'auto'; // Reset height
            const prevLink = expandedButton.querySelector('a');
            prevLink.textContent = 'Read more...'; // Show the link again
            prevLink.style.display = 'inline'; // Show the link again
            expandedButton.querySelector('.header').remove(); // Remove the expanded header
            expandedButton.querySelector('.content').remove(); // Remove the expanded content
        }

        // If the current button is already expanded, collapse it
        if (button.style.height === '200px') {
            button.style.height = 'auto'; // Collapse
            expandLink.textContent = 'Read more...'; // Show the link again
            button.querySelector('.header').remove(); // Remove the expanded header
            button.querySelector('.content').remove(); // Remove the expanded content
            expandedButton = null; // Reset the expanded button tracker
        } else {
            // Expand the current button
            button.style.height = '200px'; // Double the height
            expandLink.style.display = 'none'; // Hide the link

            // Create header element
            const header = document.createElement('span');
            header.textContent = buttonText;
            header.style.fontWeight = 'bold'; // Bold header
            header.classList.add('header'); // Add class for easy access later
            header.style.position = 'absolute'; // Position header absolutely
            header.style.top = '10px'; // Position at the top
            header.style.left = '10px'; // Left alignment
            button.appendChild(header); // Add header to the button

            // Create content div
            const content = document.createElement('div');
            content.textContent = 'hello hello'; // Set content text
            content.classList.add('content'); // Add class for easy access later
            // content.style.textAlign = 'center'; // Center the text
            content.style.position = 'absolute'; // Position content absolutely
            content.style.top = '50%'; // Center vertically
            content.style.left = '50%'; // Center horizontally
            content.style.transform = 'translate(-50%, -50%)'; // Center the content
            button.appendChild(content); // Add content to the button
            
            expandedButton = button; // Set the expanded button tracker
        }
    });

    // Append link to the button content
    buttonContent.appendChild(expandLink);
    button.appendChild(buttonContent); // Append button content to the button

    return button; // Return the entire button div
};

// Create buttons with links
const button1 = createButtonWithLink('Button 1');
const button2 = createButtonWithLink('Button 2');
const button3 = createButtonWithLink('Button 3');

// Append buttons to the container
buttonContainer.appendChild(button1);
buttonContainer.appendChild(button2);
buttonContainer.appendChild(button3);

// Append the button container to the desired parent element (e.g., document.body)
document.body.appendChild(buttonContainer);


// Insert the button container above the target element
targetElement.parentNode.insertBefore(buttonContainer, targetElement);


    } else {
        console.log('Target element not found');
    }
}
