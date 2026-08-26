import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { BlogPost, BlogContentBlock } from '../../types/blog'
import { LexicalEditor } from './LexicalEditor'

interface PostEditorProps {
  postToEdit?: BlogPost | null
  onSaveSuccess: () => void
  onCancel: () => void
}

export function PostEditor({ postToEdit, onSaveSuccess, onCancel }: PostEditorProps) {
  const isEditing = !!postToEdit

  const [title, setTitle] = useState(postToEdit?.title || '')
  const [slug, setSlug] = useState(postToEdit?.slug || '')
  const [snippet, setSnippet] = useState(postToEdit?.snippet || '')
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(postToEdit?.cover_image_url || null)
  const [content, setContent] = useState<BlogContentBlock[]>(postToEdit?.content || [])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto generate slug from title if user hasn't manually edited slug
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!isEditing && (!slug || slug === generateSlug(title))) {
      setSlug(generateSlug(newTitle))
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Handle Cover Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const filePath = `covers/${fileName}`

      const { error: uploadErr } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadErr) {
        throw uploadErr
      }

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      setCoverImageUrl(urlData.publicUrl)
    } catch (err: unknown) {
      console.error('Image upload failed:', err)
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError('Failed to upload image: ' + msg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEditorChange = (blocks: BlogContentBlock[], firstParagraphText: string) => {
    setContent(blocks)
    // If snippet is empty, auto-populate from first paragraph
    if (!snippet && firstParagraphText) {
      setSnippet(firstParagraphText)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Please provide an article title.')
      return
    }
    if (!slug.trim()) {
      setError('Please provide a valid URL slug.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const finalSnippet = snippet.trim() || title.trim()

      const postPayload = {
        title: title.trim(),
        slug: slug.trim(),
        snippet: finalSnippet,
        cover_image_url: coverImageUrl,
        content: content.length > 0 ? content : [{ type: 'paragraph', text: finalSnippet }],
        updated_at: new Date().toISOString(),
      }

      if (isEditing && postToEdit) {
        const { error: updateErr } = await supabase
          .from('posts')
          .update(postPayload)
          .eq('id', postToEdit.id)

        if (updateErr) throw updateErr
      } else {
        const { error: insertErr } = await supabase
          .from('posts')
          .insert(postPayload)

        if (insertErr) throw insertErr
      }

      onSaveSuccess()
    } catch (err: unknown) {
      console.error('Error saving post:', err)
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError('Failed to save post: ' + msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-[880px] bg-[#fffcf5] border-[4px] border-[#3f2007] shadow-[10px_10px_0px_2px_rgba(0,0,0,0.25)] rounded-[28px] p-6 md:p-10 my-6">
      <div className="flex flex-row items-center justify-between border-b-2 border-[#3f2007]/20 pb-4 mb-6">
        <div>
          <h2 className="font-['Solway'] text-[28px] font-bold text-[#3f2007] m-0">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h2>
          <p className="font-['Solway'] text-[14px] text-[#6b4728] m-0 mt-1">
            Fill in the details below and compose your article
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="font-['Solway'] text-[14px] font-bold text-[#6b4728] hover:text-[#3f2007] px-3 py-1.5 rounded-lg border-2 border-[#3f2007]/30 hover:bg-black/5 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-[#ffdddd] border-2 border-[#d82b78] text-[#8a1f1f] p-3.5 rounded-xl font-['Solway'] text-[14px] mb-6 shadow-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <label className="block font-['Solway'] text-[15px] font-bold text-[#3f2007] mb-1.5">
            Article Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Rahasia Metamorfosis Serangga"
            className="w-full px-4 py-2.5 bg-white border-2 border-[#3f2007] rounded-xl font-['Solway'] text-[18px] text-black focus:outline-none focus:ring-2 focus:ring-[#fd7e1c]"
          />
        </div>

        {/* Slug & Snippet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-['Solway'] text-[14px] font-bold text-[#3f2007] mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. rahasia-metamorfosis"
              className="w-full px-4 py-2 bg-white border-2 border-[#3f2007] rounded-xl font-['Solway'] text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#fd7e1c]"
            />
          </div>

          <div>
            <label className="block font-['Solway'] text-[14px] font-bold text-[#3f2007] mb-1.5">
              Sticky Note Preview Snippet
            </label>
            <input
              type="text"
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              placeholder="Short teaser shown on the home page sticky notes"
              className="w-full px-4 py-2 bg-white border-2 border-[#3f2007] rounded-xl font-['Solway'] text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#fd7e1c]"
            />
          </div>
        </div>

        {/* Optional Cover Image */}
        <div>
          <label className="block font-['Solway'] text-[15px] font-bold text-[#3f2007] mb-1.5">
            Cover Image (Optional)
          </label>
          {coverImageUrl ? (
            <div className="relative w-full max-w-[420px] bg-[#fff3cf] border-2 border-[#3f2007] rounded-xl p-2 flex flex-col gap-2">
              <img
                src={coverImageUrl}
                alt="Cover Preview"
                className="w-full h-44 object-cover rounded-lg border border-[#3f2007]/30"
              />
              <div className="flex justify-between items-center px-1">
                <span className="text-xs text-[#6b4728] font-['Solway'] truncate max-w-[280px]">
                  {coverImageUrl}
                </span>
                <button
                  type="button"
                  onClick={() => setCoverImageUrl(null)}
                  className="text-xs font-bold text-red-700 hover:text-red-900 bg-red-100 px-2 py-1 rounded cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#3f2007]/50 rounded-xl p-6 text-center bg-white/60 hover:bg-white transition-colors">
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <label
                htmlFor="cover-upload"
                className="cursor-pointer inline-flex flex-col items-center gap-1 font-['Solway']"
              >
                <span className="text-2xl">📷</span>
                <span className="font-bold text-[#3f2007] text-[15px]">
                  {uploadingImage ? 'Uploading image...' : 'Click to upload a cover image'}
                </span>
                <span className="text-xs text-gray-500">PNG, JPG, WEBP or GIF</span>
              </label>
            </div>
          )}
        </div>

        {/* Lexical WYSIWYG Editor */}
        <div>
          <label className="block font-['Solway'] text-[15px] font-bold text-[#3f2007] mb-1.5">
            Article Content (WYSIWYG Editor) *
          </label>
          <LexicalEditor
            initialContent={postToEdit?.content}
            onChange={handleEditorChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-end gap-3 pt-4 border-t-2 border-[#3f2007]/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 font-['Solway'] font-bold text-[16px] text-[#3f2007] bg-white border-2 border-[#3f2007] rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="px-8 py-2.5 font-['Solway'] font-bold text-[16px] text-white bg-[#fd7e1c] border-[3px] border-[#3f2007] shadow-[4px_4px_0px_1px_rgba(0,0,0,0.25)] rounded-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  )
}
