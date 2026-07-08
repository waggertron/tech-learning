// @ts-nocheck
import { Suspense } from "react";
import { Albums, AlbumsSkeleton, ArtistHeader } from "../../content/docs/posts/_react-example-modules/ArtistPanels";

export function ArtistPage({ artistId }: { artistId: string }) {
  return (
    <main>
      <ArtistHeader artistId={artistId} />
      <Suspense fallback={<AlbumsSkeleton />}>
        <Albums artistId={artistId} />
      </Suspense>
    </main>
  );
}
