// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// alert('Hello World!');
// Content Script
// This script interacts with the DOM of the pages where the extension is active.

// Create and append the icon to the document body.
const icon = document.createElement('img');
icon.src = chrome.runtime.getURL('assets/icon.png');
icon.id = 'myExtensionIcon';
document.body.appendChild(icon);

// Event listener for icon clicks.
icon.addEventListener('click', () => {
  const text = getTextFromInput();
  if (text) {
    // Send the text to the backend for correction.
    fetch('https://jsonplaceholder.typicode.com/todos/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    })
    .then(response => response.json())ø
    .then(data => {
      // Replace the original text with the corrected text.
      replaceText(data.correctedText);
    })
    .catch(error => console.error('Error:', error));
  }
});

// Function to get text from the active input field.
function getTextFromInput() {
  // Implement this function
}

// Function to replace text in the active input field.
function replaceText(correctedText) {
  // Implement this function
}