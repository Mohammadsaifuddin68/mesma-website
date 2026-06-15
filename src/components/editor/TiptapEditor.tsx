"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import { uploadFile } from "@/lib/storage";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link2, Image as ImageIcon, Minus, Plus, Table as TableIcon, Undo, Redo,
  Highlighter, Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  CheckSquare, Video as YoutubeIcon, Maximize, Minimize, Eraser
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

const lowlight = createLowlight(all);

interface TiptapEditorProps {
  content: string;
  onChange: (value: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, disabled, children }: ToolbarButtonProps) {
  return (
    <button type="button" onClick={onClick} title={title} disabled={disabled}
      className={`p-2 rounded-lg transition-all ${
        active ? "bg-purple-500/20 text-purple-600 border border-purple-500/30" : 
        disabled ? "text-slate-400 opacity-50 cursor-not-allowed border border-transparent" :
        "text-slate-600 hover:bg-purple-100 hover:text-purple-900 border border-transparent"
      }`}>
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-slate-200 mx-0.5" />;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
      Youtube.configure({ inline: false, width: 800, height: 450 }),
      CharacterCount,
      CodeBlockLowlight.configure({ lowlight }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-purple-600 underline" } }),
      Image.configure({ HTMLAttributes: { class: "max-w-full rounded-xl my-4" }, allowBase64: true }),
      Placeholder.configure({ placeholder: "Start writing here…" }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-purple max-w-none focus:outline-none min-h-[400px] px-6 py-5 text-gray-900 leading-relaxed",
      },
      handleDrop: function(view, event, slice, moved) {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          let file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            uploadFile(file, 'blog-media').then(result => {
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              const node = schema.nodes.image.create({ src: result.url });
              if (coordinates) {
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              }
            }).catch(console.error);
            return true;
          }
        }
        return false;
      }
    },
    immediatelyRender: false,
  });

  if (!mounted) return null;
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const result = await uploadFile(file, 'blog-media');
          editor.chain().focus().setImage({ src: result.url }).run();
        } catch (err) {
          console.error('Image upload failed', err);
          alert('Image upload failed. Please try again.');
        }
      }
    };
    input.click();
  };

  const addYoutube = () => {
    const url = prompt('Enter YouTube URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className={`flex flex-col bg-white overflow-hidden transition-all duration-300 ${
      isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "border border-gray-200 rounded-2xl"
    }`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)"><Undo className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)"><Redo className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting"><Eraser className="w-4 h-4" /></ToolbarButton>
        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1 (Ctrl+Alt+1)"><Heading1 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2 (Ctrl+Alt+2)"><Heading2 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3 (Ctrl+Alt+3)"><Heading3 className="w-4 h-4" /></ToolbarButton>
        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)"><Bold className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)"><Italic className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)"><UnderlineIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough (Ctrl+Shift+X)"><Strikethrough className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} title="Subscript"><SubscriptIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Superscript"><SuperscriptIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline Code (Ctrl+E)"><Code className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight Text"><Highlighter className="w-4 h-4" /></ToolbarButton>
        
        <div className="flex items-center gap-1.5 ml-1">
          <input type="color" onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            className="w-6 h-6 rounded cursor-pointer bg-transparent border-none p-0" title="Text Color" />
        </div>
        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left (Ctrl+Shift+L)"><AlignLeft className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center (Ctrl+Shift+E)"><AlignCenter className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right (Ctrl+Shift+R)"><AlignRight className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify (Ctrl+Shift+J)"><AlignJustify className="w-4 h-4" /></ToolbarButton>
        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List (Ctrl+Shift+8)"><List className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List (Ctrl+Shift+7)"><ListOrdered className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Task List (Ctrl+Shift+9)"><CheckSquare className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote (Ctrl+Shift+B)"><Quote className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block (Ctrl+Alt+C)"><Code className="w-4 h-4" /></ToolbarButton>
        <Divider />

        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Insert Link"><Link2 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={addImage} title="Insert Image"><ImageIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={addYoutube} title="Insert YouTube Video"><YoutubeIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={addTable} title="Insert Table"><TableIcon className="w-4 h-4" /></ToolbarButton>

        {editor.isActive("table") && (
          <>
            <Divider />
            <div className="flex bg-purple-100 rounded-lg p-0.5 ml-1">
              <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row"><TableIcon className="w-4 h-4 rotate-90" /></ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column"><TableIcon className="w-4 h-4 rotate-180" /></ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row"><Minus className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column"><Minus className="w-4 h-4 rotate-90" /></ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().mergeCells().run()} title="Merge Cells"><Plus className="w-4 h-4" /></ToolbarButton>
            </div>
          </>
        )}

        <div className="flex-1" />
        <ToolbarButton onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <div className={`flex-1 overflow-y-auto bg-white ${isFullscreen ? "p-8" : ""}`}>
        <div className={isFullscreen ? "max-w-4xl mx-auto border border-gray-100 shadow-sm rounded-xl" : ""}>
          <EditorContent editor={editor} />
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <div>
          {editor.storage.characterCount.words()} words · {editor.storage.characterCount.characters()} characters
        </div>
        <div>
          Prose Editor
        </div>
      </div>
    </div>
  );
}
