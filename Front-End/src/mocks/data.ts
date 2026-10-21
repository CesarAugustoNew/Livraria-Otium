import type { Author, Banner, BookCollection, BookDetail, BookSummary, Category } from '../types';

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

/** Textos usados só na página de detalhe (a listagem/catálogo não precisa deles). */
const mockDescriptions: Record<string, string> = {
  'dom-casmurro': 'Bento Santiago revisita a juventude e a dúvida sobre Capitu: teria ela traído sua confiança com o melhor amigo? Um dos maiores romances da literatura brasileira, narrado por um narrador que talvez não mereça toda a nossa confiança.',
  'memorias-postumas-de-bras-cubas': 'O defunto-autor narra a própria vida com ironia, escrevendo suas memórias já morto, livre das amarras que prendem os vivos. Um marco do realismo brasileiro, cheio de digressões e humor ácido.',
  'o-alienista': 'Em Itaguaí, o Dr. Bacamarte decide internar meio mundo em nome da ciência, numa sátira afiadíssima sobre poder, loucura e os limites da razão.',
  'o-cortico': 'A vida num cortiço carioca do século XIX, retrato naturalista das tensões sociais, do desejo e da sobrevivência numa comunidade fervilhante.',
  'iracema': 'Lenda do Ceará, romance fundador do indianismo brasileiro: o amor impossível entre a índia Iracema e o colonizador Martim.',
  'a-metamorfose': 'Gregor Samsa acorda transformado em um inseto monstruoso, e sua família precisa lidar com o impacto disso em suas vidas. Uma das narrativas mais perturbadoras e influentes do século XX.',
  'crime-e-castigo': 'Raskólnikov comete um assassinato que acredita justificado — e passa o resto do livro pagando por isso, mesmo antes de qualquer punição oficial chegar.',
  'meditacoes': 'Anotações pessoais de um imperador sobre virtude, disciplina e serenidade diante do que não podemos controlar. Um clássico atemporal do estoicismo.',
  'a-republica': 'Diálogo sobre a justiça e a cidade ideal, um dos textos fundadores da filosofia política ocidental.',
  'assim-falou-zaratustra': 'Um livro para todos e para ninguém: Zaratustra desce da montanha para anunciar o super-homem e a morte de antigos valores.',
  'o-principe': 'Tratado sobre a conquista e a manutenção do poder, tão estudado quanto controverso desde sua publicação.',
  'a-arte-da-guerra': 'Estratégia, disciplina e o valor de vencer sem lutar: princípios que atravessaram séculos e hoje se aplicam muito além dos campos de batalha.',
  'poemas-escolhidos': 'Seleção de poemas de Fernando Pessoa e de seus heterônimos, vozes múltiplas de um só poeta.',
};

/** Deriva os dados completos de detalhe a partir do resumo — só para a demonstração sem backend. */
function toDetail(b: BookSummary): BookDetail {
  const category = mockCategories.find((c) => c.id === b.categoryId)!;
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    isbn: `OTM${String(mockBooks.indexOf(b) + 1).padStart(5, '0')}`,
    description: mockDescriptions[b.slug] ?? null,
    coverUrl: b.coverUrl,
    price: b.price,
    originalPrice: b.originalPrice,
    discountPercent: b.discountPercent,
    stockQuantity: b.available ? 12 : 0,
    available: b.available,
    release: b.release,
    pages: 180 + (b.title.length % 5) * 30,
    publisher: 'Otium Clássicos',
    publishedAt: null,
    language: 'Português',
    edition: 1,
    dimensions: '13.7 x 21.0 x 1.3 cm',
    summary: ['Prefácio', 'Introdução', `Capítulo 1 – ${b.title}`, 'Capítulo 2 – Desenvolvimento', 'Considerações finais'],
    category,
    authors: b.authors,
    averageRating: b.averageRating,
    reviewCount: b.reviewCount,
  };
}

export const mockBookDetails: Record<string, BookDetail> = Object.fromEntries(
  mockBooks.map((b) => [b.id, toDetail(b)]),
);

export const mockBanners: Banner[] = [
  { id: 'bn-1', title: 'Otium: tempo para ler', subtitle: 'Sua próxima leitura está a um clique', imageUrl: null, linkUrl: '/livros' },
  { id: 'bn-2', title: 'Lançamentos da semana', subtitle: 'Descubra o que acabou de chegar', imageUrl: null, linkUrl: '/livros?lancamentos=true' },
  { id: 'bn-3', title: 'Clássicos em destaque', subtitle: 'Machado, Kafka, Pessoa e mais', imageUrl: null, linkUrl: '/livros' },
];
