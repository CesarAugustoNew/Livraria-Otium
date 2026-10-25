import { BannerCarousel } from '../components/banner/BannerCarousel';
import { BookSection } from '../components/books/BookSection';

export function Home() {
  return (
    <>
      <BannerCarousel />
      <BookSection
        title="Últimos lançamentos"
        query={{ release: true, sort: 'newest', size: 8 }}
        // a vitrine já mostra todos os lançamentos; "Ver todos" abre o catálogo completo
        viewAllTo="/livros"
      />
      {/* Próximas seções (mais vendidos, ofertas, recomendados) entram aqui como novos <BookSection /> */}
    </>
  );
}
