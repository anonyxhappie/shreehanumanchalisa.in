import { ArrowLeft, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { temples, templesReferenceUrl } from "@/lib/constants";

export default function Temples() {
  return (
    <main className="min-h-screen bg-[#f4efe5] text-[#182c3c]">
      <header className="border-b border-[#d9cbb8]/70 bg-[#f8f4eb]/90 px-5 py-5 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#52656b] hover:text-[#a94725]"><ArrowLeft className="h-4 w-4" /> Back to the Chalisa</Link>
          <span className="font-serif text-lg font-bold text-[#263d4d]">पवित्र धाम</span>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-3 text-[#b45a31]"><Sparkles className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-[0.28em]">A living tradition</span></div>
          <h1 className="font-serif text-5xl font-semibold tracking-[-0.04em] text-[#243b49] sm:text-7xl">Temples of <em className="font-normal text-[#b45a31]">devotion.</em></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#687577]">A growing directory of places where Hanuman bhakti is lived through service, song, and daily prayer.</p>
          <a href={templesReferenceUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d96b2b] px-5 py-3 text-sm font-bold text-[#fffaf1] shadow-[0_8px_25px_rgba(217,107,43,0.22)] hover:bg-[#e27b3a]">Explore the full Divine India temple guide <ExternalLink className="h-4 w-4" /></a>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {temples.map((temple) => <article key={temple.name} className="rounded-[1.5rem] border border-[#d8c7b4] bg-[#fffaf1]/75 p-6 shadow-[0_18px_50px_rgba(87,53,30,0.06)]"><MapPin className="h-5 w-5 text-[#d96b2b]" /><h2 className="mt-5 font-serif text-2xl font-semibold text-[#294454]">{temple.name}</h2><p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-[#b45a31]">{temple.city}, {temple.state}</p><p className="mt-4 text-sm leading-7 text-[#687577]">{temple.description}</p></article>)}
        </div>
      </section>
      <footer className="border-t border-[#d9cbb8] bg-[#f8f4eb] px-5 py-8 text-center text-xs text-[#7f8580]">श्री हनुमते नमः · May every journey lead inward.</footer>
    </main>
  );
}
