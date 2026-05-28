export function trimAllStrings(obj: any) {
  const trimmed = {} as any;
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      trimmed[key] = obj[key].trim();
    } else {
      trimmed[key] = obj[key];
    }
  }
  return trimmed;
}
