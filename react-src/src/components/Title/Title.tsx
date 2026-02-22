import './Title.css';

interface Props {
  title: string;
  author: string;
}

export default function Title({ title, author }: Props) {
  if (!title && !author) return null;

  return (
    <div className="title-block only-print">
      {title && <h1>{title}</h1>}
      {author && <h2>by {author}</h2>}
    </div>
  );
}
