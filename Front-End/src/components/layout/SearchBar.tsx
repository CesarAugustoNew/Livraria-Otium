import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon } from '../ui/Icons';

export function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') ?? '');

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/livros?q=${encodeURIComponent(q)}` : '/livros');
  }

  return (
    <form className="search" role="search" onSubmit={submit}>
      <label htmlFor="site-search" className="sr-only">
        Buscar livros
      </label>
      <input
        id="site-search"
        type="search"
        placeholder="Buscar livros"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="search__btn" aria-label="Buscar">
        <SearchIcon />
      </button>
    </form>
  );
}
