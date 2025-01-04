"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function JournalTabs(props: { journals: string[], activeJournal: string }) {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <>
            <div className="tabs-container">
                <div
                    onClick={() => {
                        router.push(`${pathname}`, { scroll: false });
                    }}
                    className={`tab ${decodeURIComponent(props.activeJournal) === 'default' ? 'active' : ''}`}
                >
                    Default
                </div>
                {props.journals.map((journal) => (
                    <div
                        onClick={() => {
                            router.push(`${pathname}?tab=${journal}`, { scroll: false });
                        }}
                        key={journal}
                        className={`tab ${decodeURIComponent(props.activeJournal) === journal ? 'active' : ''}`}
                    >
                        {journal}
                    </div>
                ))}
            </div>

            <style jsx>{`
                .tabs-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 1.5rem;
                    padding: 1rem;
                }

                .tab {
                    min-width: 160px;
                    padding: 1rem 2rem;
                    border-radius: 1rem;
                    cursor: pointer;
                    text-align: center;
                    font-size: 1rem;
                    font-weight: 500;
                    border: 2px solid #2a2a2a;
                    background: #1a1a1a;
                    color: #888;
                    transition: all 0.2s ease;
                }

                .tab:hover {
                    transform: scale(1.05);
                    background: #222;
                    border-color: #333;
                    color: #aaa;
                }

                .tab.active {
                    background: #222;
                    border-color: #444;
                    color: white;
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </>
    )
}
