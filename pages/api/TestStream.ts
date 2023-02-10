import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export async function TestStream() {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      setTimeout(() => {
        const text = "yay ";
        const queue = encoder.encode(text);
        controller.enqueue(queue);
      }, 500);

      controller.close();
    },
  });

  return stream;
}
