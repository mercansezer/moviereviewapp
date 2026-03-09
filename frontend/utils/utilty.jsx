export function renderItem(result) {
  return (
    <>
      <img
        src={result.avatar.url}
        alt={result.name}
        className="w-16 h-16 rounded object-cover"
      />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </>
  );
}
