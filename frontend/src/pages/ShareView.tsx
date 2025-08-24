import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import BrainCard from "../components/BrainCard";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import {
  ContentFilterProvider,
  useContentFilter,
} from "../hooks/useContentFilter";

type SharedData = { user: string; content: any[] };

export default function ShareView() {
  const { hash } = useParams();
  const [data, setData] = useState<SharedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/link/${hash}`);
        setData(res.data);
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, [hash]);

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6">
        <div className="text-red-400 text-center">{error}</div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader />
      </div>
    );

  return <ShareViewUI data={data} />;
}

function ShareViewUI({ data }: { data: SharedData }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-secondary">
      <div className="relative">
        <ContentFilterProvider>
          <Sidebar />
          <main className="max-w-7xl mx-auto px-6 py-8 md:py-10 ml-32">
            <Header user={data.user} />
            <ContentGrid items={data.content} />
          </main>
        </ContentFilterProvider>
      </div>
    </div>
  );
}

function Header({ user }: { user: string }) {
  const [query, setQuery] = useState("");
  return (
    <section className="mb-8">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-500/20 border border-white/10 p-6 md:p-7 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {user}'s Shared Brain
            </h1>
            <p className="text-white/70 mt-1">
              A public snapshot of saved knowledge
            </p>
          </div>
          <div className="w-full md:w-[420px]">
            <SearchInput value={query} onChange={setQuery} />
          </div>
        </div>
      </div>
      {/* Provide query to grid via global custom event to avoid prop drilling */}
      <QueryBridge value={query} />
    </section>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative group">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search in this shared brain..."
        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400/60 backdrop-blur-sm transition"
      />
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5 15.5L20 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="11"
            cy="11"
            r="6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

// Lightweight bridge to broadcast query changes without prop drilling
function QueryBridge({ value }: { value: string }) {
  useEffect(() => {
    const event = new CustomEvent("shareview:query", { detail: value });
    window.dispatchEvent(event);
  }, [value]);
  return null;
}

function ContentGrid({ items }: { items: any[] }) {
  const { selectedCategory } = useContentFilter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: any) => setQuery(e.detail ?? "");
    window.addEventListener("shareview:query", handler);
    return () => window.removeEventListener("shareview:query", handler);
  }, []);

  const q = query.trim().toLowerCase();
  const byCategory =
    selectedCategory === "all"
      ? items
      : items.filter((it) => it.type === selectedCategory);
  const filtered = q
    ? byCategory.filter((it) => {
        const title = (it.title ?? "").toLowerCase();
        const desc = (it.description ?? "").toLowerCase();
        const link = (it.link ?? "").toLowerCase();
        return title.includes(q) || desc.includes(q) || link.includes(q);
      })
    : byCategory;

  return (
    <section>
      {filtered.length === 0 ? (
        <div className="w-full text-center text-white/60 py-10">
          No items match your filters
        </div>
      ) : (
        <div className="[column-fill:_balance] columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:[columns:350px]">
          {filtered.map((item) => (
            <div key={item._id} className="break-inside-avoid mb-4">
              <BrainCard
                id={item._id}
                link={item.link}
                title={item.title}
                type={item.type}
                description={item.description}
                readOnly
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
