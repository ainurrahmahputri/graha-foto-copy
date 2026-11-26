import Art from "./Art.jsx";

export default function PageTitle({ step, a, b, art = "stack" }) {
  return (
    <div className="pg">
      <div><span className="eb">{step}</span><h2>{a} <i>{b}</i></h2></div>
      {art !== "none" && <Art name={art} />}
    </div>
  );
}
