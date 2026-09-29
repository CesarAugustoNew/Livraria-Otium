import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { bannerService } from '../../services/bannerService';
import { useAsync } from '../../hooks/useAsync';
import type { Banner } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '../ui/Icons';
import { Skeleton } from '../ui/Skeleton';

const INTERVAL_MS = 5000;
const SWIPE_THRESHOLD = 40;

function Slide({ banner }: { banner: Banner }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = banner.imageUrl && !imageFailed;

  const content = showImage ? (
    <img src={banner.imageUrl!} alt={banner.title} onError={() => setImageFailed(true)} />
  ) : (
    // fallback: sem imagem (ou imagem quebrada), o texto do banner ocupa o lugar
    <div className="banner__fallback">
      <h2>{banner.title}</h2>
      {banner.subtitle && <p>{banner.subtitle}</p>}
    </div>
  );

  return banner.linkUrl ? (
    <Link to={banner.linkUrl} className="banner__link" tabIndex={-1}>
      {content}
    </Link>
  ) : (
    content
  );
}

export function BannerCarousel() {
  const { data: banners, loading } = useAsync((signal) => bannerService.list(signal), []);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // pausa por hover/foco
  const [userPaused, setUserPaused] = useState(false); // pausa pelo botão
  const touchStartX = useRef<number | null>(null);

  const count = banners?.length ?? 0;
  const go = useCallback((i: number) => setIndex((i + count) % Math.max(count, 1)), [count]);

  useEffect(() => {
    if (count < 2 || paused || userPaused) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count, paused, userPaused]);

  if (loading) return <Skeleton className="skeleton--banner" />;
  if (!banners || count === 0) return null;

  return (
    <section
      className="banner"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
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
            className={`banner__slide banner__slide--${i % 3}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
            aria-hidden={i !== index}
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
