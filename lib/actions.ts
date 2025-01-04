"use server";
import { revalidatePath } from 'next/cache';
import { ResearchConfig, researchService } from './modules/research';
import { influencerService } from './modules/influencer';
import { claimsService } from './modules/claims';

export async function createResearchConfigMutation(prevState: any, formData: FormData) {
  try {
      // Parse and prepare the research configuration
    const data: ResearchConfig = {
      influencer_name: formData.get("influencer_name") as string,
      time_range: formData.get("time_range") as string,
      selected_journals: formData.getAll("selected_journals") as string[],
      notes: formData.get("notes") as string,
    };

    await researchService.analyzeInfluencer(data);
    revalidatePath("/dashboard");
    return { 
      message: "Research configuration and analysis completed successfully!", 
    };
  } catch (error) {
    console.error("Error during analysis:", error);
    return { 
      message: "Error during analysis", 
      error: (error as Error).message 
    };
  }
}



export async function fetchInfluencerByIdQuery(id: string) {
  try {
    return await influencerService.getById(id);
  } catch (error) {
    console.error("Error fetching influencer by id:", error);
    throw error;
  }
}

export async function fetchResearchByIdQuery(id: string) {
  try {
    return await researchService.getResearchById(id);
  } catch (error) {
    console.error("Error fetching research by id:", error);
    throw error;
  }
}

export async function fetchAllResearchQuery() {
  try {
    return await researchService.getAll();
  } catch (error) {
    console.error("Error fetching all research:", error);
    throw error;
  }
}

export async function fetchClaimsByJournalQuery(journal: string, influencerId: string) {
  try {
    return await claimsService.getClaimsByJournal(journal, influencerId);
  } catch (error) {
    console.error("Error fetching claims by journal:", error);
    throw error;
  }
}