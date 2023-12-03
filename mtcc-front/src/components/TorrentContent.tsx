import { useTorrentContentResponseStore } from '@/services/useTorrentContentResponseStore';
import React from 'react'
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyToClipboardButton } from './CopyToClipboardButton';
import { Link } from 'react-router-dom';
import { useHomeFileStore } from '@/services/useFileStore';
import { DownloadNfoButton } from './DownloadNfoButton';
import BBCode from 'nbbcjs';



export const TorrentContent: React.FC = () => {
	const { torrentContent, resetTorrentContentResponse } = useTorrentContentResponseStore((state) => ({
		torrentContent: state.torrentContent,
		resetTorrentContentResponse: state.resetTorrentContentResponse
	}));
	const resetFiles = useHomeFileStore(state => state.resetFiles);

	const createMarkup = () => {
		const bbcode = new BBCode();
    const htmlContent = bbcode.parse(torrentContent.pres ?? "");
    return { __html: htmlContent || "" };
  };

	const resetFilesAndTorrentContent = () => {
		resetTorrentContentResponse();
		resetFiles();
	}

  return (
    <div className='space-y-4 flex flex-col justify-center items-center pb-20 pt-24'>
			<div className='space-y-2'>
				<div className='space-x-2 flex items-center'>
					<h3 className="text-2xl font-semibold tracking-tight">{torrentContent.torrentName}</h3>
					<CopyToClipboardButton text={torrentContent.torrentName ?? ""} />
				</div> 
				<div className='flex space-x-2'>
					<DownloadNfoButton nfoLink={torrentContent.nfoDownloadLink ?? ""} />
					{/* <Button asChild>
						<a href={torrentContent.nfo_download_link ?? ""} download>
							Download Nfo
						</a>
					</Button> */}
					<Button onClick={() => resetFilesAndTorrentContent()} variant="secondary" asChild>
						<Link to="/">More content to generate?</Link>
					</Button>
				</div>
			</div>
			<h1 className="scroll-m-20 text-4xl pb-16 pt-24 font-extrabold tracking-tight lg:text-5xl">
				Preview
			</h1>
			<div className='flex justify-center w-3/5'>
				<Tabs defaultValue="pres" className="w-full">
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value="pres">Pres</TabsTrigger>
						<TabsTrigger value="nfo">Nfo</TabsTrigger>
					</TabsList>
					<TabsContent value="pres">
						<div className='relative'>
							<div dangerouslySetInnerHTML={createMarkup()} />
							<div className="absolute top-0 right-0 p-2">
								<CopyToClipboardButton text={torrentContent.pres ?? ""} />
							</div>
						</div>
						{/* <pre className='relative'>
							{torrentContent.pres}
							<div className="absolute top-0 right-0 p-2">
								<CopyToClipboardButton text={torrentContent.pres ?? ""} />
							</div>
						</pre> */}
					</TabsContent>
					<TabsContent value="nfo" className='flex justify-center relative'>
						<pre className='relative'>
							{torrentContent.nfo}
						</pre>
						<div className="absolute top-0 right-0 p-2">
								<CopyToClipboardButton text={torrentContent.nfo ?? ""} />
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
  )
}
