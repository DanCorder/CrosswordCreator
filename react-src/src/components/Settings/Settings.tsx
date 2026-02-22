interface Props {
  title: string;
  author: string;
  onTitleChange: (title: string) => void;
  onAuthorChange: (author: string) => void;
}

export default function Settings({ title, author, onTitleChange, onAuthorChange }: Props) {
  return (
    <div>
      <label>
        Title:{' '}
        <input
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
        />
      </label>
      {' '}
      <label>
        Author:{' '}
        <input
          type="text"
          value={author}
          onChange={e => onAuthorChange(e.target.value)}
        />
      </label>
    </div>
  );
}
