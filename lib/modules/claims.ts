import { AIHealthClaim, Claim, ClaimWithJournal, JournalVerification } from "../types";
import { supabase } from "../supabase";
import { perplexityService } from "./perplexity";

const validCategories = ["Nutrition", "Mental Health", "Medicine"] as const;
export class ClaimsService {
  public async createRecords(
    claims: AIHealthClaim[],
    influencerId: string
  ): Promise<Claim[]> {
    const newClaims: Partial<Claim>[] = claims.map((claim: AIHealthClaim) => ({
      influencer_id: influencerId,
      text: claim.claim,
      category: validCategories.includes(claim.category as any)
        ? claim.category
        : "Medicine",
      verification_status: claim.validity,
      confidence_score: parseFloat(claim.evidence.match(/\d+/)?.[0] || "0"),
      evidence: claim.evidence,
    }));

    const { data, error } = await supabase
      .from("claims")
      .insert(newClaims)
      .select();

    if (error) throw error;
    return data;
  }

  public async fetchAllClaims(): Promise<Claim[]> {
    const { data, error } = await supabase.from("claims").select("*");

    if (error) throw error;
    return data;
  }

  public async getByInfluencerId(influencerId: string): Promise<Claim[]> {
    const { data, error } = await supabase
      .from("claims")
      .select("*")
      .eq("influencer_id", influencerId)
      .order("confidence_score", { ascending: false });

    if (error) throw error;
    return data;
  }


  public async saveJournalVerification(verifications: JournalVerification[], selectedJournals: string[]) {
    const mapped = verifications.map((verification) => ({
      claim_id: verification.claim_id,
      verification_status: verification.verification_status,
      evidence: verification.evidence,
      journal: selectedJournals.includes(verification.journal_name) ? verification.journal_name : "Unknown",
    }));
    const { data, error } = await supabase
      .from("journal_claim")
      .insert(mapped)
      .select();
    if (error) throw error;
    return data;
  }

  private buildPromptForJournalVerification(claims: Claim[], journals: string[]) {
    return [
      {
        role: "system",
        content: `You are a scientific fact checker. Analyze health claims using reputable medical journals. 
        
        Rules:
        1. Response must be valid JSON wrapped in \`\`\`json code blocks
        2. SUPER IMPORTANT: you must search information of the provided journals and verify the claims
        3. If evidence is not found in a specific journal, dont return it
        4. Provide specific evidence and citations
        5. Include confidence score (0-100)
        6. Keep responses concise and factual
        
        Required JSON format:
        {
          "verifications": [
            {
              "claim_id": "string",
              "claim_text": "string",
              "verification_status": "Verified" | "Questionable" | "Debunked",
              "evidence": "string",
              "journal_name": "string"
            }
          ]
        }`,
      },
      {
        role: "user",
        content: `Verify these health claims using the following medical journals (ONLY USE THESE JOURNALS):
        
        Journals: ${journals.join(", ")}

        Claims to verify:
        ${claims
          .map(
            (claim) => `ID: ${claim.id}
        Text: ${claim.text}
        Category: ${claim.category}
        `
          )
          .join("\n")}
        
        Please analyze each claim's validity based on the available scientific literature.`,
      },
    ];
  }

  public async getJournalClaimByClaimId(claimId: string, journal: string) {
    const { data, error } = await supabase
      .from("journal_claim")
      .select("*")
      .eq("claim_id", claimId)
      .eq("journal", journal);
    if (error) throw error;
    return data;
  }

  public async getClaimsByJournal(journal: string, influencerId: string) {
    const claims = await this.getByInfluencerId(influencerId);
    const mappedClaims: ClaimWithJournal[] = await Promise.all(
      claims.map(async (claim) => ({
        ...claim,
        journal_check: await this.getJournalClaimByClaimId(claim.id, journal),
      }))
    );
    
    // Filter claims that have journal checks
    const filteredClaims = mappedClaims.filter(claim => 
      claim.journal_check && claim.journal_check.length > 0
    );
    
    return filteredClaims;
  }

  public async createJournalVerification(journals: string[], influencerId: string) {
    const claims = await this.getByInfluencerId(influencerId);
    const prompt = this.buildPromptForJournalVerification(claims, journals);
    const response = await perplexityService.sendPrompt(prompt);
    const parsedResponse = perplexityService.parseAiResponse(response.choices[0]?.message?.content || "") as any;
    console.log(parsedResponse.verifications);
    await this.saveJournalVerification(parsedResponse.verifications, journals);
    return parsedResponse;
  }
}

export const claimsService = new ClaimsService();
