import type { Author, Banner, BookCollection, BookSummary, Category } from '../types';

// Dados temporários: têm o mesmo formato da API, então basta desligar VITE_USE_MOCKS.

export const mockCategories: Category[] = ['Literatura', 'Filosofia', 'Poesia', 'História'].map((name, i) => ({
  id: `cat-${i}`,
  name,
  slug: name.toLowerCase(),
}));

export const mockAuthors: Author[] = [
  'Machado de Assis',
  'Aluísio Azevedo',
  'José de Alencar',
  'Franz Kafka',
  'Fiódor Dostoiévski',
  'Marco Aurélio',
  'Platão',
  'Friedrich Nietzsche',
  'Nicolau Maquiavel',
  'Sun Tzu',
  'Fernando Pessoa',
].map((name, i) => ({ id: `author-${i}`, name, slug: name.toLowerCase() }));

export const mockCollections: BookCollection[] = [
  'Clássicos da Literatura Brasileira',
  'Clássicos Universais',
  'Clássicos da Filosofia',
  'Clássicos da Literatura Portuguesa',
].map((name, i) => ({ id: `collection-${i}`, name, slug: name.toLowerCase() }));

const cat = (name: string) => mockCategories.find((c) => c.name === name)!.id;
const author = (name: string) => mockAuthors.find((a) => a.name === name)!.id;
const collection = (name: string) => mockCollections.find((c) => c.name === name)!.id;
const cover = (slug: string) => `/covers/${slug}.svg`;

function book(
  slug: string,
  title: string,
  authorName: string,
  categoryName: string,
  collectionName: string | null,
  price: number,
  originalPrice: number | null,
  o: Partial<BookSummary> = {},
): BookSummary {
  return {
    id: `mock-${slug}`,
    title,
    slug,
    coverUrl: cover(slug),
    price,
    originalPrice,
    discountPercent: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
    available: true,
    release: false,
    authors: [authorName],
    averageRating: 0,
    reviewCount: 0,
    categoryId: cat(categoryName),
    authorIds: [author(authorName)],
    collectionId: collectionName ? collection(collectionName) : undefined,
    ...o,
  };
}

export const mockBooks: BookSummary[] = [
  book('dom-casmurro', 'Dom Casmurro', 'Machado de Assis', 'Literatura', 'Clássicos da Literatura Brasileira', 39.9, 49.9, { release: true, averageRating: 4.8, reviewCount: 320 }),
  book('memorias-postumas-de-bras-cubas', 'Memórias Póstumas de Brás Cubas', 'Machado de Assis', 'Literatura', 'Clássicos da Literatura Brasileira', 42.9, null, { release: true, averageRating: 4.6, reviewCount: 210 }),
  book('o-alienista', 'O Alienista', 'Machado de Assis', 'Literatura', 'Clássicos da Literatura Brasileira', 24.9, 29.9, { averageRating: 4.5, reviewCount: 150 }),
  book('o-cortico', 'O Cortiço', 'Aluísio Azevedo', 'Literatura', 'Clássicos da Literatura Brasileira', 32.9, null, { averageRating: 4.2, reviewCount: 90 }),
  book('iracema', 'Iracema', 'José de Alencar', 'Literatura', 'Clássicos da Literatura Brasileira', 27.9, null, { release: true, averageRating: 4.0, reviewCount: 60 }),
  book('a-metamorfose', 'A Metamorfose', 'Franz Kafka', 'Literatura', 'Clássicos Universais', 29.9, null, { available: false, release: true, averageRating: 4.4, reviewCount: 180 }),
  book('crime-e-castigo', 'Crime e Castigo', 'Fiódor Dostoiévski', 'Literatura', 'Clássicos Universais', 64.9, 79.9, { release: true, averageRating: 4.7, reviewCount: 140 }),
  book('meditacoes', 'Meditações', 'Marco Aurélio', 'Filosofia', 'Clássicos da Filosofia', 54.9, null, { release: true, averageRating: 4.9, reviewCount: 400 }),
  book('a-republica', 'A República', 'Platão', 'Filosofia', 'Clássicos da Filosofia', 59.9, null, { averageRating: 4.5, reviewCount: 130 }),
  book('assim-falou-zaratustra', 'Assim Falou Zaratustra', 'Friedrich Nietzsche', 'Filosofia', 'Clássicos da Filosofia', 49.9, 62.9, { averageRating: 4.3, reviewCount: 110 }),
  book('o-principe', 'O Príncipe', 'Nicolau Maquiavel', 'História', null, 34.9, null, { averageRating: 4.1, reviewCount: 170 }),
  book('a-arte-da-guerra', 'A Arte da Guerra', 'Sun Tzu', 'História', null, 26.9, null, { release: true, averageRating: 4.6, reviewCount: 260 }),
  book('poemas-escolhidos', 'Poemas Escolhidos', 'Fernando Pessoa', 'Poesia', 'Clássicos da Literatura Portuguesa', 37.9, null, { release: true, averageRating: 4.8, reviewCount: 75 }),
];

export const mockBanners: Banner[] = [
  { id: 'bn-1', title: 'Otium: tempo para ler', subtitle: 'Sua próxima leitura está a um clique', imageUrl: null, linkUrl: '/livros' },
  { id: 'bn-2', title: 'Lançamentos da semana', subtitle: 'Descubra o que acabou de chegar', imageUrl: null, linkUrl: '/livros?lancamentos=true' },
  { id: 'bn-3', title: 'Clássicos em destaque', subtitle: 'Machado, Kafka, Pessoa e mais', imageUrl: null, linkUrl: '/livros' },
];
