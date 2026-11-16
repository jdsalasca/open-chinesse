import { Icon, type IconName } from './ui/Icon';

type NavSection = { current: string; href: string; icon: IconName; label: string };

const SECTIONS: NavSection[] = [
  { current: 'home', href: '#/', icon: 'book', label: 'Aprender' },
  { current: 'practicar', href: '#/practicar', icon: 'target', label: 'Practicar' },
  { current: 'historias', href: '#/historias', icon: 'sparkles', label: 'Historias' },
  { current: 'inmersion', href: '#/inmersion', icon: 'speaker', label: 'Inmersión' },
  { current: 'perfil', href: '#/perfil', icon: 'name', label: 'Yo' },
];

export function BottomNav({ current }: { current: string }) {
  return (
    <nav className="bottom-nav" aria-label="Secciones">
      {SECTIONS.map((section) => (
        <a
          key={section.current}
          href={section.href}
          className="bottom-nav__link"
          aria-current={current === section.current ? 'page' : undefined}
        >
          <Icon name={section.icon} size={20} />
          <span className="bottom-nav__label">{section.label}</span>
        </a>
      ))}
    </nav>
  );
}
