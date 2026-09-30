import { Link } from 'react-router-dom';

interface Props {
  title: string;
  viewAllTo?: string;
}

export function SectionTitle({ title, viewAllTo }: Props) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {viewAllTo && (
        <Link to={viewAllTo} className="section-title__link">
          Ver todos
        </Link>
      )}
    </div>
  );
}
