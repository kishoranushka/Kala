import { Link } from 'react-router-dom';

/* Route paths become router links; in-page anchors (#id) and external URLs stay plain anchors. */
export default function SmartLink({ to, ...props }) {
  if (to.startsWith('/')) return <Link to={to} {...props} />;
  return <a href={to} {...props} />;
}
