import { BookData } from '../types/book';

export function transformBookData(book: BookData, url: string) {
  const {
    key,
    title,
    subtitle,
    publish_date,
    by_statement,
    number_of_pages,
    isbn_13,
    openlibrary,
    publishers,
    authors,
    subjects,
    excerpts,
    cover,
    info_url,
    preview,
    preview_url,
    thumbnail_url,
    works,
    physical_format,
    copyright_date,
    contributors,
    first_sentence
  } = book;

  return {
    title,
    subtitle,
    publishDate: publish_date,
    url,
    key,
    by_statement,
    number_of_pages,
    isbn_13,
    openlibrary,
    publishers: publishers?.map(p => ({ name: p.name,  number_of_pages: p.number_of_pages ?? null })),
    authors: authors?.map(a => ({ name: a.name, verified: false })),
    subjects: subjects?.map(s => ({ name: s.name, url: s.url })),
    excerpts,
    cover,
    info_url,
    preview,
    preview_url,
    thumbnail_url,
    works,
    physical_format,
    copyright_date,
    contributors,
    first_sentence: typeof first_sentence === 'string'
      ? first_sentence
      : (first_sentence as any)?.value
  };
}
