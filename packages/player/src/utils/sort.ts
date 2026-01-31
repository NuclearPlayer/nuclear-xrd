export const sortByAddedAtDesc = <T extends { addedAtIso: string }>(
  items: T[],
): T[] => [...items].sort((a, b) => b.addedAtIso.localeCompare(a.addedAtIso));
