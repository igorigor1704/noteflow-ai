export type LibrarySortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "favorites"
  | "pinned";

export type LibraryFolder = {
  id: string;
  name: string;
};

export type LibraryAnalysis = {
  id: string;
  title: string;
  createdAt?: string;
  summary?: string[] | string;
  keywords?: string[];
  tags?: string[];
  folderId?: string | null;
  isPinned?: boolean;
  isFavorite?: boolean;
};

export const DEFAULT_FOLDERS: LibraryFolder[] = [
  { id: "all", name: "Wszystkie" },
  { id: "uncategorized", name: "Bez folderu" },
  { id: "finance", name: "Finanse" },
  { id: "economics", name: "Ekonomia" },
  { id: "banking", name: "Bankowość" },
  { id: "other", name: "Inne" },
];

export function normalizeSummary(summary?: string[] | string): string {
  if (Array.isArray(summary)) return summary.join(" ");
  if (typeof summary === "string") return summary;
  return "";
}

export function normalizeTags(item: LibraryAnalysis): string[] {
  const base = Array.isArray(item.tags) ? item.tags : [];
  const keywords = Array.isArray(item.keywords) ? item.keywords : [];
  return [...new Set([...base, ...keywords].filter(Boolean))];
}

export function matchesSearch(item: LibraryAnalysis, query: string): boolean {
  if (!query.trim()) return true;

  const q = query.trim().toLowerCase();
  const haystack = [
    item.title,
    normalizeSummary(item.summary),
    ...normalizeTags(item),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function matchesFolder(
  item: LibraryAnalysis,
  activeFolderId: string
): boolean {
  if (activeFolderId === "all") return true;
  if (activeFolderId === "uncategorized") return !item.folderId;
  return item.folderId === activeFolderId;
}

export function matchesTag(item: LibraryAnalysis, activeTag: string): boolean {
  if (activeTag === "all") return true;
  return normalizeTags(item).some(
    (tag) => tag.toLowerCase() === activeTag.toLowerCase()
  );
}

export function sortAnalyses(
  items: LibraryAnalysis[],
  sortBy: LibrarySortOption
): LibraryAnalysis[] {
  const copy = [...items];

  switch (sortBy) {
    case "oldest":
      return copy.sort((a, b) => {
        const ad = new Date(a.createdAt ?? 0).getTime();
        const bd = new Date(b.createdAt ?? 0).getTime();
        return ad - bd;
      });

    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));

    case "title-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));

    case "favorites":
      return copy.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));

    case "pinned":
      return copy.sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

    case "newest":
    default:
      return copy.sort((a, b) => {
        const ad = new Date(a.createdAt ?? 0).getTime();
        const bd = new Date(b.createdAt ?? 0).getTime();
        return bd - ad;
      });
  }
}

export function extractAllTags(items: LibraryAnalysis[]): string[] {
  return [...new Set(items.flatMap((item) => normalizeTags(item)))]
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)));
}

export function formatAnalysisDate(value?: string): string {
  if (!value) return "Brak daty";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Brak daty";

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}