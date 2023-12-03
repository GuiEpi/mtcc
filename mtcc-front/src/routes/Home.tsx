import { BlurryBlob } from "@/components/BlurryBlob";
import { Dropzone } from "@/components/Dropzone";
import { TorrentContent } from "@/components/TorrentContent";
import { UploadCard } from "@/components/UploadCard";
import { useHomeFileStore } from "@/services/useFileStore";
import { useTorrentContentResponseStore } from "@/services/useTorrentContentResponseStore";


export default function Home() {
    const files = useHomeFileStore(state => state.files);
    const torrentContent = useTorrentContentResponseStore(state => state.torrentContent);

    if (!torrentContent.nfo && !torrentContent.pres) {
      return (
        <Dropzone>
          {files.length == 0 && (
            <>
              <div className="pointer-events-none -z-10 opacity-50">
                <BlurryBlob
                  width="min(56rem, 100vw)"
                  height="400px"
                  left="50%"
                  top="50px"
                />
              </div>
              <div className="flex w-full flex-col items-center justify-center px-3 pb-20 pt-24 md:bg-none">
                {/* <h1 className="font-bold text-8xl">mtcc</h1> */}
                <h1 className="scroll-m-20 text-7xl font-extrabold tracking-tight lg:text-8xl">mtcc</h1>
                <p>The best <b>Ygg</b> <b>m</b>usic <b>t</b>orrent <b>c</b>ontent <b>c</b>reator.</p>
              </div>
            </>
            )
          }
          <div className="pb-20 pt-24">
            <UploadCard fromNfo={false}/>
          </div>
        </Dropzone>
      );
    }
    else {
      return (
        <TorrentContent />
      );
    }
  }