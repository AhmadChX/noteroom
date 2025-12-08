import { useState, useRef, useEffect } from 'react';
import type { NoteType } from '../../types/notes';
import type { FormEvent } from 'react';
import { getTypeButtonClasses } from '../../utils/colors';

interface NoteCaptureProps {
  onNoteCreate: (type: NoteType, content: string, title?: string) => void;
}

/**
 * NoteCapture Component
 * 
 * Provides a quick capture interface for creating new notes, todos, and snippets.
 * Features:
 * - Type selection buttons (Note, Todo, Snippet)
 * - Optional title input field
 * - Content textarea with auto-focus
 * - Keyboard shortcut support (Ctrl/Cmd + Enter to save)
 * - Character count display
 */
export default function NoteCapture({ onNoteCreate }: NoteCaptureProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<NoteType>('note');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  /**
   * Handles form submission
   * Validates content is not empty, then creates the note and resets the form
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content.trim()) {
      onNoteCreate(type, content.trim(), title.trim() || undefined);
      setContent('');
      setTitle('');
      // Refocus textarea after saving for quick consecutive note creation
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  /**
   * Handles keyboard shortcuts
   * Ctrl/Cmd + Enter submits the form
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const characterCount = content.length;

  return (
    <div className="bg-zinc-900 rounded-lg shadow-md p-3 border border-zinc-800 transition-all duration-200 hover:shadow-lg hover:border-zinc-700">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Type selection buttons */}
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
        
        {/* Optional title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-zinc-500"
        />
        
        {/* Content textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your note here... (Ctrl/Cmd + Enter to save)"
          rows={4}
          className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder-zinc-500"
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Ctrl/Cmd + Enter to save</span>
            {characterCount > 0 && (
              <span className="text-xs text-zinc-500">
                {characterCount} {characterCount === 1 ? 'character' : 'characters'}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md shadow-blue-500/20"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

