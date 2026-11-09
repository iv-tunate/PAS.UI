
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.png"
      alt="Relearn"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="object-contain"
    />
  );
}
