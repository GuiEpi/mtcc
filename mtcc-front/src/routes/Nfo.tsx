import { Dropzone } from '@/components/Dropzone';
import { NfoContent } from '@/components/NfoContent';
import { UploadCard } from '@/components/UploadCard';
import { useNfoFileStore } from '@/services/useFileStore';
import { useNfoContentResponseStore } from '@/services/useTorrentContentResponseStore';

export default function Nfo() {
    const files = useNfoFileStore(state => state.files);
    const nfoContent = useNfoContentResponseStore(state => state.nfoContent);

    if (! nfoContent.nfo) {
      return (
        <Dropzone fromNfo={true}>
          {files.length == 0 && (
            <>
              <div className="flex w-full flex-col items-center justify-center px-3 pb-20 pt-24 md:bg-none">
                <h1 className="scroll-m-20 text-7xl font-extrabold tracking-tight lg:text-8xl text-transparent bg-clip-text bg-gradient-to-t from-[#8c52ff] to-[#f6e4ff]">Nfo builder</h1>
              </div>
            </>
            )
          }
          <div className="pb-20 pt-24">
            <UploadCard fromNfo={true} />
          </div>
        </Dropzone>
      );
    }
    else {
      return (
        <>
            <div className="flex w-full flex-col items-center justify-center px-3 pb-20 pt-24 md:bg-none">
                <h1 className="scroll-m-20 text-7xl font-extrabold tracking-tight lg:text-8xl text-transparent bg-clip-text bg-gradient-to-t from-[#8c52ff] to-white">Nfo builder</h1>
            </div>
            <NfoContent />
        </>
      );
    }
}
