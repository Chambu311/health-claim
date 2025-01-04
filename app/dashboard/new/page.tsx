'use client'

import { Loader } from '@/components/loader'
import { createResearchConfigMutation } from '@/lib/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { toast } from 'sonner'

const journals = [
  'The New England Journal of Medicine',
  'The Lancet',
  'JAMA',
  'Nature Medicine',
  'BMJ',
  'Annals of Internal Medicine',
  'PLOS Medicine',
  'Mayo Clinic Proceedings'
]

export default function ResearchConfiguration() {
  const [state, formAction, isPending] = useActionState(createResearchConfigMutation, null)
  const router = useRouter()
  useEffect(() => {
    if (state?.message) {
      toast.info(state?.message)
      if (state.message.includes("completed successfully")) {
        router.push(`/dashboard`)
      }
    }
  }, [state]);

  if (isPending) {
    return <Loader />
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 mb-4">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-semibold">Research Tasks</h1>
          </div>

          <form action={formAction} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-6">Research Configuration</h2>

              {/* Specific Influencer */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Specific Influencer</h3>
                <div className="relative">
                  <input
                    name="influencer_name"
                    type="text"
                    required
                    placeholder="Enter influencer name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Time Range and Products Per Influencer */}
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Time Range</h3>
                  <select
                    name="time_range"
                    required
                    defaultValue="Last Month"
                    className="w-full select select-bordered bg-gray-700 border border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Last Week</option>
                    <option>Last Month</option>
                    <option>Last Year</option>
                    <option>All Time</option>
                  </select>
                </div>
              </div>

              {/* Scientific Journals */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Scientific Journals</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {journals.map((journal) => (
                    <div
                      key={journal}
                      className="flex items-center justify-between p-3 rounded-md bg-gray-700 border border-gray-600"
                    >
                      <span className="text-sm">{journal}</span>
                      <input
                        type="checkbox"
                        name="selected_journals"
                        value={journal}
                        className="toggle toggle-primary" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Notes for Research Assistant</h3>
                <textarea
                  name="notes"
                  placeholder="Add any specific instructions or focus areas..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
                >
                  {isPending ? 'Submitting...' : 'Start Research'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  )
}

