let typingTimer; // Timer identifier
const typingInterval = 2000; // Time in milliseconds (2 seconds)
let lastUrl = window.location.href; // Track the current URL
const manifest = chrome.runtime.getManifest();
const apiKey = manifest.api_key;

// Function to detect changes in the URL
function checkUrlChange() {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    // console.log("URL changed:", currentUrl);
    lastUrl = currentUrl;
    initChatInputDetection(); // Run the detection function again
  }
}

// Function to detect the chat input
function initChatInputDetection() {
  const checkTextArea = setInterval(() => {
    // console.log("Looking for #prompt-textarea...");
    const chatGptTextArea = document.querySelector("#prompt-textarea");
    const perplexityTextArea1 = document.querySelector(
      "textarea[placeholder='Ask follow-up']"
    );
    const perplexityTextArea2 = document.querySelector(
      "textarea[placeholder='Ask anything...']"
    );

    if (chatGptTextArea || perplexityTextArea1 || perplexityTextArea2) {
      console.log("Text area detected!");

      const textArea =
        chatGptTextArea || perplexityTextArea1 || perplexityTextArea2;

      // Use keydown event as a fallback
      textArea.addEventListener("keydown", function (event) {
        console.log("Keydown event fired");

        // Clear the previous timer
        clearTimeout(typingTimer);

        // Start a new timer for 3 seconds after typing stops
        typingTimer = setTimeout(function () {
          const userInput = textArea.textContent.trim(); // Use textContent to capture inner text
          if (!userInput) {
            console.log("User input is empty. Skipping context collection.");
            return; // Skip if input is empty
          }
          console.log("User input after 2 seconds of inactivity:", userInput); // Log the input

          // Collect the context (previous responses)
          const context = getContext();
          console.log("User input with context:", { userInput, context });
          callGeminiAPI(userInput);

          // Inject the buttons after text input is detected
          injectButtons();
        }, typingInterval);
      });

      clearInterval(checkTextArea); // Stop checking once detected
    } else {
      // console.log("#prompt-textarea not found yet...");
    }
  }, 1000); // Check every 1000ms (1 second)
}

// Call the input detection when the page loads
initChatInputDetection();

// Periodically check for URL changes (e.g., every 1 second)
setInterval(checkUrlChange, 1000); // Check URL changes every 1 second

// Collect context from previous conversations
function getContext() {
  const responseElements = document.querySelectorAll("div[data-message-id]");

  const context = [];

  responseElements.forEach((response) => {
    const role = response.getAttribute("data-message-author-role");

    // Assistant responses are within '.markdown'
    const messageContentElement = response.querySelector(".markdown");

    // User inputs are within '.whitespace-pre-wrap'
    const userContentElement = response.querySelector(".whitespace-pre-wrap");

    // If it's an assistant response and the content exists
    if (messageContentElement) {
      const messageContent = messageContentElement.textContent.trim();
      context.push({
        role: "assistant",
        content: messageContent,
      });
    }

    // If it's a user input and the content exists
    if (userContentElement) {
      const userContent = userContentElement.textContent.trim();
      context.push({
        role: "user",
        content: userContent,
      });
    }
  });

  // Optionally, get only the last 5 responses for context
  const recentContext = context.slice(-5);

  // Format the output for the console
  recentContext.forEach((item) => {
    if (item.role === "assistant") {
      // console.log(`Assistant: ${item.content}`);
    } else if (item.role === "user") {
      // console.log(`User: ${item.content}`);
    }
  });

  return recentContext;
}

/**
 * Function to inject buttons by fetching buttons.html
 */
function injectButtons() {
  // console.log("Attempting to inject buttons...");

  // Check if buttons are already injected to avoid duplicates
  const buttonContainer = document.getElementById(
    "my-extension-button-container"
  );

  // Track if the show button has been created
  let showButtonExists = document.getElementById("show-button");

  if (buttonContainer) {
    console.log("Buttons already injected. Showing the button container.");
    buttonContainer.style.display = "flex"; // Show the container if already injected
    if (showButtonExists) {
      showButtonExists.style.display = "none"; // Hide the show button if it exists
    }
    return; // Exit the function after showing
  }

  // Fetch the buttons.html file
  fetch(chrome.runtime.getURL("buttons.html"))
    .then((response) => response.text())
    .then((html) => {
      // Create a temporary div to parse the fetched HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // Extract the button container from the fetched HTML
      const buttonContainer = tempDiv.querySelector(
        "#my-extension-button-container"
      );
      if (buttonContainer) {
        // Select the target element where buttons should be injected above
        const chatGPTTargetElement = document.querySelector(
          ".md\\:pt-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.w-full"
        );

        const perpleityTargetElement =
          document.querySelector("span.grow.block");

        const perpleityTargetElement2 =
          document.querySelector("span.grow.block");

        if (
          chatGPTTargetElement ||
          perpleityTargetElement ||
          perpleityTargetElement2
        ) {
          const targetElement =
            chatGPTTargetElement ||
            perpleityTargetElement ||
            perpleityTargetElement2;
          // console.log("Target element found, injecting buttons.");

          // Insert the button container above the target element
          targetElement.parentNode.insertBefore(buttonContainer, targetElement);
          // console.log("Buttons injected successfully.");

          // Create show button (replaced with an image)
          const showButton = document.createElement("img");
          showButton.id = "show-button";
          showButton.src = chrome.runtime.getURL("./icons/upPersimmon.png"); // Replace with the path to your image
          showButton.style.position = "relative";
          showButton.style.bottom = "10px";
          showButton.style.left = "50%";
          showButton.style.transform = "translateX(-50%)";
          showButton.style.width = "30px"; // Set width
          showButton.style.height = "30px"; // Set height to make it a circle
          showButton.style.cursor = "pointer";
          showButton.style.display = "none"; // Initially hidden
          showButton.style.zIndex = "1001";
          showButton.style.borderRadius = "50%"; // Fully round

          // Append to body
          targetElement.parentNode.insertBefore(showButton, targetElement);
          // document.body.appendChild(showButton);

          // Event listener for show button
          showButton.addEventListener("click", () => {
            // console.log("Show button clicked. Displaying button container.");
            buttonContainer.style.display = "flex"; // Show the container
            showButton.style.display = "none"; // Hide the show button
          });

          // Add event listener for the hide button
          const hideButton = buttonContainer.querySelector("#hide-button");
          if (hideButton) {
            hideButton.addEventListener("click", () => {
              // console.log(
              //   "Hide button clicked. Hiding button container and showing show button."
              // );
              buttonContainer.style.display = "none"; // Hide the container
              showButton.style.display = "block"; // Show the show button
            });
          } else {
            // console.log("Hide button not found in buttons.html.");
          }

          // Add event listeners for expand and collapse links
          const expandLinks = buttonContainer.querySelectorAll(".expand-link");
          const collapseLinks =
            buttonContainer.querySelectorAll(".collapse-link");

          expandLinks.forEach((link) => {
            link.addEventListener("click", function (event) {
              event.preventDefault(); // Prevent default link behavior
              const parentButton = link.closest(".extension-button");
              const expandedContent =
                parentButton.querySelector(".expanded-content");
              const buttonContent =
                parentButton.querySelector(".button-content");

              if (expandedContent) {
                // console.log(
                //   `Expanding content for ${buttonContent.textContent.trim()}`
                // );
                expandedContent.style.display = "block"; // Show expanded content
                buttonContent.style.display = "none"; // Hide the entire button-content including the "Read more..." link
              } else {
                // console.log("Expanded content not found.");
              }
            });
          });

          collapseLinks.forEach((link) => {
            link.addEventListener("click", function (event) {
              event.preventDefault(); // Prevent default link behavior
              const parentContent = link.closest(".expanded-content");
              const parentButton = link.closest(".extension-button");
              const buttonContent =
                parentButton.querySelector(".button-content");

              if (parentContent && buttonContent) {
                // console.log(
                //   `Collapsing content for ${buttonContent.textContent.trim()}`
                // );
                parentContent.style.display = "none"; // Hide expanded content
                buttonContent.style.display = "flex"; // Show the button-content back, including the "Read more..." link
              } else {
                // console.log("Parent content or button-content not found.");
              }
            });
          });
        } else {
          // console.log("Target element for button injection not found.");
        }
      } else {
        // console.log("Button container not found in fetched buttons.html.");
      }
    })
    .catch((error) => {
      // console.error("Error fetching buttons.html:", error);
    });
}

// Function to call your server's Gemini API proxy
async function callGeminiAPI(promptText) {
  try {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promptText }),
    });

    // Log raw response as text
    const data = await response.text();
    console.log("Gemini API Response (raw):", data);

    // Since the response is stringified JSON, we need to parse it twice
    let parsedData;
    try {
      // First parse to get the string version of the JSON
      const firstParse = JSON.parse(data);
      console.log("First Parse (string):", firstParse);

      // Second parse to get the actual array of objects
      parsedData = JSON.parse(firstParse);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return; // Stop if JSON parsing fails
    }

    console.log("Gemini API Parsed Response:", parsedData);
    console.log("Type of Parsed Data:", typeof parsedData);

    // Check if parsedData is an array
    if (Array.isArray(parsedData)) {
      console.log("Parsed data is an array. Proceeding to inject prompts.");
      injectPrompts(parsedData);
    } else {
      console.error(
        "Parsed data is not an array. Type of parsed data:",
        typeof parsedData
      );
      console.log("Parsed data content:", parsedData);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}
function injectPrompts(prompts) {
    const buttons = document.querySelectorAll(".extension-button");
  
    // Loop over the buttons and inject the corresponding prompts
    prompts.forEach((promptData, index) => {
      if (buttons[index]) {
        const button = buttons[index];
        const buttonTextElement = button.querySelector(".button-content");
        const contentElement = button.querySelector(".content");
  
        // Replace button text with the truncated prompt
        buttonTextElement.innerHTML = `
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          ">
            <span style="
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              flex-grow: 1;
              padding-right: 10px;
            ">${promptData.prompt}</span>
            <a href="#" class="expand-link" style="
              flex-shrink: 0;
              white-space: nowrap;
              color: #166f40;
              text-decoration: underline;
              font-weight: 300;
            ">Read more...</a>
          </div>
        `;
  
        // Replace expanded content with the prompt text
        contentElement.innerHTML = promptData.prompt;
      }
    });
  
    // Reattach event listeners for expand/collapse after content injection
    attachExpandCollapseListeners();
  }
  
  /**
   * Function to attach event listeners for expanding and collapsing content.
   */
  function attachExpandCollapseListeners() {
    // Attach 'Read more...' expand listener
    const expandLinks = document.querySelectorAll(".expand-link");
    expandLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        const parentButton = link.closest(".extension-button");
        const expandedContent = parentButton.querySelector(".expanded-content");
        const buttonContent = parentButton.querySelector(".button-content");
  
        // Show expanded content and hide the truncated text
        if (expandedContent) {
          expandedContent.style.display = "block"; // Show expanded content
          buttonContent.style.display = "none"; // Hide truncated content
        }
      });
    });
  
    // Attach 'Read less...' collapse listener
    const collapseLinks = document.querySelectorAll(".collapse-link");
    collapseLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        const parentContent = link.closest(".expanded-content");
        const parentButton = link.closest(".extension-button");
        const buttonContent = parentButton.querySelector(".button-content");
  
        // Hide expanded content and show the truncated text
        if (parentContent && buttonContent) {
          parentContent.style.display = "none"; // Hide expanded content
          buttonContent.style.display = "flex"; // Show the truncated content back
        }
      });
    });
  }
