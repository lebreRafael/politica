export default function PlaceholderAvatar({
  name,
  size = "w-16 h-16",
}: {
  name: string;
  size?: string;
}) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${size} bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold`}
    >
      {initials}
    </div>
  );
}
