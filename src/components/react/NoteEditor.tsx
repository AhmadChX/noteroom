import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Note, NoteType } from '../../types/notes';
import type { ToastData } from './ToastContainer';
import { storage } from '../../utils/storage';
import { getTypeButtonClasses } from '../../utils/colors';

interface NoteEditorProps {
  note: Note;
  onClose: () => void;
  onShowToast: (message: string, type?: ToastData['type']) => void;
}

/**
 * NoteEditor Component
 * 
 * Modal dialog for editing existing notes.
 * Features:
 * - Full editing capabilities (type, title, content, tags)
 * - Todo-specific completion checkbox
 * - Form validation (content is required)
 * - Saves changes to localStorage and shows success toast
 * - Transparent backdrop with blur effect
 */
export default function NoteEditor({ note, onClose, onShowToast }: NoteEditorProps) {
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title || '');
  const [type, setType] = useState<NoteType>(note.type);
  const [tags, setTags] = useState(note.tags?.join(', ') || '');
  const [completed, setCompleted] = useState(note.completed || false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handles form submission
   * Parses tags from comma-separated string, validates, and saves to storage
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // Parse tags from comma-separated string, trim whitespace, and filter empty values
      const tagArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      storage.update(note.id, {
        content,
        title: title || undefined,
        type,
        tags: tagArray.length > 0 ? tagArray : undefined,
        completed: type === 'todo' ? completed : undefined,
      });

      onShowToast('Note updated successfully!');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-zinc-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp border border-zinc-800">
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white">Edit Note</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded hover:bg-zinc-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Type
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setType('note')}
                className={getTypeButtonClasses('note', type === 'note')}
              >
                Note
              </button>
              <button
                type="button"
                onClick={() => setType('todo')}
                className={getTypeButtonClasses('todo', type === 'todo')}
              >
                Todo
              </button>
              <button
                type="button"
                onClick={() => setType('snippet')}
                className={getTypeButtonClasses('snippet', type === 'snippet')}
              >
                Snippet
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title..."
              className="w-full px-2.5 py-1.5 text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-zinc-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={type === 'snippet' ? 10 : 6}
              placeholder="Enter your note content..."
              className="w-full px-2.5 py-1.5 text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono placeholder-zinc-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, personal, ideas..."
              className="w-full px-2.5 py-1.5 text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-zinc-500"
            />
          </div>

          {type === 'todo' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="rounded w-4 h-4 accent-blue-500"
              />
              <label htmlFor="completed" className="ml-2 text-xs text-zinc-300">
                Mark as completed
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-zinc-300 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !content.trim()}
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md shadow-blue-500/20"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

