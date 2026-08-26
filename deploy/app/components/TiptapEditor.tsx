"use client";

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({
  content,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],

    content,

    editorProps: {
      attributes: {
        class:
          "min-h-[400px] border rounded-b-lg p-4 focus:outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (
      editor &&
      content !== editor.getHTML()
    ) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden bg-white">

      {/* Toolbar */}

      <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className={`px-3 py-1 rounded border ${
            editor.isActive("bold")
              ? "bg-black text-white"
              : ""
          }`}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={`px-3 py-1 rounded border ${
            editor.isActive("italic")
              ? "bg-black text-white"
              : ""
          }`}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          }
          className={`px-3 py-1 rounded border ${
            editor.isActive("heading", {
              level: 1,
            })
              ? "bg-black text-white"
              : ""
          }`}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          className={`px-3 py-1 rounded border ${
            editor.isActive("heading", {
              level: 2,
            })
              ? "bg-black text-white"
              : ""
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className={`px-3 py-1 rounded border ${
            editor.isActive("bulletList")
              ? "bg-black text-white"
              : ""
          }`}
        >
          Bullet List
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className={`px-3 py-1 rounded border ${
            editor.isActive("orderedList")
              ? "bg-black text-white"
              : ""
          }`}
        >
          Number List
        </button>

        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter URL");

            if (!url) return;

            editor
              .chain()
              .focus()
              .setLink({ href: url })
              .run();
          }}
          className="px-3 py-1 rounded border"
        >
          Link
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().unsetLink().run()
          }
          className="px-3 py-1 rounded border"
        >
          Remove Link
        </button>

      </div>

      {/* Editor */}

      <EditorContent editor={editor} />

    </div>
  );
}