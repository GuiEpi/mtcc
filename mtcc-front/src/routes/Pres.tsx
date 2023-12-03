import { PresContent } from '@/components/PresContent';
import { PreviewCardPres } from '@/components/PreviewCardPres';
import SearchAlbum from '@/components/SearchAlbum'
import { useSelectedAlbumStore } from '@/services/useSelectedAlbumStore';
import { usePresContentResponseStore } from '@/services/useTorrentContentResponseStore';

export default function Pres() {
  const selectedAlbum = useSelectedAlbumStore(state => state.album);
  const presContent = usePresContentResponseStore(state => state.presContent);

  if (presContent.pres) {
    return (
      <PresContent />
    );
  } else {
    return (
      <div className="flex w-full flex-col items-center justify-center px-3 pb-20 pt-24 md:bg-none">
        {!selectedAlbum.id ? (
          <>
            <h1 className="scroll-m-20 text-7xl font-extrabold tracking-tight lg:text-8xl text-transparent bg-clip-text bg-gradient-to-t from-[#8c52ff] to-[#f6e4ff]">PRES</h1>
            <SearchAlbum />
          </>
        ) : (
          <PreviewCardPres {...selectedAlbum} />
        )}
      </div>
    )
  }
}
