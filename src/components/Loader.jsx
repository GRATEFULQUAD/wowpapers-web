export function Loader({ label = "Loading wallpapers…" }) {
  return (
    <div className="loader">
      <div className="loader__ring" />
      <p>{label}</p>
    </div>
  );
}
