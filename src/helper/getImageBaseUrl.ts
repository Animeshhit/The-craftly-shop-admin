import React from "react";

const getImageBaseUrl = (
  image: File[],
  setPreview: React.Dispatch<
    React.SetStateAction<ArrayBuffer[] | string[] | [] | null>
  >
) => {
  setPreview([]);
  let file = new FileReader();
  file.onload = function () {
    setPreview((prevPreview: any) => {
      if (Array.isArray(prevPreview)) {
        return [...prevPreview, file.result];
      }
      return [file.result];
    });
  };
  file.readAsDataURL(image[0]);
};

export default getImageBaseUrl;
