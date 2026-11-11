import { BRAND_ICONS, type BrandName } from "./brand-icons";

export function BrandMark({
  name,
  className = "size-5",
}: {
  name: BrandName;
  className?: string;
}) {
  const icon = BRAND_ICONS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}
