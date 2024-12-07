import { FeedItem } from '../models';

/**
 * Filters jobs based on a search query and filter conditions.
 * @param jobs The list of jobs to filter.
 * @param searchQuery The query to search within job fields.
 * @param filters An object containing filters to apply on job attributes.
 * @returns The filtered list of jobs.
 */
export function filterJobs(
  jobs: FeedItem[],
  searchQuery: string,
  filters: Record<string, string | null>
): FeedItem[] {
  const searchQueryLower = searchQuery.toLowerCase();

  return jobs.filter(job => {
    // Search in multiple fields
    const matchesSearchQuery = ['title', 'businessName', 'municipal'].some(field => {
      const value = (job[field as keyof FeedItem] || '').toString().toLowerCase();
      return value.includes(searchQueryLower);
    });

    // Apply additional filters
    let matchesFilters = true;
    for (const [key, value] of Object.entries(filters)) {
      if (value !== null && key in job) {
        matchesFilters = matchesFilters && job[key as keyof FeedItem] === value;
      }
    }

    return matchesSearchQuery && matchesFilters;
  });
}
