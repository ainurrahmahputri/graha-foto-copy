import { ART } from "../../lib/art.js";

/* Ilustrasi SVG buatan kode. `name` = kunci di lib/art.js. */
export default function Art({ name, className = "art", ...rest }) {
  const svg = ART[name];
  if (!svg) return null;
  return <div className={className} data-art={name} data-d="1" dangerouslySetInnerHTML={{ __html: svg }} {...rest} />;
}
