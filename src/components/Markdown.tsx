import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface MarkDownValue {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const MarkdownEditor = (props: MarkDownValue) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Description
      </label>
      <ReactQuill
        value={props.value}
        onChange={props.setValue}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
          ],
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "image",
        ]}
        placeholder="Product Description"
        className="rounded h-[400px]"
      />
    </div>
  );
};

export default MarkdownEditor;
