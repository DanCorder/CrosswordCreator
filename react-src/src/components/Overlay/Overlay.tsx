import { useState, type ReactNode } from 'react';
import './Overlay.css';

interface Props {
  linkText: string;
  children: ReactNode;
}

export default function Overlay({ linkText, children }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <span className="link" onClick={() => setVisible(true)}>
        {linkText}
      </span>
      {visible && (
        <div className="overlay-backdrop">
          <div className="overlay-content-block">
            <p className="overlay-close link" onClick={() => setVisible(false)}>
              Close
            </p>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
