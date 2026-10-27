export default function AdminLoading() {
  return (
    <main className="admin-route-loading" role="status" aria-live="polite">
      <span className="route-loading-spinner" aria-hidden="true" />
      <span>Opening workspace…</span>
    </main>
  );
}
