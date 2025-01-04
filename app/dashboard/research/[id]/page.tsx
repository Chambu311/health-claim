import JournalTabs from "@/components/journal-tabs";
import { Loader } from "@/components/loader";
import { fetchClaimsByJournalQuery, fetchInfluencerByIdQuery, fetchResearchByIdQuery } from "@/lib/actions";
import { ClaimWithJournal } from "@/lib/types";
import { Suspense } from "react";

async function InfluencerPageContent(props: { id: string, tab: string }) {
  const { id, tab } = props;
  const research = await fetchResearchByIdQuery(id);
  const influencer = research?.influencer;
  const journals = research?.journals.split(",");
  const journalClaims = await fetchClaimsByJournalQuery(tab, influencer?.id);
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Dashboard Link */}
      <div className="mb-6">
        <a href="/dashboard" className="text-emerald-500 hover:underline text-sm flex items-center">
          ← Back to Dashboard
        </a>
      </div>

      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-12 bg-gray-800 p-6 rounded-lg">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
          <span>{influencer?.name[0]}</span>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-2">{influencer?.name}</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-4">{influencer?.description}</p>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-400">
              Trust Score: {influencer?.trust_score}%
            </span>
            <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-400">
              {influencer?.verified_claims} verified claims
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Trust Score"
          value={`${influencer?.trust_score}%`}
          subtitle={`${influencer?.verified_claims} verified claims`}
          valueColor="white"
        />
        <StatCard
          title="Products"
          value={influencer?.products?.length || 0}
          subtitle="Recommended items"
          valueColor="white"
        />
        <StatCard
          title="Claims"
          value={influencer?.claim_count || 0}
          subtitle="Total claims"
          valueColor="white"
        />
        <StatCard
          title="Verified Claims"
          value={influencer?.verified_claims || 0}
          subtitle="Verified claims"
          valueColor="white"
        />
      </div>

      {/* Journals Section */}
      {journals && journals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Research Journals</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <JournalTabs journals={journals} activeJournal={tab} />
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Claims</h2>
          <div className="space-y-4">
            {/* Show default claims when no journal is selected */}
            {tab === "default" && influencer?.claims.map((claim: any) => (
              <div key={claim.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                  <div className={`w-2 h-2 rounded-full ${claim.verification_status === 'Verified' ? 'bg-emerald-500' :
                    claim.verification_status === 'Questionable' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                  <span>{claim.verification_status}</span>
                </div>
                <p className="mb-3">{claim.text}</p>
                {claim.evidence && (
                  <p className="text-sm text-gray-400 p-3 bg-gray-700 rounded-md mb-3">{claim.evidence}</p>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">#{claim.category}</span>
                </div>
              </div>
            ))}

            {/* Journal claims */}
            {tab !== "default" && journalClaims?.map((claim: ClaimWithJournal) => (
              <div key={claim.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700/50 transition-colors flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                  <div className={`w-2 h-2 rounded-full ${claim.verification_status === 'Verified' ? 'bg-emerald-500' :
                    claim.verification_status === 'Questionable' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                  <span>{claim.verification_status}</span>
                </div>
                <p className="mb-3">{claim.text}</p>
                {claim.journal_check?.map((check) => (
                  <div key={check.claim_id} className="mb-3 flex flex-col gap-2">
                    <p className="text-sm text-gray-400 p-3 bg-gray-700 rounded-md">
                      <span className="block text-emerald-500 mb-2">Journal Evidence:</span>
                      {check.evidence}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Added on {new Date(check.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">#{claim.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="space-y-4">
            {influencer?.products?.map((product: any) => (
              <div key={product.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">{product.name}</h3>
                  <span className="text-emerald-500">${product.revenue}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{product.description}</p>
                {product.url && (
                  <a href={product.url} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-emerald-500 hover:underline">
                    View Product →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Update StatCard component
function StatCard({ title, value, subtitle, valueColor }: {
  title: string;
  value: string | number;
  subtitle: string;
  valueColor: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <div className={`text-2xl font-bold ${valueColor === 'white' ? 'text-white' : 'text-emerald-500'}`}>
        {value}
      </div>
      <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
    </div>
  );
}




export default async function InfluencerPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ tab: string }> }) {
  const id = (await params).id;
  const tab = (await searchParams).tab ?? "default";
  return (
    <Suspense fallback={<Loader />}>
      <InfluencerPageContent id={id} tab={tab} />
    </Suspense>
  )
}
