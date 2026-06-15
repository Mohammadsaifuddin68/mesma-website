import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export interface UploadResult {
  url: string;
  path: string;
  name: string;
}

export async function uploadFile(
  file: File,
  folder: string = "blog-media",
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const timestamp = Date.now();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${folder}/${timestamp}_${safeFileName}`;
  const storageRef = ref(storage, path);

  // Always use resumable upload to ensure we get progress events

  // Use resumable upload with retry logic for larger files
  const MAX_RETRIES = 5;
  const BASE_DELAY_MS = 1000; // Base delay for exponential backoff


  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(progress);
          },
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url, path, name: file.name });
          }
        );
      });
    } catch (error) {
      if (attempt === MAX_RETRIES - 1) {
        throw error;
      }
      const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 200;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Upload failed after retries");
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export async function listFiles(folder: string = "blog-media"): Promise<{ name: string; path: string; url: string }[]> {
  const folderRef = ref(storage, folder);
  const result = await listAll(folderRef);
  const files = await Promise.all(
    result.items.map(async (item) => {
      const url = await getDownloadURL(item);
      return { name: item.name, path: item.fullPath, url };
    })
  );
  return files;
}
