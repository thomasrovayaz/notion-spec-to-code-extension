export const urlToPageId = (url?: string) => {
  if (!url || !url.includes("notion.so")) {
    return null;
  }
  const paths = url.split("/");
  const pageSlug = paths[paths.length - 1];
  if (!pageSlug) {
    return null;
  }
  const pageSlugSplit = pageSlug.split("-");
  return pageSlugSplit[pageSlugSplit.length - 1];
};
