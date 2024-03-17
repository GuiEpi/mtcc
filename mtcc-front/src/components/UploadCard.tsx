declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      webkitdirectory?: string;
  }
}
import { Upload } from "lucide-react"
import { getFilesFromInput } from '@/lib/utils';
import { Button } from "./ui/button"
import { useRef } from "react";
import { PreviewUploadCardHome } from "./PreviewUploadCardHome";
import { PreviewUploadCardNfo } from "./PreviewUploadCardNfo";
import { useHomeFileStore, useNfoFileStore } from "@/services/useFileStore";
import { toast } from "sonner"

type Props = {
  fromNfo?: boolean;
}
 
export const UploadCard: React.FC<Props> = ({fromNfo = false}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { homeFiles, addHomeFiles } = useHomeFileStore((state) => ({
    homeFiles: state.files,
    addHomeFiles: state.addFiles,
  }));

  const { nfoFiles, addNfoFiles } = useNfoFileStore((state) => ({
    nfoFiles: state.files,
    addNfoFiles: state.addFiles,
  }));


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    toast.promise(
      getFilesFromInput(event.target.files),
      {
        loading: 'Loading files...',
        success: (files: File[]) => {
          if (fromNfo) {
            addNfoFiles(files);
          } else {
            addHomeFiles(files);
          }
          return `Successfully loaded ${files.length} file(s)`; // Return the success message for the toast
        },
        error: (err) => `${err.toString()}`,
      },
    );
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  if (nfoFiles.length > 0 && fromNfo) {
    return (
      <PreviewUploadCardNfo />
    )    
  } else if (homeFiles.length > 0 && !fromNfo) {
    return (
      <PreviewUploadCardHome />
    )
  } else {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col justify-center items-center h-full w-11/12 lg:w-1/4 border border-[#8C52FF] rounded">
          <input
            className="hidden"
            ref={inputRef}
            type="file"
            onChange={handleFileChange}
            webkitdirectory=""
            multiple
          />
          <div>
            <Button className="mb-10" size="icon" onClick={openFileDialog}>
              <Upload className="h-[1.2rem] w-[1.2rem]"/>
            </Button> 
          </div>
          <p className="leading-7 [&:not(:first-child)]:mt-6">Click to add your album/single</p>
          <span className="text-xs text-muted-foreground">or drop them here</span>
        </div>
      </div>
    );
  }
};