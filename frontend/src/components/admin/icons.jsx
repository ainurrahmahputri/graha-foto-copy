const PATHS = {
  orders: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4v1.5h6V4M9 11h6M9 15h4" /></>,
  money: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></>,
  items: <><path d="M4 8l8-4 8 4v8l-8 4-8-4z" /><path d="M4 8l8 4 8-4M12 12v8" /></>,
  set: <><path d="M5 7h14M5 17h14" /><circle cx="9" cy="7" r="2" /><circle cx="15" cy="17" r="2" /></>,
  out: <><path d="M10 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4M15 8l4 4-4 4M9 12h10" /></>,
};
export const AIcon = ({ k }) => <svg viewBox="0 0 24 24" aria-hidden="true">{PATHS[k]}</svg>;
