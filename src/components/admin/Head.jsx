import { isDemo } from "../../api/client.js";
import Art from "../ui/Art.jsx";

export const Lv = () => <span className="lv"><i />{isDemo ? "demo" : "live"}</span>;

export default function Head({ t, p, art = "printer" }) {
  return (
    <div className="ah">
      <div><span className="eb">Dashboard<Lv /></span><h2>{t}</h2><p>{p}</p></div>
      <Art name={art} />
    </div>
  );
}
