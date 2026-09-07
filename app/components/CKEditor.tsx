"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Heading,
  Link,
  List,
  FontColor,
  Underline,
  FontBackgroundColor,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function CKEditorComponent({
  content,
  onChange,
}: Props) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        licenseKey: "GPL",
        plugins: [
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Heading,
          Link,
          Underline,
          List,
          FontColor,
  FontBackgroundColor,
        ],
        toolbar: [
          "heading",
      "|",
      "bold",
      "italic",
        "underline",
      "link",
    
      "|",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "undo",
      "redo"
        ],
      }}
      data={content}
      onChange={(_, editor) => {
        onChange(editor.getData());
      }}
    />
  );
}