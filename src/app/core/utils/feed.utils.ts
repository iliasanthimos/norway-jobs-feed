import { FeedMetadata } from '../models';

/**
 * Chunks an array of items into smaller arrays based on the page size.
 * @param array The array to chunk.
 * @param pageSize The number of items per chunk.
 * @returns A 2D array where each sub-array is a chunk of the original array.
 */
export function chunkArray<T>(array: T[], pageSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += pageSize) {
    chunks.push(array.slice(i, i + pageSize));
  }
  return chunks;
}

/**
 * Calculates the overall page start by summing the number of pages in a map of FeedMetadata.
 * @param feedIdMap The map containing FeedMetadata.
 * @returns The total number of pages across all feeds.
 */
export function calculateOverallPageStart(feedIdMap: Map<string, FeedMetadata>): number {
  return Array.from(feedIdMap.values()).reduce(
    (total, feed) => total + Object.keys(feed.pageIndexMap).length,
    0
  );
}
