import { Link } from 'react-router-dom';

/* Route paths become router links; in-page anchors (#id) and mailto stay plain anchors;
   other sites open in a new tab. */
export default function SmartLink({ to, ...props }) {
  if (to.startsWith('/')) return <Link to={to} {...props} />;
  if (/^https?:/.test(to)) return <a href={to} target="_blank" rel="noopener" {...props} />;
  return <a href={to} {...props} />;
}
