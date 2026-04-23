"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";
import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#7B6FFF] underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl my-4" },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: { class: "rounded-xl my-4" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Агуулгаа энд бичнэ үү...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm sm:prose-base max-w-none min-h-[300px] px-4 py-3 focus:outline-none " +
          "prose-headings:font-syne prose-headings:tracking-tight " +
          "prose-p:text-white/80 prose-p:leading-relaxed " +
          "prose-strong:text-white prose-li:text-white/80 " +
          "prose-a:text-[#7B6FFF] prose-a:no-underline hover:prose-a:underline " +
          "prose-code:text-[#00E5B8] prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/[0.06] " +
          "prose-img:rounded-xl prose-blockquote:border-l-[#7B6FFF]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload алдаа");
      editor?.chain().focus().setImage({ src: data.url }).run();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleAddLink() {
    const url = prompt("URL оруулна уу:");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function handleAddYoutube() {
    const url = prompt("YouTube URL:");
    if (!url) return;
    editor?.commands.setYoutubeVideo({ src: url });
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] focus-within:border-[#7B6FFF40]">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.06] p-1.5">
        <TB editor={editor} cmd={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={14} />
        </TB>
        <TB editor={editor} cmd={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={14} />
        </TB>
        <TB editor={editor} cmd={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
          <Strikethrough size={14} />
        </TB>
        <Divider />
        <TB editor={editor} cmd={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <Heading2 size={14} />
        </TB>
        <TB editor={editor} cmd={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <Heading3 size={14} />
        </TB>
        <Divider />
        <TB editor={editor} cmd={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List size={14} />
        </TB>
        <TB editor={editor} cmd={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered size={14} />
        </TB>
        <TB editor={editor} cmd={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quote size={14} />
        </TB>
        <TB editor={editor} cmd={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
          <Code size={14} />
        </TB>
        <Divider />
        <TB editor={editor} cmd={handleAddLink} active={editor.isActive("link")}>
          <LinkIcon size={14} />
        </TB>
        <TB editor={editor} cmd={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
        </TB>
        <TB editor={editor} cmd={handleAddYoutube}>
          <YoutubeIcon size={14} />
        </TB>
        <Divider />
        <TB editor={editor} cmd={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 size={14} />
        </TB>
        <TB editor={editor} cmd={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 size={14} />
        </TB>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />

      <EditorContent editor={editor} />
    </div>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-white/[0.08]" />;
}

function TB({
  cmd,
  active,
  disabled,
  children,
}: {
  editor: Editor;
  cmd: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={cmd}
      disabled={disabled}
      className={`rounded-md p-1.5 transition-all ${
        active
          ? "bg-[#7B6FFF20] text-[#9F98FF]"
          : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  );
}
