# Promptli 
Make the most out of AI with Promptli, your personal prompt engineer: automatic prompt suggestions as you type.

## How to get started with promptli
1. Clone our repository
  ```git clone git@github.com:crocodile27/Promptli.git```

2. Head over to https://aistudio.google.com/app/apikey and follow the steps to get your API key

3. Put it in express's server.js

4. Go to chrome://extensions/ on chrome browser and click load unpacked. Then click the userScripts folder and click ok.

5. Open chatgpt.com and start using our chrome extension.

## Inspiration
As students and programmers we can spend countless iterations and follow ups prompting ChatGPT to give us the answer that we are looking for. Often before we reach a working solution we've already used up our tokens for ChatGPT 4.0. Not only is prompting time consuming, but also token-consuming. Thus, we decided to create something convenient and practical that we can use to help us engineer our prompts for large language models.

## What it does
Promptli is a prompt engineering chrome extension that provides personalized suggestions and improves your prompts as you type them live in the chatbot. By using frameworks from our research into prompt engineering, Promptli analyzes the prompt on the following dimensions:

1. Identify any ambiguities, vague terms, or areas that could benefit from more detail or context.
2. Assess the logical flow and organization of the prompt. 
3. Evaluate the word choice, vocabulary precision, and overall readability.
4. Determine whether the prompt is appropriately focused and scoped for its intended purpose.
5. Making prompts more "AI-friendly"

Make the most out of AI with Promptli, your personal prompt engineer.

## How we built it
We built a chrome extension using: 
- Javascript for the back-end server, scripting, and content rendering
- HTML & CSS for a user-friendly UI/UX that seamlessly integrates with the chat interface
- Gemini API for Promptli’s prompt engineering capabilities and JSON file rendering
- 100ms processing time for real time prompt improvement
- Effortless rendering of new prompts
- Interactive and easy-to-use UI/UX with single click per prompt

## Challenges we ran into

\We began this project without prior experience with creating web extensions. Our first step was looking at resources from the Chrome Developers site. Specifically focused on chrome extension sample code and familiarizing ourselves with their API.

Our second challenge was integrating our extension with AI platforms in a seamless fashion that was easy to use and wouldn’t block users’ workflow. This posed greater difficulties than we had initially anticipated as we needed to inject our JS into the website's dynamic layout. After several iterations of designs and troubleshooting our extensions compatibility with the AI site’s code, we were able to create something that works alongside the website’s ever changing layout and is intuitive to use.

Lastly, having to work in a time-crunch with little to no sleep was definitely challenging but at the same time thrilling to build something with our friends that we truly would use and love as a product.

## Accomplishments that we're proud of
We're proud of building an app that we could use ourselves and provides practical value to any daily user of a chat bot. A lot of the time, the world seems overcrowded with artificial intelligence and machines so we are also are proud of creating a more human friendly experience that allows better communication between machine learning models and the human being. 

## What we learned
I think the best learning experience was about ourselves and our capabilities when working with friends for something we were passionate about. This was a really fun experience and we loved hacking our persimmon app: Promptli.

Other things we learned:
- how to code a chrome extension
- how to create a back end server
- how to utilize javascript to call API and parse it through
- how to prompt engineer
- how to prompt chatbots to output file structure
- how to sleep under a table

## What's next for Promptli 
We're currently working on integration with a wider range of generative AI services and hope to make the product more accessible with future partnerships. We also hope for a custom prompting model for long term sustainability fine tuned for writing good prompts.

