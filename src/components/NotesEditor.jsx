import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { marked } from 'marked'
import { useEffect, useRef } from 'react'

// Configure marked: GitHub-flavored markdown, no auto line-break on single newline
marked.use({ gfm: true, breaks: false })

// Detect markdown patterns: bold, italic, headings, code fences, bullets, blockquotes
function isMarkdown(text) {
  return /(\*\*[\s\S]+?\*\*|\*[\s\S]+?\*|^#{1,6}\s|```[\s\S]*?```|`[^`]+`|^\s*[-*+]\s|\d+\.\s|^>\s|^---$)/m.test(text)
}

function Sep() {
  return <span className="w-px h-3.5 shrink-0 mx-0.5 inline-block" style={{ background: 'rgba(255,255,255,0.08)' }} />
}

function Btn({ title, active, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className="px-1.5 py-0.5 rounded text-[11px] font-medium transition-all min-w-[20px] text-center leading-tight"
      style={{
        background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.35)',
        border: active ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
      }}
    >
      {children}
    </button>
  )
}

export default function NotesEditor({ initialContent, onChange }) {
  const editorRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Key points to remember, things to improve, what you got right or wrong…',
      }),
    ],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
    editorProps: {
      handlePaste(view, event) {
        const text  = event.clipboardData?.getData('text/plain') || ''
        const html  = event.clipboardData?.getData('text/html')  || ''

        // Clipboard already has rich HTML formatting (copied from a browser page) — let Tiptap handle it
        const hasRichHTML = /<(strong|em|b|i|ul|ol|h[1-6]|pre|blockquote|code|a\s)[\s>]/i.test(html)
        if (hasRichHTML) return false

        // Plain text with markdown syntax → parse and insert as formatted HTML
        if (text && isMarkdown(text)) {
          const parsed = marked.parse(text)
          editorRef.current?.commands.insertContent(parsed)
          return true
        }

        return false // plain text, no markdown — default paste
      },
    },
  })

  // Keep ref in sync so the paste handler always has the latest editor instance
  useEffect(() => { editorRef.current = editor }, [editor])

  if (!editor) return null

  const go = () => editor.chain().focus()
  const is = (name, attrs) => editor.isActive(name, attrs)

  return (
    <div
      className="rounded-xl overflow-hidden"
      onClick={e => e.stopPropagation()}
      style={{
        background: 'rgba(250,204,21,0.02)',
        border: '1px solid rgba(250,204,21,0.15)',
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center flex-wrap gap-0.5 px-2 py-1.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}
      >
        <Btn title="Bold (⌘B)" active={is('bold')} onClick={() => go().toggleBold().run()}>
          <strong>B</strong>
        </Btn>
        <Btn title="Italic (⌘I)" active={is('italic')} onClick={() => go().toggleItalic().run()}>
          <em>I</em>
        </Btn>
        <Btn title="Strikethrough" active={is('strike')} onClick={() => go().toggleStrike().run()}>
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </Btn>

        <Sep />

        <Btn title="Heading 1" active={is('heading', { level: 1 })} onClick={() => go().toggleHeading({ level: 1 }).run()}>H1</Btn>
        <Btn title="Heading 2" active={is('heading', { level: 2 })} onClick={() => go().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn title="Heading 3" active={is('heading', { level: 3 })} onClick={() => go().toggleHeading({ level: 3 }).run()}>H3</Btn>

        <Sep />

        <Btn title="Bullet list" active={is('bulletList')} onClick={() => go().toggleBulletList().run()}>• —</Btn>
        <Btn title="Numbered list" active={is('orderedList')} onClick={() => go().toggleOrderedList().run()}>1.</Btn>

        <Sep />

        <Btn title="Inline code" active={is('code')} onClick={() => go().toggleCode().run()}>`</Btn>
        <Btn title="Code block" active={is('codeBlock')} onClick={() => go().toggleCodeBlock().run()}>```</Btn>

        <Sep />

        <Btn title="Blockquote" active={is('blockquote')} onClick={() => go().toggleBlockquote().run()}>"</Btn>
      </div>

      {/* Editable area */}
      <EditorContent editor={editor} />
    </div>
  )
}
