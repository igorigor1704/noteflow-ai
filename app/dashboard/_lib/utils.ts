function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayKey(): string {
  return formatLocalDate(new Date());
}

export function yesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatLocalDate(date);
}

export function parseTags(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ).slice(0, 8);
}

export function getLastDays(count: number) {
  return Array.from({ length: count }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    return formatLocalDate(date);
  });
}