declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      webkitdirectory?: string;
  }
}
import { FileAudio, Trash, Upload } from "lucide-react"
import { acceptedFileTypes, formatBytes } from '@/lib/utils';
import { Button } from "./ui/button"
import { useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast';
import { NfoContentResponse, useNfoContentResponseStore } from "@/services/useTorrentContentResponseStore";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useNfoFileStore } from "@/services/useFileStore";
import { Badge } from "./ui/badge";
import LoadingButton from "./LoadingButton";

const formSchema = z.object({
  ripper: z.string().max(50),
  uploader: z.string().max(50),
})

export const PreviewUploadCardNfo = () => {
	const inputRef = useRef<HTMLInputElement>(null);
  const [hoverIndex, setHoverIndex] = useState(-1);
	const formData = new FormData();
  const [ripper] = useLocalStorage('ripper', '');
  const [uploader] = useLocalStorage('uploader', '');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { setNfoContentResponse } = useNfoContentResponseStore();

	const { files, removeFile, addFiles, resetFiles } = useNfoFileStore((state) => ({
    files: state.files,
    removeFile: state.removeFile,
    addFiles: state.addFiles,
    resetFiles: state.resetFiles
  }));

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(-1);
  };

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			ripper: ripper,
			uploader: uploader,
		},
	})

	const getTorrentContent = async (data: FormData): Promise<NfoContentResponse> => {
		const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/torrent`, {
			method: 'POST',
			body: data
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail);
		}
		return response.json();
  }

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = [];
    if (event.target.files) {
      for (const file of event.target.files) {
        if (!acceptedFileTypes.includes(file.type)) {
          continue;
        }
        files.push(file);
      }
      addFiles(files);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
    if (files) {
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, value);
        if (value !== "" && value !== null) {
          localStorage.setItem(key, value);
        }
      }
      for (const file of files) {
        formData.append('files', file.file);
      }
			formData.append("onlyNfo", "true");
      toast.promise(
        getTorrentContent(formData),
        {
          loading: 'Generate nfo...',
          success: (res) => {
            setNfoContentResponse(res);
            return 'Nfo successfully generated'
          },
          error: (err) => {
						setIsSubmitting(false);
						return `${err.toString()}`
					},
        },
      );
    }
  }

	const openFileDialog = () => {
    inputRef.current?.click();
  };

	return (
		<div className="flex justify-center items-center">
			<input
					className="hidden"
					ref={inputRef}
					type="file"
					onChange={handleFileChange}
					webkitdirectory=""
					multiple
			/>
			<div className="flex space-x-6 w-11/12 lg:w-1/2 border border-[#8C52FF] rounded p-10">
				<div className="flex flex-col justify-between w-1/2 space-y-6">
					<div className="space-y-6">
						<div className="flex items-center space-x-2">
							<label className="text-sm font-medium leading-none">{files.length} files uploaded</label>
							<Trash className="h-[1.2rem] w-[1.2rem] cursor-pointer" onClick={() => resetFiles()} />
						</div>
						<ScrollArea className="h-[32rem] rounded-md border">
							<div className="p-4">
								{files.map((file, index) => (
									<div key={index} className="relative group">
										<div className="flex items-center" 
											onMouseEnter={() => handleMouseEnter(index)} 
											onMouseLeave={handleMouseLeave}
										>
											<FileAudio />
											<div className="ml-2 w-full">
												<div className="w-11/12">{file.name}</div>
												<span className="text-xs text-muted-foreground">
													{formatBytes(file.size)}
												</span>
											</div>
											{hoverIndex === index && (
												<div className="absolute inset-y-0 right-0 flex items-center pr-3">
													<Trash className="cursor-pointer" onClick={() => removeFile(index)} />
												</div>
											)}
										</div>
										<Separator className="my-2" />
									</div>
								))}
							</div>
						</ScrollArea>
					</div>
					<div className="flex space-x-4 items-center">
						<Button size="icon" onClick={openFileDialog}>
							<Upload className="h-[1.2rem] w-[1.2rem]"/>
						</Button>
						<div>
							<p>Add your files</p>
							<span className="text-xs text-muted-foreground">or drop them here</span>
						</div>
					</div>
				</div>
				<div className="w-1/2">
					<div className="flex justify-center items-center space-x-2">
						<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Info</h4>
						<span><Badge>optional</Badge></span>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="ripper"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ripper name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="uploader"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Uploader name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<LoadingButton isLoading={isSubmitting} text="Generate my Nfo" />
						</form>
					</Form>
				</div>
			</div>
		</div>
	)
};