import { Configuration, OpenAIApi } from "openai";

export default async function ({
  apiKey,
  message,
  systemMessage,
}: {
  apiKey: string;
  message: string;
  systemMessage: string;
}): Promise<{ message: null | string; error: any | null }> {
  console.log("message", message);

  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
    });
    return { message: completion.data.choices[0].message?.content ?? null, error: null };
  } catch (error) {
    console.error(error);
    return { message: null, error };
  }
}
