import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// import { getFilesFromDirectory } from "./utils";

export const acceptedFileTypes = [
  "audio/flac",
  "audio/wav",
  "audio/mpeg",
  "image/jpeg",
  "image/png",
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFilesFromDrop = (items: DataTransferItemList): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    const files: File[] = [];
    const itemsLength = items.length;

    for (let i = 0; i < itemsLength; i++) {
      const item = items[i].webkitGetAsEntry();

      if (item) {
        if (item.isDirectory) {
          reject(new Error("You can't add folders, please import files directly."));
          return;
        } else {
          (item as FileSystemFileEntry).file(
            (file) => {
              if (!acceptedFileTypes.includes(file.type)) {
                reject(new Error(`The file type ${file.type} is not supported.`));
                return;
              }
              files.push(file);
              if (i === itemsLength - 1) {
                resolve(files);
              }
            },
            (error) => reject(error)
          );
        }
      } else {
        reject(new Error("Impossible to read the file."));
        return;
      }
    }
  });
};

export const getFilesFromInput = (files: FileList | null): Promise<File[]> => {
  if (!files) {
    return Promise.reject(new Error("No files provided."));
  }
  return new Promise((resolve, reject) => {
    const filesArray: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (!acceptedFileTypes.includes(files[i].type)) {
        reject(new Error(`The file type ${files[i].type} is not supported.`));
        return;
      }
      filesArray.push(files[i]);
      if (i === files.length - 1) {
        resolve(filesArray);
      }
    }
  });
}


export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
