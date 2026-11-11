import { Link } from 'react-router-dom';

/* Route paths become router links; in-page anchors (#id), mailto and tel stay plain anchors;
   other sites open in a new tab. Anything else (javascript:, data:…) is never rendered as a link. */
export default function SmartLink({ to, ...props }) {
  const href = String(to ?? '').trim();
  if (href.startsWith('/') && !href.startsWith('//')) return <Link to={href} {...props} />;
  if (/^https?:\/\//i.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  if (/^(#|mailto:|tel:)/i.test(href)) return <a href={href} {...props} />;
  return <span {...props} />;
}
