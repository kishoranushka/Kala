import { CONTACT, FOOTER_GROUPS, LEGAL_LINKS } from '@/data/site';
import SmartLink from '@/components/ui/SmartLink';
import Wordmark from './Wordmark';

const COLUMN = 'col-span-2 max-lg:col-span-4 max-lg:mt-10 max-sm:col-span-6 max-sm:mt-9 max-xs:col-span-full';
const COLUMN_LINK = 'block py-1.5 text-sm/[22px] break-words no-underline hover:!text-on-primary-muted max-sm:py-[11px]';

/* on the home page, links into the home page stay in-page anchors */
const local = (to, isHome) => (isHome && to.startsWith('/#') ? to.slice(1) : to);

export default function Footer({ isHome = false }) {
  return (
    <footer className="inverse overflow-hidden border-t border-hairline/70 bg-primary pb-10 text-on-primary">
      <div className="wrap">
        <div data-stagger className="grid-12 pt-[clamp(56px,7vw,88px)]">
          <div className="col-[1/6] max-lg:col-span-full">
            <Wordmark inverse to={isHome ? '#top' : '/'} />
            <p className="mt-6 max-w-[18ch] font-display text-[30px]/[38px] font-normal italic">Paintings, mandalas and murals by {CONTACT.artist}.</p>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title} className={COLUMN}>
              <p className="eyebrow-quiet mb-3">{group.title}</p>
              {group.links.map((link) => (
                <SmartLink key={link.label} to={local(link.to, isHome)} className={COLUMN_LINK}>
                  {link.label}
                </SmartLink>
              ))}
            </nav>
          ))}
          <div className={COLUMN}>
            <p className="eyebrow-quiet mb-3">Follow</p>
            <SmartLink to={CONTACT.instagram} className={COLUMN_LINK}>Instagram · {CONTACT.instagramHandle}</SmartLink>
            <SmartLink to={CONTACT.youtube} className={COLUMN_LINK}>YouTube · {CONTACT.youtubeHandle}</SmartLink>
            <SmartLink to={`mailto:${CONTACT.email}`} className={COLUMN_LINK}>{CONTACT.email}</SmartLink>
          </div>
        </div>

        <div aria-hidden="true" className="mt-[clamp(48px,6vw,72px)] flex justify-between overflow-hidden pb-[.04em] font-display text-[clamp(84px,25vw,380px)] leading-[.84] font-light text-on-primary">
          <span data-fl className="inline-block">K</span>
          <span data-fl className="inline-block text-secondary italic">A</span>
          <span data-fl className="inline-block">L</span>
          <span data-fl className="inline-block">A</span>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-hairline pt-6 text-xs/[18px] text-on-primary-muted">
          <span>© [Year] {CONTACT.artist}. All artwork © the artist.</span>
          <span className="flex flex-wrap gap-6">
            {LEGAL_LINKS.map((label) => (
              <a key={label} href="#top" className="!text-on-primary-muted no-underline hover:!text-on-primary">
                {label}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
