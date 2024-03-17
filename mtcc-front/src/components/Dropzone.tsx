// Dropzone.tsx
import React from 'react';
import { FolderUp } from 'lucide-react';
import { getFilesFromDrop } from '@/lib/utils';
import { toast } from "sonner";
import { useHomeFileStore, useNfoFileStore } from '@/services/useFileStore';

type Props = {
  children: React.ReactNode; // React.ReactNode accepte tout ce qui est rendable
  fromNfo?: boolean;
  className?: string;
}

export const Dropzone: React.FC<Props> = ({ children, fromNfo = false, className = '' }) => {
  const [isDraggingOver, setIsDraggingOver] = React.useState<boolean>(false);
  const addHomeFiles = useHomeFileStore(state => state.addFiles);
  const addNfoFiles = useNfoFileStore(state => state.addFiles);
  let counter: number = 0;

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDraggingOver(false);
    // const files = await getFilesFromDrop(event.dataTransfer.items);
      // Here we make the promise call and manage the toast
    toast.promise(
      getFilesFromDrop(event.dataTransfer.items),
      {
        loading: 'Loading files...',
        // On success, we receive the files and pass them to addFiles
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

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();

    counter++;

    setIsDraggingOver(true);
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    counter--;

    if (counter === 1 || counter < 0) {
        setIsDraggingOver(false);
      counter = 0;
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
  }

  return (
    <div
      className={`dropzone ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {isDraggingOver && 
        <div className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50">
          <div className="flex justify-center items-center flex-col h-72">
            <FolderUp size={128} />
            <span>Drag and drop your album/single here</span>
          </div>
        </div>
      }
        {children}
    </div>
  );
};
