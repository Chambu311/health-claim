

export type Research = {
  id: string; // UUID
  influencer_id: string; // Foreign key to `influencers`
  influencer_name: string;
  journals: string; // JSON array of journal names
  created_at: Date;
  updated_at: Date;
}

export type Claim = {
  id: string; // UUID
  influencer_id: string; // Foreign key to `influencers`
  text: string;
  category: string// Enum
  verification_status: "Verified" | "Questionable" | "Debunked"; // Enum
  confidence_score: number | null; // Nullable
  source_url: string | null; // Nullable
  created_at: Date;
  evidence: string // Nullable
  updated_at: Date;
};

export type Product = {
  id: string; // UUID
  name: string;
  description: string;
  revenue: string;
  influencer_id: string;
};

export type Influencer = {
  id: string; // UUID
  name: string;
  description: string;
  trust_score: number;
  claim_count: number;
  verified_claims: number;
  questionable_claims: number;
  debunked_claims: number;
  created_at: Date;
  updated_at: Date;
};

export type InfluencerWithClaims = Influencer & {
  claims: Claim[];
  products: Product[];
};

export type ResearchWithInfluencer<T> = Research & {
  influencer: T;
};

export type JournalClaim = {
  id: string;
  claim_id: string;
  journal: string;
  description: string;
  evidence: string;
  created_at: Date;
}

export type ClaimWithJournal = Claim & {
  journal_check: JournalClaim[];
}

export interface InfluencerTableRow {
  id: string;
  rank: number;
  name: string;
  category: string;
  score: number;
  trend: 'up' | 'down';
  verified_claims: number;
}


export type AIHealthClaim = {
  claim: string;
  validity: "Verified" | "Questionable" | "Debunked";
  evidence: string;
  category: string;
};

export type AIProduct = {
  product: string;
  claims: string;
  revenue: number;
};

export type AIScientificAccuracy = {
  score: number;
  explanation: string;
};

export type AIInfluencerInfo = {
  name: string;
  description: string;
  followers: string;
};

export type AIAnalysisResponse = {
  healthClaims: AIHealthClaim[];
  productAnalysis: AIProduct[];
  scientificAccuracy: AIScientificAccuracy;
  influencer: AIInfluencerInfo;
};

export type JournalVerification = {
  claim_id: string;
  claim_text: string;
  verification_status: "Verified" | "Questionable" | "Debunked";
  evidence: string;
  journal_name: string;
}