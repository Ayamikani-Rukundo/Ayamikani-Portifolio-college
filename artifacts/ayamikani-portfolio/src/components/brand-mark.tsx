export default function BrandMark({ avatarUrl }: { avatarUrl?: string | null }) {
  return (
    <span className={`brand-mark${avatarUrl ? " has-avatar" : ""}`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="" aria-hidden="true" />
      ) : (
        "AR"
      )}
    </span>
  );
}
