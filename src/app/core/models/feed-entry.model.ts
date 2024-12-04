export interface FeedEntry {
  uuid: string;
  json: FeedEntryDetails;
  sistEndret: string;
  status: string;
}

export interface FeedEntryDetails {
  uuid: string;
  published: string;
  expires: string;
  updated: string;
  workLocations: WorkLocation[];
  contactList: Contact[];
  title: string;
  description: string;
  sourceurl: string;
  source: string;
  applicationUrl: string;
  applicationDue: string;
  occupationCategories: OccupationCategory[];
  categoryList: Category[];
  jobtitle: string;
  link: string;
  employer: Employer;
  engagementtype: string;
  extent: string;
  starttime: string;
  positioncount: string;
  sector: string;
}

export interface WorkLocation {
  country: string;
  address: string;
  city: string;
  postalCode: string;
  county: string;
  municipal: string;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  role: string;
  title: string;
}

export interface OccupationCategory {
  level1: string;
  level2: string;
}

export interface Category {
  categoryType: string;
  code: string;
  name: string;
  score: number;
}

export interface Employer {
  name: string;
  orgnr: string;
  description: string;
  homepage: string;
}
