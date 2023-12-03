import { useNfoContentResponseStore } from '@/services/useTorrentContentResponseStore';
import { Button } from './ui/button';
import { CopyToClipboardButton } from './CopyToClipboardButton';
import { Link } from 'react-router-dom';
import { DownloadNfoButton } from './DownloadNfoButton';
import { Accordion, AccordionContent, AccordionTrigger, AccordionItem } from './ui/accordion';
import { useNfoFileStore } from '@/services/useFileStore';



export const NfoContent: React.FC = () => {
	const { nfoContent, resetNfoContentResponse } = useNfoContentResponseStore((state) => ({
		nfoContent: state.nfoContent,
		resetNfoContentResponse: state.resetNfoContentResponse
	}));
	const resetFiles = useNfoFileStore(state => state.resetFiles);

	const resetFilesAndTorrentContent = () => {
		resetNfoContentResponse();
		resetFiles();
	}

  return (
    <div className='pt-16 space-y-8 pb-16'>
			<div className='flex justify-center space-x-8'>
				<DownloadNfoButton nfoLink={nfoContent.nfoDownloadLink ?? ""} />
				<Button onClick={() => resetFilesAndTorrentContent()} variant="secondary" asChild>
						<Link to="/nfo">More to generate?</Link>
				</Button>
			</div>
			<div className='flex justify-center'>
				<div className='w-1/2'>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="nfo">
							<AccordionTrigger className='justify-center'>Preview</AccordionTrigger>
							<AccordionContent className='relative'>
								<pre className='flex justify-center'>
									{nfoContent.nfo}
								</pre>
								<div className="absolute top-0 right-0 p-2">
									<CopyToClipboardButton text={nfoContent.nfo ?? ""} />
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
  )
}
