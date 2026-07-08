export function ArtistHeader({ artistId }: { artistId: string }) {
  return <h1>Artist {artistId}</h1>;
}

export function AlbumsSkeleton() {
  return <p>Loading albums...</p>;
}

export function Albums({ artistId }: { artistId: string }) {
  return (
    <ul>
      <li>Live set for {artistId}</li>
      <li>Studio sessions</li>
    </ul>
  );
}
