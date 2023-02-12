# OpenAI GPT-3 Chat App

This is a simple chat application built using GPT-3. It uses [Next.js](https://nextjs.org/), and builds off of the OpenAI API [quickstart tutorial](https://beta.openai.com/docs/quickstart). Edit the prompt in the generate.ts file to describe the kind of chat character you'd like.

The streaming part is based on this [vercel edge function tutorial](https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions).

You can test out the promps in [ChatGPT](https://chat.openai.com/) and also in the [Playground Chat example](https://beta.openai.com/playground/p/default-chat).

## Setup

Install

```bash
$ npm install
```

Make a copy of the example environment variables file

```bash
$ cp .env.example .env
```

Add your [API key](https://beta.openai.com/account/api-keys) to the newly created `.env` file, and add your prompt as well.

Run the app

```bash
$ npm run dev
```
