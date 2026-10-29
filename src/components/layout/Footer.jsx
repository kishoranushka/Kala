import { CONTACT, LEGAL_LINKS, NAV_LINKS } from '@/data/site';
import SmartLink from '@/components/ui/SmartLink';
import Wordmark from './Wordmark';

const navGroup = (keys) => NAV_LINKS.filter((l) => keys.includes(l.key));

function FooterColumn({ title, label, links }) {
  const Tag = label ? 'nav' : 'div';
  return (
    <Tag aria-label={label} className="col-span-2 max-lg:col-span-4 max-lg:mt-10 max-sm:col-span-6 max-sm:mt-9 max-xs:col-span-full">
      <p className="eyebrow mb-3">{title}</p>
      {links.map((link) => (
        <SmartLink key={link.label} to={link.to} className="block py-1.5 text-sm/[22px] max-sm:py-[11px]">
          {link.label}
        </SmartLink>
      ))}
    </Tag>
  );
}

export default function Footer({ isHome = false }) {
  const emailTo = isHome ? '#commission' : '/contact';
  return (
    <footer className="inverse overflow-hidden bg-chapter pb-10 text-paper">
      <div className="wrap">
        <div data-stagger className="grid-12 border-t border-hairline pt-[clamp(48px,6vw,72px)]">
          <div className="col-[1/6] max-lg:col-span-full">
            <Wordmark inverse to={isHome ? '#top' : '/'} label={isHome ? 'KALA, back to top' : 'KALA, home'} />
            <p className="mt-7 max-w-[16ch] font-display text-[32px]/10 font-light italic">Art that lives beyond the canvas.</p>
          </div>
          <FooterColumn title="Explore" label="Explore" links={navGroup(['shop', 'collections', 'archive'])} />
          <FooterColumn title="Studio" label="Studio" links={navGroup(['artist', 'commission', 'contact'])} />
          <FooterColumn
            title="Follow"
            links={[
              { label: `Instagram · ${CONTACT.instagram}`, to: '#top' },
              { label: `YouTube · ${CONTACT.youtube}`, to: '#top' },
              { label: CONTACT.email, to: emailTo },
            ]}
          />
        </div>

        <div aria-hidden="true" className="mt-[clamp(48px,6vw,72px)] flex justify-between overflow-hidden pb-[.04em] font-display text-[clamp(84px,25vw,380px)] leading-[.84] font-light text-paper">
          <span data-fl className="inline-block">K</span>
          <span data-fl className="inline-block text-accent italic">A</span>
          <span data-fl className="inline-block">L</span>
          <span data-fl className="inline-block">A</span>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-hairline pt-6 text-xs/[18px] text-on-inverse-muted">
          <span>© [Year] {CONTACT.artist}. All artwork © the artist.</span>
          <span className="flex flex-wrap gap-6">
            {LEGAL_LINKS.map((label) => (
              <a key={label} href="#top" className="text-on-inverse-muted underline">
                {label}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
