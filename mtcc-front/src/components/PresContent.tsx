import { usePresContentResponseStore } from "@/services/useTorrentContentResponseStore";
import { CopyToClipboardButton } from "./CopyToClipboardButton";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelectedAlbumStore } from "@/services/useSelectedAlbumStore";
import BBCode from 'nbbcjs';


export const PresContent: React.FC = () => {
  const { presContent, resetPresContentResponse } = usePresContentResponseStore((state) => ({
    presContent: state.presContent,
    resetPresContentResponse: state.resetPresContentResponse
  }));

	const createMarkup = () => {
		const bbcode = new BBCode();
    const htmlContent = bbcode.parse(presContent.pres ?? "");
    return { __html: htmlContent || "" };
  };

	const { clearSelectedAlbum } = useSelectedAlbumStore((state) => ({
		clearSelectedAlbum: state.clearSelectedAlbum
	}));

	const resetSearchAndPresContent = () => {
		resetPresContentResponse();
		clearSelectedAlbum();
	}

  return (
    <div className='space-y-4 flex flex-col justify-center items-center pb-20 pt-24'>
			<div className='space-y-2'>
				<div className='space-x-2 flex items-center'>
					<h3 className="text-2xl font-semibold tracking-tight">{presContent.torrentName}</h3>
					<CopyToClipboardButton text={presContent.torrentName ?? ""} />
				</div> 
				<div className='flex space-x-2'>
					<Button onClick={() => resetSearchAndPresContent()} asChild>
						<Link to="/pres">More pres to generate?</Link>
					</Button>
					<Button onClick={() => resetPresContentResponse()} variant="secondary" asChild>
						<Link to="/pres">Made a mistake?</Link>
					</Button>
				</div>
			</div>
			<h1 className="scroll-m-20 text-4xl pb-16 pt-24 font-extrabold tracking-tight lg:text-5xl">
				Preview
			</h1>
			<div className='w-1/2 relative'>
				<div dangerouslySetInnerHTML={createMarkup()} />
				<div className="absolute top-0 right-0 p-2">
					<CopyToClipboardButton text={presContent.pres ?? ""} />
				</div>
			</div>
		</div>
  )
}