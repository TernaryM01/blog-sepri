export interface TextSpan {
  text: string
  bold?: boolean
  italic?: boolean
}

export type TextAlignment = 'left' | 'center' | 'right'

export interface HeadingBlock {
  type: 'heading'
  level?: 1 | 2 | 3 | 4 | 5 | 6
  align?: TextAlignment
  text: string
}

export interface ParagraphBlock {
  type: 'paragraph'
  align?: TextAlignment
  spans?: TextSpan[]
  text?: string
}

export type BlogContentBlock = HeadingBlock | ParagraphBlock

export interface BlogPost {
  id: string
  title: string
  slug: string
  cover_image_url: string | null
  snippet: string
  content: BlogContentBlock[]
  created_at?: string
  updated_at?: string
}
