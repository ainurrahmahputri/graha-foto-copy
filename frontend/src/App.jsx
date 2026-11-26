import { useEffect } from "react";
import { AppProvider, useApp } from "./context.jsx";
import { installGlobalFx } from "./fx/effects.js";
import { SVG_DEFS } from "./lib/svgDefs.js";
import Logo from "./components/ui/Logo.jsx";
import Landing from "./components/customer/Landing.jsx";
import CustomerApp from "./components/customer/CustomerApp.jsx";
import Admin from "./components/admin/Admin.jsx";
import LoginModal from "./components/admin/LoginModal.jsx";
import ViewModal from "./components/admin/ViewModal.jsx";
import RoleSwitch from "./components/admin/RoleSwitch.jsx";

function Shell() {
  const { view, toastMsg } = useApp();
  useEffect(() => installGlobalFx(), []);
  return (
    <>
      {/* gradien dan filter SVG yang dipakai bersama semua ilustrasi */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" dangerouslySetInnerHTML={{ __html: "<defs>" + SVG_DEFS + "</defs>" }} />
      <div id="stage">
        <div className="phone" id="phone">
          <div className="island" />
          <section id="splash" className={"view" + (view === "splash" ? " on" : "")}>
            <div><Logo /><h2>Graha <i>Foto Copy</i></h2><p>Print · Copy · Jilid</p></div>
          </section>
          <Landing />
          <CustomerApp />
        </div>
      </div>
      <Admin />
      <LoginModal />
      <ViewModal />
      <RoleSwitch />
      <div className={"toast" + (toastMsg.on ? " on" : "")}>{toastMsg.text}</div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
