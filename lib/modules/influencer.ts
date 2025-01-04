import { AIAnalysisResponse, AIProduct, Influencer, InfluencerTableRow, InfluencerWithClaims, Product } from "../types";
import { supabase } from "../supabase";
import { claimsService } from "./claims";

export class InfluencerService {
  public async createRecord(data: AIAnalysisResponse) {
    const { data: influencer, error } = await supabase
      .from("influencers")
      .insert({
        name: data.influencer.name,
        description: data.influencer.description,
        trust_score: data.scientificAccuracy.score,
        claim_count: data.healthClaims.length,
        verified_claims: data.healthClaims.filter(c => c.validity === "Verified").length,
        questionable_claims: data.healthClaims.filter(c => c.validity === "Questionable").length,
        debunked_claims: data.healthClaims.filter(c => c.validity === "Debunked").length
      })
      .select()
      .single();
    if (error) throw error;
    await this.createProduct(data.productAnalysis, influencer.id);
    return influencer;
  }


  public mapToTableRow(influencer: Influencer) {
    return {
      id: influencer.id,
      name: influencer.name,
      category: 'Health',
      score: influencer.trust_score,
      trend: this.calculateTrend(influencer),
      verified_claims: influencer.verified_claims,
    };
  }

  private calculateTrend(influencer: Influencer): 'up' | 'down' {
    const verifiedRatio = influencer.verified_claims / influencer.claim_count;
    return verifiedRatio > 0.5 ? 'up' : 'down';
  }

  public async createProduct(products: AIProduct[], influencerId: string) {
    const productRecords = products.map((product) => ({
      name: product.product,
      description: product.claims,
      revenue: String(product.revenue),
      influencer_id: influencerId,
    }));
    const { data, error } = await supabase
      .from('product')
      .insert(productRecords)
      .select()

    if (error) throw error;
    return data;
  }

  public async getProductsByInfluencerId(influencerId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('product')
      .select('*')
      .eq('influencer_id', influencerId);
    if (error) throw error;
    return data;
  }

  public async getById(id: string): Promise<InfluencerWithClaims> {
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', id)
      .single();
    const claims = await claimsService.getByInfluencerId(id);
    const products = await this.getProductsByInfluencerId(id);
    if (error) throw error;
    return { ...data, claims, products } as InfluencerWithClaims;
  }
}


export const influencerService = new InfluencerService();
