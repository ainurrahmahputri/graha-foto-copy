import { useEffect, useRef, useState } from "react";
import { api, auth } from "../../api/client.js";
import { useApp } from "../../context.jsx";
import { hap } from "../../fx/effects.js";
import Modal from "../ui/Modal.jsx";

export default function LoginModal() {
  const { loginOpen, setLoginOpen, enterAdmin } = useApp();
  const [u, setU] = useState(""), [p, setP] = useState(""), [err, setErr] = useState(""), [shake, setShake] = useState(false), [busy, setBusy] = useState(false);
  const first = useRef(null);

  useEffect(() => { if (loginOpen) { setU(""); setP(""); setErr(""); setTimeout(() => first.current?.focus(), 50); } }, [loginOpen]);

  const submit = async () => {
    setBusy(true); setErr("");
    try {
      const { token } = await api.login(u.trim(), p);
      auth.set(token); setLoginOpen(false); enterAdmin();
    } catch (e) {
      setErr(e.status === 401 || !e.status ? "Nama atau password salah." : e.message);
      setShake(true); hap(30); setTimeout(() => setShake(false), 500);
    }
    setBusy(false);
  };

  return (
    <Modal id="loginM" on={loginOpen} shake={shake} onClose={() => setLoginOpen(false)}>
      <h3>Masuk admin</h3>
      <div className="grp"><label className="lbl">Nama</label><input className="inp" ref={first} autoComplete="off" value={u} onChange={(e) => setU(e.target.value)} /></div>
      <div className="grp"><label className="lbl">Password</label>
        <input className="inp" type="password" value={p} onChange={(e) => setP(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} /></div>
      {err && <p className="text-(color:--bad) text-[12.5px] mt-2.5">{err}</p>}
      <button className="btn primary w-full mt-4.5"  disabled={busy} onClick={submit}>{busy ? "Memeriksa…" : "Masuk"}</button>
    </Modal>
  );
}
