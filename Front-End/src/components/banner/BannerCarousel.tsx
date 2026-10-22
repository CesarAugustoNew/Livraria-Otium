import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react';
import { Link } from 'react-router-dom';
import { bannerService } from '../../services/bannerService';
import { bookService } from '../../services/bookService';
import { useAsync } from '../../hooks/useAsync';
import type { Banner } from '../../types';
import { catalogQueryFromParams } from '../../utils/catalogQuery';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '../ui/Icons';
import { Skeleton } from '../ui/Skeleton';

const INTERVAL_MS = 5000;
const SWIPE_THRESHOLD = 40;
const COVER_COUNT = 3;
const BACKGROUNDS = 4;

/** Prévia do que o link do banner abre: as primeiras capas da mesma consulta do catálogo. Decorativa. */
function BannerCovers({ linkUrl }: { linkUrl: string }) {
  const params = new URL(linkUrl, window.location.origin).searchParams;
  const { data } = useAsync(
    (signal) => bookService.search({ ...catalogQueryFromParams(params), page: 0, size: 6 }, signal),
    [linkUrl],
  );
  const covers = (data?.content ?? []).filter((b) => b.coverUrl).slice(0, COVER_COUNT);
  if (covers.length === 0) return null;

  // sem loading="lazy": os slides fora da tela seriam baixados só ao aparecer, e a capa piscaria vazia na troca
  return (
    <div className="banner__covers" aria-hidden="true">
      {covers.map((b) => (
        <img key={b.id} src={b.coverUrl!} alt="" />
      ))}
    </div>
  );
}

function Slide({ banner }: { banner: Banner }) {
  const [imageFailed, setImageFailed] = useState(false);

  // banner com arte própria: a imagem inteira é o link
  if (banner.imageUrl && !imageFailed) {
    const image = <img src={banner.imageUrl} alt={banner.title} onError={() => setImageFailed(true)} />;
    return banner.linkUrl ? (
      <Link to={banner.linkUrl} className="banner__link">
        {image}
      </Link>
    ) : (
      image
    );
  }

  return (
    <div className="banner__content">
      <div className="banner__text">
        {banner.badge && <span className="banner__badge">{banner.badge}</span>}
        <h2>{banner.title}</h2>
        {banner.subtitle && <p>{banner.subtitle}</p>}
        {(banner.couponCode || (banner.ctaLabel && banner.linkUrl)) && (
          <div className="banner__actions">
            {banner.couponCode && (
              <span className="banner__coupon">
                Cupom <strong>{banner.couponCode}</strong>
              </span>
            )}
            {banner.ctaLabel && banner.linkUrl && (
              <Link to={banner.linkUrl} className="btn banner__cta">
                {banner.ctaLabel}
              </Link>
            )}
          </div>
        )}
      </div>
      {banner.linkUrl?.startsWith('/livros') && <BannerCovers linkUrl={banner.linkUrl} />}
    </div>
  );
}

export function BannerCarousel() {
  const { data: banners, loading } = useAsync((signal) => bannerService.list(signal), []);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // pausa por hover ou foco de teclado
  const [userPaused, setUserPaused] = useState(false); // pausa pelo botão
  const touchStartX = useRef<number | null>(null);

  const count = banners?.length ?? 0;
  const go = useCallback((i: number) => setIndex((i + count) % Math.max(count, 1)), [count]);

  // Depende de index: navegar manualmente reinicia a contagem. Com "reduzir movimento" a troca continua,
  // só sem a animação de deslizar (CSS); quem quiser parar usa o botão de pausa.
  useEffect(() => {
    if (count < 2 || paused || userPaused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [count, paused, userPaused, index]);

  // Clique do mouse também foca o botão; só o foco de teclado pausa, para a rotação não travar após um clique.
  function onFocus(e: FocusEvent<HTMLElement>) {
    if (e.target.matches(':focus-visible')) setPaused(true);
  }

  if (loading) return <Skeleton className="skeleton--banner" />;
  if (!banners || count === 0) return null;

  return (
    <section
      className="banner"
      aria-roledescription="carrossel"
      aria-label="Promoções"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={onFocus}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > SWIPE_THRESHOLD) go(index + (delta < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      <div className="banner__track" style={{ transform: `translateX(-${index * 100}%)` }} aria-live="off">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={`banner__slide banner__slide--${i % BACKGROUNDS}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
            aria-hidden={i !== index}
            inert={i !== index} // slides fora da tela não recebem foco
          >
            <Slide banner={b} />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button type="button" className="banner__nav banner__nav--prev" onClick={() => go(index - 1)} aria-label="Banner anterior">
            <ChevronLeftIcon />
          </button>
          <button type="button" className="banner__nav banner__nav--next" onClick={() => go(index + 1)} aria-label="Próximo banner">
            <ChevronRightIcon />
          </button>

          <div className="banner__controls">
            <button
              type="button"
              className="banner__pause"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? 'Retomar troca automática' : 'Pausar troca automática'}
            >
              {userPaused ? <PlayIcon width={16} height={16} /> : <PauseIcon width={16} height={16} />}
            </button>
            <div className="banner__dots">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  className={`banner__dot${i === index ? ' is-active' : ''}`}
                  onClick={() => go(i)}
                  aria-label={`Ir para o banner ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
