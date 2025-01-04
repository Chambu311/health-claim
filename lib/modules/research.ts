import { supabase } from "../supabase";
import {
  AIAnalysisResponse,
  Claim,
  InfluencerTableRow,
  InfluencerWithClaims,
  Research,
  ResearchWithInfluencer,
} from "../types";
import { influencerService } from "./influencer";
import { claimsService } from "./claims";
import { perplexityService } from "./perplexity";

export interface ResearchConfig {
  influencer_name: string;
  time_range: string;
  selected_journals?: string[];
  include_revenue_analysis: boolean;
  notes?: string;
}

export class ResearchService {
  private async createResearchRecord(
    config: ResearchConfig,
    influencerId: string
  ) {
    const researchRecord: Partial<Research> = {
      influencer_name: config.influencer_name,
      journals: config.selected_journals?.join(",") || "",
      influencer_id: influencerId,
    };
    const { data, error } = await supabase
      .from("research")
      .insert(researchRecord)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  public async analyzeInfluencer(config: ResearchConfig) {
    try {
      const messages = this.buildPromptMessages(config);
      const response = await perplexityService.sendPrompt(messages);
      const parsedResponse: AIAnalysisResponse =
        perplexityService.parseAiResponse<AIAnalysisResponse>(
          response.choices[0]?.message?.content || ""
        );
      const influencerCreated = await influencerService.createRecord(
        parsedResponse
      );
      await this.createResearchRecord(config, influencerCreated.id);
      const claims = await claimsService.createRecords(
        parsedResponse.healthClaims,
        influencerCreated.id
      );
      if (config.selected_journals && config.selected_journals.length > 0) {
        await claimsService.checkClaimWithJournal(
          claims,
          config.selected_journals?.join(",") || ""
        );
      }
    } catch (error: any) {
      throw new Error(`Error during analysis: ${error.message}`);
    }
  }

  public async getAll(): Promise<ResearchWithInfluencer<InfluencerTableRow>[]> {
    const { data, error } = await supabase.from("research").select("*");
    if (error) throw error;
    const researchWithInfluencer = await Promise.all(
      data.map(async (research) => {
        const influencer = await influencerService.getById(
          research.influencer_id
        );
        const mappedInfluencer = influencerService.mapToTableRow(influencer);
        return { ...research, influencer: mappedInfluencer };
      })
    );
    if (error) throw error;
    return researchWithInfluencer as unknown as ResearchWithInfluencer<InfluencerTableRow>[];
  }

  public async getResearchById(id: string) {
    const { data, error } = await supabase
      .from("research")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    const influencer = await influencerService.getById(data.influencer_id);
    return {
      ...data,
      influencer: influencer,
    } as ResearchWithInfluencer<InfluencerWithClaims>;
  }

  private buildPromptMessages(config: ResearchConfig) {
    return [
      {
        role: "system",
        content: `You are an expert at analyzing health and wellness content. You MUST respond with valid JSON only.
        
        Rules:
        1. Response must be valid JSON wrapped in \`\`\`json code blocks
        2. All fields in the schema are required
        3. Do not include any explanatory text outside the JSON
        4. Ensure all arrays have at least one item
        5. IMPORTANT: Each claim must have exactly ONE category - do not use | operators in categories
        6. IMPORTANT: The evidence field must be a string that contains the evidence for the claim. Dont include references or citations in the evidence field.
        
        Analyze content (social media posts, blog posts, etc.) and identify health claims made by this influencer and products they promote with the following parameters:
        - Time Range: ${config.time_range}
        ${
          config.include_revenue_analysis
            ? "- Include revenue analysis for promoted products"
            : ""
        }

        Response schema:
        {
          "healthClaims": [{ 
            "claim": "string",
            "category": "Nutrition" | "Medicine" | "Mental Health",
            "validity": "Verified" | "Questionable" | "Debunked",
            "evidence": "string"
          }],
          "productAnalysis": [{ 
            "product": "string", 
            "claims": "string", 
            "revenue": "number" 
          }],
          "scientificAccuracy": { 
            "score": number (0-100), 
            "explanation": "string" 
          },
          "influencer": { 
            "name": "string", 
            "description": "string", 
            "followers": "string" 
          }
        }
      `,
      },
      {
        role: "user",
        content: `Analyze health influencer: ${config.influencer_name} and fact check their health claims. You should decide whether the claims are verified, questionable, or debunked based on empirical evidence.
        
        Additional Context: ${config.notes || "None provided"}`,
      },
    ];
  }
}

export const researchService = new ResearchService();
