import OpenAI from "openai";

class PerplexityService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.PERPLEXITY_API_KEY as string,
      baseURL: "https://api.perplexity.ai",
    });
  }

  public async sendPrompt(messages: any) {
    return this.client.chat.completions.create({
      model: "llama-3.1-sonar-small-128k-online",
      messages: messages,
      temperature: 0.3,
      max_tokens: 2000,
    });
  }

  public parseAiResponse<T>(response: string): T {
    try {
      // Match anything between curly braces, including nested ones
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const textToProcess = jsonMatch ? jsonMatch[0] : response;

      // Clean the JSON string by removing comments
      const cleanedJson = textToProcess
        .replace(/\/\/ [^\n]*\n/g, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

      // Parse the cleaned JSON
      const parsed = JSON.parse(cleanedJson);
      return parsed as T;
    } catch (error: any) {
      console.error('AI Response parsing error:', {
        originalResponse: response,
        error: error.message
      });
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }

}

export const perplexityService = new PerplexityService();
