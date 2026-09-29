import { BannerCarousel } from '../components/banner/BannerCarousel';
import { BookSection } from '../components/books/BookSection';

export function Home() {
  return (
    <>
      <BannerCarousel />
      <BookSection
        title="Últimos lançamentos"
        query={{ release: true, sort: 'newest', size: 8 }}
        viewAllTo="/livros?lancamentos=true"
      />
      {/* Próximas seções (mais vendidos, ofertas, recomendados) entram aqui como novos <BookSection /> */}
    </>
  );
}
