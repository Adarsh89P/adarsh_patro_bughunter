/**
 * Fixed, page-wide color wash behind every section. The glass panels across
 * the site rely on backdrop-filter to refract color that's actually behind
 * them — without this, a card sitting on the flat canvas background has
 * nothing to blur and just looks like a plain translucent box.
 */
export function AmbientMesh() {
  return (
    <div className="ambient-mesh" aria-hidden>
      <span className="mesh-a" />
      <span className="mesh-b" />
      <span className="mesh-c" />
    </div>
  );
}

export default AmbientMesh;
