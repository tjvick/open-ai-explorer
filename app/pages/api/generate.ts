import type {NextApiRequest, NextApiResponse} from 'next'
import {ChatCompletionResponseMessage, Configuration, OpenAIApi} from "openai";
import {promptConfigs} from "@/shared/promptConfigs";
import {ChatCompletionRequestMessageRoleEnum} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured."
      }
    });
    return;
  }

  const promptType = req.body.promptType || '';
  const input = req.body.input || '';
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      }
    })
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generateMessages(promptType, input),
      temperature: 0.6,
    })
    res.status(200).json({result: completion.data.choices[0].message?.content});
  } catch(error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generateMessages(promptType: string, input: string) {
  const messages: ChatCompletionResponseMessage[] = []
  if (promptConfigs[promptType].promptSystemMessage) {
    messages.push(
      {"role": ChatCompletionRequestMessageRoleEnum.System, "content": promptConfigs[promptType].promptSystemMessage || ''}
    )
  }
  messages.push(
    {"role": ChatCompletionRequestMessageRoleEnum.User, "content": promptConfigs[promptType].promptGenerator(input)}
  )
  return messages
}

function generatePrompt(promptType: string, input: string) {
  return promptConfigs[promptType].promptGenerator(input)
}
