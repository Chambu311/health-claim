import { Loader } from "@/components/loader";
import { fetchAllResearchQuery } from "@/lib/actions";
import { InfluencerTableRow, ResearchWithInfluencer } from "@/lib/types";
import Link from "next/link";
import { Suspense } from "react";

async function InfluencerLeaderboardContent() {
  const research = await fetchAllResearchQuery();
  
  // Sort research by influencer trust score (highest first)
  const sortedResearch = research
    .filter(r => r.influencer)
    .sort((a, b) => (b.influencer?.score || 0) - (a.influencer?.score || 0));
  
  const validResearch = sortedResearch.filter(r => r.influencer?.score != null);
  const averageScore = validResearch.length > 0
    ? validResearch.reduce((acc, r) => acc + (r.influencer?.score || 0), 0) / validResearch.length
    : 0;
  
  const totalVerifiedClaims = sortedResearch.reduce((acc, r) => acc + (r.influencer?.verified_claims || 0), 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold">Influencer Trust Leaderboard</h1>
          <a
            href="/dashboard/new"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Research
          </a>
        </div>

        <p className="text-sm text-gray-400 mb-8">Real-time rankings of health influencers based on scientific accuracy, credibility, and transparency. Updated daily using AI-powered analysis.</p>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <div className="p-2 bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalVerifiedClaims}</div>
              <div className="text-sm text-gray-400">Total verified claims</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <div className="p-2 bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">{isNaN(averageScore) ? 0 : Number(averageScore).toFixed(2)}%</div>
              <div className="text-sm text-gray-400">Average trust score</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                <th className="p-4 font-medium">#</th>
                <th className="p-4 font-medium">INFLUENCER</th>
                <th className="p-4 font-medium">CATEGORY</th>
                <th className="p-4 font-medium">TRUST SCORE</th>
                <th className="p-4 font-medium">TREND</th>
                <th className="p-4 font-medium">VERIFIED CLAIMS</th>
              </tr>
            </thead>
            <tbody>
              {sortedResearch.map((row: ResearchWithInfluencer<InfluencerTableRow>, index) => (
                <tr key={row.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <Link href={`/dashboard/research/${row.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                      <span>{row.influencer?.name}</span>
                    </Link>
                  </td>
                  <td className="p-4">{row.influencer?.category}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-emerald-500 rounded-full"></div>
                      {row.influencer?.score}%
                    </div>
                  </td>
                  <td className="p-4">
                    <svg className={`w-4 h-4 ${row.influencer?.trend === 'up' ? 'text-emerald-500 rotate-0' : 'text-red-500 rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </td>
                  <td className="p-4">{row.influencer?.verified_claims}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


export default function InfluencerLeaderboard() {
  return (
    <Suspense fallback={<Loader />}>
      <InfluencerLeaderboardContent />
    </Suspense>
  )
}