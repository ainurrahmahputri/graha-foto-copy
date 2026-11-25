export default function Modal({ id, on, onClose, wide, shake, children }) {
  return (
    <div className={"modal" + (on ? " on" : "")} id={id} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={"mbox" + (wide ? " wide" : "") + (shake ? " shake" : "")}>
        <button className="x close" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}
