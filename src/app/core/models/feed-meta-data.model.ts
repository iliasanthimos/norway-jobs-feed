import { FeedItem } from './feed-page.model';

export interface FeedMetadata {
  feedId: string;
  etag: string;
  lastModified: string;
  nextID: string;
  jobs: FeedItem[];
}
