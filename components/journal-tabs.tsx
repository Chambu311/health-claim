"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function JournalTabs(props: { journals: string[], activeJournal: string }) {
    console.log(props.activeJournal === 'default')
    const router = useRouter();
    const pathname = usePathname();
    return (
        <div className="flex flex-wrap justify-center gap-6 p-4">
            <div
                onClick={() => {
                    router.push(`${pathname}`, { scroll: false });
                }}
                className={`min-w-[160px] px-8 py-4 rounded-2xl cursor-pointer text-center text-base font-medium border-2 border-zinc-800 bg-zinc-900 text-zinc-500 transition-all duration-200 hover:scale-105 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-400 ${
                    decodeURIComponent(props.activeJournal) === 'default' 
                    ? 'border-emerald-400 border-[1px] text-emerald-400' 
                    : ''
                }`}
            >
                Default
            </div>
            {props.journals.map((journal) => (
                <div
                    onClick={() => {
                        router.push(`${pathname}?tab=${journal}`, { scroll: false });
                    }}
                    key={journal}
                    className={`min-w-[160px] px-8 py-4 rounded-2xl cursor-pointer text-center text-base font-medium border-2 border-zinc-800 bg-zinc-900 text-zinc-500 transition-all duration-200 hover:scale-105 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-400 ${
                        decodeURIComponent(props.activeJournal) === journal 
                        ? 'border-emerald-400 border-[1px] text-emerald-400' 
                        : ''
                    }`}
                >
                    {journal}
                </div>
            ))}
        </div>
    )
}
