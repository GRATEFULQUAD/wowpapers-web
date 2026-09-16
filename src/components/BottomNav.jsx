import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/favorites", label: "Favorites", icon: HeartIcon },
  { to: "/browse", label: "Browse", icon: GridIcon },
  { to: "/settings", label: "Settings", icon: GearIcon },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Primary">
      <div className="bottom-nav__inner">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => "nav-item" + (isActive ? " nav-item--active" : "")}
          >
            <span className="nav-item__icon">
              <Icon />
            </span>
            <span className="nav-item__label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M12 20.5s-7.5-4.6-9.7-9.1C.7 8.2 2.1 4.8 5.4 4a4.9 4.9 0 0 1 6.6 2.4A4.9 4.9 0 0 1 18.6 4c3.3.8 4.7 4.2 3.1 7.4C19.5 15.9 12 20.5 12 20.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3.2" />
      <path
        d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.8-1.4-2-3.5-2.1.6a7.6 7.6 0 0 0-2.6-1.5L14 2h-4l-.5 2.7a7.6 7.6 0 0 0-2.6 1.5l-2.1-.6-2 3.5L4.6 10.5a7.6 7.6 0 0 0 0 3L2.8 15l2 3.5 2.1-.6a7.6 7.6 0 0 0 2.6 1.5L10 22h4l.5-2.6a7.6 7.6 0 0 0 2.6-1.5l2.1.6 2-3.5-1.8-1.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
