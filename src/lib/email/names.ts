export function firstNameFrom(name: string) {
  const part = name.trim().split(/\s+/).find(Boolean);
  return part || name.trim();
}
