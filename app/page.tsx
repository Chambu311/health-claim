import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        Augusto Chambouleyron
      </h1>
      <Link
        href="/dashboard"
        className="px-8 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90 transition-opacity"
      >
        Medical Research Assistant →
      </Link>
    </div>
  );
}
