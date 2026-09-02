import { useEffect, useState, useCallback, useRef } from 'react'
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  $createLineBreakNode,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ParagraphNode,
  TextNode,
  type EditorState,
  type LexicalEditor as LexicalEditorType,
} from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { HeadingNode, $createHeadingNode, $isHeadingNode, type HeadingTagType } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import type { BlogContentBlock, TextSpan } from '../../types/blog'

interface ToolbarProps {
  editor: LexicalEditorType
}

function ToolbarPlugin({ editor }: ToolbarProps) {
  const [blockType, setBlockType] = useState<'paragraph' | 'h1' | 'h2' | 'h3'>('paragraph')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))

      const anchorNode = selection.anchor.getNode()
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()

      if ($isHeadingNode(element)) {
        const tag = element.getTag()
        if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
          setBlockType(tag)
        }
      } else {
        setBlockType('paragraph')
      }
    }
  }, [])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, updateToolbar])

  const formatHeading = (headingTag: HeadingTagType) => {
    if (blockType !== headingTag) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingTag))
        }
      })
      setBlockType(headingTag as 'h1' | 'h2' | 'h3')
    }
  }

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode())
        }
      })
      setBlockType('paragraph')
    }
  }

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1.5 p-2 bg-[#ffea9f] border-b-[3px] border-[#3f2007] select-none">
      {/* Block format dropdown / buttons */}
      <div className="flex items-center gap-1 bg-white/70 p-1 rounded-lg border border-[#3f2007]/30 mr-2">
        <button
          type="button"
          onClick={formatParagraph}
          className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
            blockType === 'paragraph'
              ? 'bg-[#3f2007] text-white'
              : 'text-[#3f2007] hover:bg-white'
          }`}
        >
          Paragraph
        </button>
        <button
          type="button"
          onClick={() => formatHeading('h1')}
          className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
            blockType === 'h1'
              ? 'bg-[#3f2007] text-white'
              : 'text-[#3f2007] hover:bg-white'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => formatHeading('h2')}
          className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
            blockType === 'h2'
              ? 'bg-[#3f2007] text-white'
              : 'text-[#3f2007] hover:bg-white'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatHeading('h3')}
          className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
            blockType === 'h3'
              ? 'bg-[#3f2007] text-white'
              : 'text-[#3f2007] hover:bg-white'
          }`}
        >
          H3
        </button>
      </div>

      {/* Bold & Italic */}
      <div className="flex items-center gap-1 bg-white/70 p-1 rounded-lg border border-[#3f2007]/30 mr-2">
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          className={`w-7 h-7 flex items-center justify-center font-bold text-sm rounded cursor-pointer transition-colors ${
            isBold ? 'bg-[#3f2007] text-white' : 'text-[#3f2007] hover:bg-white'
          }`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          className={`w-7 h-7 flex items-center justify-center italic font-serif text-sm rounded cursor-pointer transition-colors ${
            isItalic ? 'bg-[#3f2007] text-white' : 'text-[#3f2007] hover:bg-white'
          }`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>
      </div>

      {/* Text Alignments */}
      <div className="flex items-center gap-1 bg-white/70 p-1 rounded-lg border border-[#3f2007]/30 mr-2">
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
          className="px-2 py-1 text-xs font-medium text-[#3f2007] hover:bg-white rounded cursor-pointer"
          title="Align Left"
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
          className="px-2 py-1 text-xs font-medium text-[#3f2007] hover:bg-white rounded cursor-pointer"
          title="Align Center"
        >
          Center
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
          className="px-2 py-1 text-xs font-medium text-[#3f2007] hover:bg-white rounded cursor-pointer"
          title="Align Right"
        >
          Right
        </button>
      </div>

      {/* Undo / Redo */}
      <div className="flex items-center gap-1 bg-white/70 p-1 rounded-lg border border-[#3f2007]/30 ml-auto">
        <button
          type="button"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className="px-2 py-1 text-xs font-medium text-[#3f2007] hover:bg-white rounded cursor-pointer"
          title="Undo"
        >
          ↺ Undo
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className="px-2 py-1 text-xs font-medium text-[#3f2007] hover:bg-white rounded cursor-pointer"
          title="Redo"
        >
          ↻ Redo
        </button>
      </div>
    </div>
  )
}

function InitialContentPlugin({ initialBlocks }: { initialBlocks?: BlogContentBlock[] }) {
  const [editor] = useLexicalComposerContext()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current || !initialBlocks || initialBlocks.length === 0) return
    initializedRef.current = true

    editor.update(() => {
      const root = $getRoot()
      root.clear()

      for (const block of initialBlocks) {
        if (block.type === 'heading') {
          const levelTag = ('h' + (block.level || 2)) as HeadingTagType
          const headingNode = $createHeadingNode(levelTag)
          if (block.align) {
            headingNode.setFormat(block.align)
          }
          headingNode.append($createTextNode(block.text || ''))
          root.append(headingNode)
        } else if (block.type === 'paragraph') {
          const pNode = $createParagraphNode()
          if (block.align) {
            pNode.setFormat(block.align)
          }

          if (block.spans && block.spans.length > 0) {
            for (const span of block.spans) {
              const normalizedText = span.text.replace(/\r\n/g, '\n')
              if (normalizedText === '\n') {
                pNode.append($createLineBreakNode())
              } else if (normalizedText.includes('\n')) {
                const parts = normalizedText.split('\n')
                parts.forEach((part, pIdx) => {
                  if (pIdx > 0) {
                    pNode.append($createLineBreakNode())
                  }
                  if (part) {
                    const tNode = $createTextNode(part)
                    if (span.bold) tNode.toggleFormat('bold')
                    if (span.italic) tNode.toggleFormat('italic')
                    pNode.append(tNode)
                  }
                })
              } else {
                const tNode = $createTextNode(span.text)
                if (span.bold) tNode.toggleFormat('bold')
                if (span.italic) tNode.toggleFormat('italic')
                pNode.append(tNode)
              }
            }
          } else if (block.text) {
            const normalizedText = block.text.replace(/\r\n/g, '\n')
            if (normalizedText.includes('\n')) {
              const parts = normalizedText.split('\n')
              parts.forEach((part, pIdx) => {
                if (pIdx > 0) {
                  pNode.append($createLineBreakNode())
                }
                if (part) {
                  pNode.append($createTextNode(part))
                }
              })
            } else {
              pNode.append($createTextNode(block.text))
            }
          }

          root.append(pNode)
        }
      }
    })
  }, [editor, initialBlocks])

  return null
}

function ToolbarWrapper() {
  const [editor] = useLexicalComposerContext()
  return <ToolbarPlugin editor={editor} />
}

interface LexicalEditorProps {
  initialContent?: BlogContentBlock[]
  onChange: (blocks: BlogContentBlock[], plainSnippet: string) => void
}

export function LexicalEditor({ initialContent, onChange }: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'SepriBlogEditor',
    theme: {
      paragraph: 'my-2 leading-relaxed text-[#2c1d11]',
      heading: {
        h1: 'text-3xl font-bold my-4 text-[#3f2007]',
        h2: 'text-2xl font-bold my-3 pb-1 border-b border-[#3f2007]/20 text-[#3f2007]',
        h3: 'text-xl font-bold my-2 text-[#5c300c]',
      },
      text: {
        bold: 'font-bold',
        italic: 'italic',
      },
    },
    nodes: [HeadingNode, ParagraphNode, TextNode],
    onError: (error: Error) => {
      console.error('Lexical Error:', error)
    },
  }

  const handleEditorChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot()
      const children = root.getChildren()
      const blocks: BlogContentBlock[] = []
      let firstParagraphText = ''

      for (const node of children) {
        if ($isHeadingNode(node)) {
          const tag = node.getTag()
          const levelNum = parseInt(tag.replace('h', '')) || 2
          const level = (levelNum >= 1 && levelNum <= 6 ? levelNum : 2) as 1 | 2 | 3 | 4 | 5 | 6
          const alignType = node.getFormatType()
          const align = alignType === 'center' || alignType === 'right' ? alignType : 'left'
          blocks.push({
            type: 'heading',
            level,
            align,
            text: node.getTextContent(),
          })
        } else if ($isElementNode(node)) {
          const alignType = node.getFormatType()
          const align = alignType === 'center' || alignType === 'right' ? alignType : 'left'
          const textChildren = node.getChildren()
          const spans: TextSpan[] = textChildren.map((child) => {
            const isBold = $isTextNode(child) ? child.hasFormat('bold') : false
            const isItalic = $isTextNode(child) ? child.hasFormat('italic') : false
            return {
              text: child.getTextContent(),
              bold: isBold,
              italic: isItalic,
            }
          })

          const textContent = node.getTextContent()
          if (!firstParagraphText && textContent.trim()) {
            firstParagraphText = textContent.trim()
          }

          blocks.push({
            type: 'paragraph',
            align,
            spans: spans.length > 0 ? spans : [{ text: textContent }],
            text: textContent,
          })
        }
      }

      onChange(blocks, firstParagraphText)
    })
  }

  return (
    <div className="w-full bg-[#fffcf5] border-[3px] border-[#3f2007] rounded-xl shadow-[4px_4px_0px_1px_rgba(0,0,0,0.2)] overflow-clip">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarWrapper />
        <InitialContentPlugin initialBlocks={initialContent} />
        <div className="relative min-h-[260px] p-4 font-['Solway'] text-[17px] text-[#2c1d11] focus:outline-none">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[240px] focus:outline-none" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none font-['Solway']">
                Write your article here...
              </div>
            }
            ErrorBoundary={({ children }) => <>{children}</>}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
      </LexicalComposer>
    </div>
  )
}
