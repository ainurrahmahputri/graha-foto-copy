export const LOGO_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="9" rx="2" /><path d="M6 14h12v7H6z" />
  </svg>
);
export default function Logo(props) {
  return <div className="logo" data-logo {...props}>{LOGO_SVG}</div>;
}
