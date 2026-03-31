export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getCompanyDisplayMeta(value: {
  websiteUrl?: string | null;
  domain?: string | null;
}): string {
  return value.websiteUrl ?? value.domain ?? "—";
}
