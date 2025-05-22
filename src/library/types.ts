export type JobItem = {
  id: number;
  badgeLetters: string;
  title: string;
  company: string;
  date: string;
  relevanceScore: number;
  daysAgo: number;
};

export type JobItemExpanded = JobItem & {
  description: string;
  qualifications: string[];
  reviews: string[];
  duration: number;
  location: string;
  salary: number;
  coverImgURL: string;
  companyURL: string;
};

export type SortBy = 'relevant' | 'recent';

export type PageDirection = 'next' | 'previous';
