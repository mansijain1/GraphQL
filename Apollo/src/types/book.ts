export type BookData = {
  key?: string;
  title?: string;
  url?: string;
  subtitle?: string;
  by_statement?: string;
  number_of_pages?: number;
  publish_date?: string;
  publishers?: {
      number_of_pages: null; name: string 
}[];
  authors?: { name: string }[];
  isbn_13?: string[];
  openlibrary?: string[];
  subjects?: { name: string; url?: string }[];
  excerpts?: { text: string; comment?: string; first_sentence?: boolean }[];
  cover?: { small?: string; medium?: string; large?: string };
  info_url?: string;
  preview?: string;
  preview_url?: string;
  thumbnail_url?: string;
  works?: { key: string; title?: string }[];
  physical_format?: string;
  copyright_date?: string;
  contributors?: { role?: string; name?: string }[];
  first_sentence?: string | { value: string };
};

export type OpenLibraryResponse = {
  records: Record<string, { data: BookData; url: string }>;
};
