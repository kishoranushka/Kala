import { Fragment } from 'react';
import cx from '@/utils/cx';

/* One masked line of a headline (animated by [data-intro-line] / [data-hero]). */
export function Line({ className, children }) {
  return (
    <span className={cx('lm', className)}>
      <span className="li">{children}</span>
    </span>
  );
}

/* The italic accent word used across headlines. */
export function Accent({ children }) {
  return <span className="font-normal text-secondary italic">{children}</span>;
}

/* Word-by-word masked text for [data-words] reveals.
   Markup inside `text`: *word* is italic, ~word~ is italic in the accent colour. */
const TOKEN = /(\*[^*]+\*|~[^~]+~)/;

function renderWord(word) {
  return word.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('*')) return <span key={i} className="italic">{part.slice(1, -1)}</span>;
    if (part.startsWith('~')) return <span key={i} className="text-secondary italic">{part.slice(1, -1)}</span>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function SplitWords({ as: Tag = 'h2', text, ...props }) {
  const words = text.split(' ');
  return (
    <Tag data-words {...props}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="wm">
            <span className="wi">{renderWord(word)}</span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
}
