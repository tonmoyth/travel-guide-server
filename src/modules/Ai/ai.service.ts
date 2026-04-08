import { openRouterClient } from "../../config/openrouter";

/**
 * Sends a message to the AI via OpenRouter and returns the reply.
 * Uses the standard OpenAI-compatible chat completions endpoint.
 */
export const sendMessageToAI = async (message: string): Promise<string> => {
  const response = await openRouterClient.post("chat/completions", {
    model: "openrouter/free",
    messages: [
      {
        role: "system",
        content:
          "You are a smart travel guide assistant for Bangladesh. Suggest places, hotels, and tips.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.data.choices[0].message.content as string;
};