import Icon from './Icon';

/* native <details> accordion row; the plus turns into a cross when open */
export default function Disclosure({ title, children }) {
  return (
    <details className="group border-t border-divider last:border-b">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <Icon name="plus" size={18} className="transition-transform duration-500 ease-gallery group-open:rotate-45" />
      </summary>
      <p className="mb-5 max-w-[52ch] text-sm/[22px] text-soft">{children}</p>
    </details>
  );
}
