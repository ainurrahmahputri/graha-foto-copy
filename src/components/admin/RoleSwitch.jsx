import { useEffect } from "react";
import { useApp } from "../../context.jsx";

/* Pil kecil di pojok: ganti peran (hanya mode demo) dan tampilan admin Desktop/HP. */
export default function RoleSwitch() {
  const { isDemo, view, avPick, setAvPick, demoAdmin, exitAdmin } = useApp();
  const adm = view === "admin";

  useEffect(() => {
    const sync = () => { document.body.dataset.av = avPick || (innerWidth < 760 ? "m" : "d"); };
    sync(); addEventListener("resize", sync);
    return () => removeEventListener("resize", sync);
  }, [avPick]);
  const av = avPick || (typeof innerWidth !== "undefined" && innerWidth < 760 ? "m" : "d");

  return (
    <div className={"dsw" + (isDemo ? " demo" : "") + (isDemo || adm ? " on" : "")} id="dsw">
      <div className="sg" data-g="role">
        <button className={!adm ? "on" : ""} onClick={() => adm && exitAdmin()}>Pelanggan</button>
        <button className={adm ? "on" : ""} onClick={() => !adm && demoAdmin()}>Admin</button>
      </div>
      <div className="sg" data-g="av">
        <button className={av === "d" ? "on" : ""} onClick={() => setAvPick("d")}>Desktop</button>
        <button className={av === "m" ? "on" : ""} onClick={() => setAvPick("m")}>HP</button>
      </div>
    </div>
  );
}
