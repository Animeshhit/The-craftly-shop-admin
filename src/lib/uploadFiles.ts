// Import Firebase Storage types and utilities
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Dispatch } from "redux"; // For Redux, if using
import storage from "./firebase";

import { setProgress } from "../store/Slices/LoadingSlice";

// Type for file upload data
interface UploadedFileData {
  secure_url: string;
}

export const handleFileUpload = async (
  acceptedFiles: File[], // Type for accepted files
  dispatch: Dispatch // Redux Dispatch type
): Promise<string[]> => {
  try {
    // Create an array of promises to handle each file upload
    const uploaders: Promise<UploadedFileData>[] = acceptedFiles.map((file: File) => {
      // Create a storage reference for the file
      const storageRef = ref(storage, `uploads/${file.name}`);

      // Create the upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Return a new promise that resolves when the upload completes
      return new Promise<UploadedFileData>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Optional: Add progress tracking here if needed
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            // Reject the promise if an error occurs
            reject(error);
          },
          async () => {
            // On successful upload, get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ secure_url: downloadURL });
          }
        );
      });
    });

    // Optional: Set progress to 50% while the uploads are ongoing
    dispatch(setProgress(50));

    // Wait for all uploads to complete and gather their URLs
    const uploadedFilesData: UploadedFileData[] = await Promise.all(uploaders);

    // Optional: Update the progress to 80% after successful uploads
    dispatch(setProgress(80));

    // Map the uploaded data to retrieve only the URLs
    const uploadedUrls: string[] = uploadedFilesData.map(
      (uploaded) => uploaded.secure_url
    );

    console.log("Uploaded File URLs:", uploadedUrls);
    return uploadedUrls;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error; // Re-throw the error for further handling
  }
};
