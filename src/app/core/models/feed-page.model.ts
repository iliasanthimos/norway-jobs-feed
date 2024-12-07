export interface FeedPage {
  version: string;
  title: string;
  home_page_url: string;
  feed_url: string;
  description: string;
  next_url: string;
  id: string;
  next_id: string;
  items: FeedItem[];
  etag: string;
  lastModified: string;
  nextID: string;
  modifiedSince?: string;
  isFirst: boolean;
  isLast?: boolean;
}

export interface FeedItem {
  id: string;
  url: string;
  title: string;
  content_text: string;
  date_modified: string;
  _feed_entry: FeedEntrySummary;
}

export interface FeedEntrySummary {
  uuid: string;
  status: 'ACTIVE' | 'INACTIVE';
  title: string;
  businessName: string;
  municipal: string;
  sistEndret: string;
}
