"use client";

import { ModeToggle } from "@/components/ui/mode-toggle"
import { Separator } from "@/components/ui/separator"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronRight, Github, Settings, Upload } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useRef, useState, useEffect } from "react";
import { resolve } from "path";
import { ScrollArea } from "@/components/ui/scroll-area";
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      webkitdirectory?: string;
  }
}

export default function Page() {

  type UploadedFile = {
    id: number;
    name: string;
    size: number;
    type: string;
  };

  const [fileList, setFileList] = useState<UploadedFile[]>();
  // const [fileDrop, setFileDrop] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      console.log(files[i])

      formData.append('files', files[i]);
      fileList?.push({
        id: i,
        name: files[i].name,
        size: files[i].size,
        type: files[i].type
      })
    }

    // setFileList(files);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/uploads', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
      } else {
        console.error('Server Error:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      let items = event.dataTransfer.items;

      for (let i = 0; i < items.length; i++) {
        // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
        const item: FileSystemEntry | null = items[i].webkitGetAsEntry();

        if (item) {
          const formData = new FormData();
          if (item.isDirectory) {
            const directoryReader = (item as FileSystemDirectoryEntry).createReader();
            directoryReader.readEntries(async (entries: any) => {
              const filePromises = entries.map((entry: FileSystemEntry) => 
                new Promise((resolve, reject) => {
                  if (entry.isDirectory) {
                      reject(null);
                  }
                  (entry as FileSystemFileEntry).file((file) => {
                      resolve(file);
                  });
                })
              );
              const files: File[] = await Promise.all(filePromises);
              if (files) {
                const newFiles: UploadedFile[] = [];
                for (let i = 0; i < files.length; i++) {
                  newFiles.push({
                    id: i,
                    name: files[i].name,
                    size: files[i].size,
                    type: files[i].type
                  });
                  formData.append('files', files[i]);
                }
                setFileList((prevFile: UploadedFile[] | undefined) => {
                  if (prevFile) {
                    return [...prevFile, ...newFiles];
                  } else {
                    return newFiles;
                  }
                });
              }
              // setFileList(files);
              // try {
              //   console.log(formData.getAll('files'))
              //   const response = await fetch('http://127.0.0.1:8000/api/uploads', {
              //     method: 'POST',
              //     body: formData
              //   });

              //   if (!response.ok) {
              //     throw new Error('Failed to submit the data. Please try again.')
              //   }
  
              //   const data = await response.json();
              //   console.log('Success:', data);
              // } catch (error: any) {
              //   setError(error.message)
              //   console.error('Error:', error);
              // } finally {
              //   setIsLoading(false)
              // }
            });
            break;
          } else {
            // need implement iter file here before send to server
            if (item.isFile) {
              (item as FileSystemFileEntry).file(async (file) => {
                console.log(file)
                fileList?.push({
                  id: i,
                  name: file.name,
                  size: file.size,
                  type: file.type
                })
                formData.append('file', file);
                try {
                  console.log(formData.getAll('files'))
                  const response = await fetch('http://127.0.0.1:8000/api/upload/file', {
                    method: 'POST',
                    body: formData
                  });

                  if (!response.ok) {
                    throw new Error('Failed to submit the data. Please try again.')
                  }
    
                  const data = await response.json();
                  console.log('Success:', data);
                } catch (error: any) {
                  setError(error.message)
                  console.error('Error:', error);
                } finally {
                  setIsLoading(false)
                }
              });
            }
          }
        }
      }
    },
  []);

  return (
    <>
      <header className="m-2">  
        <div className="flex items-center container">
          <nav className="flex items-center space-x-6 mr-4">
            <div className="">
              <Link className="flex items-center space-x-2" href="/">
                <Image
                    src="/mtcc.svg"
                    alt="Go to Homepage"
                    width={24}
                    height={24}
                    priority
                />
                <span className="font-bold">mtcc</span>
              </Link>
            </div>
            <Link className="relative after:bg-[#8C52FF] after:absolute after:h-0.5 after:rounded after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-700 cursor-pointer" href="/">mtcc <span className="text-[#8C52FF]">PRES</span></Link>
            <Link className="relative after:bg-[#8C52FF] after:absolute after:h-0.5 after:rounded after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-700 cursor-pointer" href="/">mtcc <span className="text-[#8C52FF]">Nfo Builder</span></Link>
            <Link className="relative after:bg-[#8C52FF] after:absolute after:h-0.5 after:rounded after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-700 cursor-pointer" href="/">About</Link>
          </nav>
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <Sheet>
              <SheetTrigger><Settings className="h-[1.2rem] w-[1.2rem]" /></SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <a target="_blank" rel="noopener" href="https://github.com/GuiEpi/mtcc">
              <Button variant="outline" size="icon">
                <Github className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </a>
            <ModeToggle />
          </div>
        </div>
      </header>
      <Separator />
      <div id="main" className="h-full">
        <div className="flex justify-center text-center h-full">
          <div className="flex items-center justify-center w-full">
            <div
              onDragEnter={e => console.log('onDragEnter')}
              onDragLeave={e => console.log('onDragLeave')}
              onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
              onDrop={handleDrop}
              className="h-1/2 w-1/4 border-2 border-[#8C52FF] border-dotted rounded"
            >
              {fileList && !isLoading && (
                <ScrollArea className="h-72 w-48 rounded-md border">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                    {fileList.map((file) => (
                      <>
                        <div key={file.id} className="text-sm">
                          {file.name}
                        </div>
                        <Separator className="my-2" />
                      </>
                    ))}
                  </div>
                </ScrollArea>
              )}
              <div className="h-full flex flex-col justify-center">
                {isLoading && <p>Loading...</p>}
                {!fileList && !isLoading && (
                  <>
                    <input
                      className="hidden"
                      ref={inputRef}
                      type="file"
                      onChange={handleFileChange}
                      webkitdirectory=""
                      multiple
                    />
                    {error && <span className="text-red-500 mb-10 text-xs">Error: Try to re-upload your album</span>}
                    <div>
                      <Button className="mb-10" onClick={handleClick} size="icon">
                        <Upload className="h-4 w-4"/>
                      </Button> 
                    </div>
                    <p className="">Click to add your album/single</p>
                    <span className="text-xs text-muted-foreground">or drop them here</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <form action="">
          <input type="file" id="filepicker" name="fileList" webkitdirectory="true" multiple />
          <ul id="listing"></ul>
        </form>
      </div> */}
      <Separator />
      <footer className="">
        <div className="flex items-center justify-center flex-col">
          <p>Made with 💜 by GuiEpi</p>
          <Link className="flex items-center space-x-2" href="/">
            <Image
                src="/mtcc.svg"
                alt="Go to Homepage"
                width={24}
                height={24}
                priority
            />
            © 2023 <span className="font-bold">mtcc</span>
          </Link>
        </div>
      </footer>
    </>
    
  )
}

function traverseFileTree(arg0: FileSystemEntry, arg1: string) {
  throw new Error("Function not implemented.");
}
