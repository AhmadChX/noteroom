import type { Note } from '../../types/notes';
import { formatRelativeDate } from '../../utils/date';
import { getTypeColorClasses } from '../../utils/colors';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

/**
 * NoteCard Component
 * 
 * Displays an individual note card in the grid layout.
 * Features:
 * - Shows note type badge, title (if present), and truncated content
 * - Displays tags, completion status (for todos), and relative date
 * - Provides edit and delete action buttons
 * - Uses flexbox layout for uniform card heights
 * - Shows gradient fade indicator when content is truncated
 */
export default function NoteCard({ note, onEdit, onDelete, onToggleComplete }: NoteCardProps) {
  // Check if content is likely truncated (roughly more than 8 lines of text)
  // Approximate: average line is ~50 characters, 8 lines = ~400 chars
  // Also checks for actual line breaks
  const estimatedLines = Math.ceil(note.content.length / 50);
  const isLongContent = estimatedLines > 8 || note.content.split('\n').length > 8;

  return (
    <div className={`bg-zinc-900 rounded-lg shadow-md border border-zinc-800 p-3 hover:shadow-lg hover:border-zinc-700 transition-all duration-200 transform hover:-translate-y-0.5 flex flex-col h-full w-full ${
      note.completed ? 'opacity-60' : ''
    }`}>
      {/* Card header with type badge and action buttons */}
      <div className="flex items-start justify-between mb-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getTypeColorClasses(note.type)}`}>
            {note.type}
          </span>
          {note.completed && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-zinc-800 text-zinc-400">
              Completed
            </span>
          )}
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={() => onEdit(note)}
            className="p-1 text-zinc-400 hover:text-blue-400 transition-colors rounded hover:bg-zinc-800"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 text-zinc-400 hover:text-red-400 transition-colors rounded hover:bg-zinc-800"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Optional title display */}
      {note.title && (
        <h3 className="font-semibold text-white mb-1.5 text-sm flex-shrink-0">{note.title}</h3>
      )}

      {/* Content area with truncation and gradient fade */}
      <div className="mb-2 flex-grow min-h-0 overflow-hidden relative">
        <p className="text-zinc-300 break-words text-sm line-clamp-8 leading-relaxed">
          {note.content}
        </p>
        {isLongContent && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Card footer with actions, tags, and date */}
      <div className="flex-shrink-0 space-y-1.5 mt-auto">
        {/* Todo completion toggle button */}
        {note.type === 'todo' && onToggleComplete && (
          <button
            onClick={() => onToggleComplete(note.id)}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
              note.completed
                ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                : 'bg-green-900/30 text-green-400 hover:bg-green-900/40 border border-green-700/50'
            }`}
          >
            {note.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
        )}

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-300 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="pt-1.5 border-t border-zinc-800">
          <span className="text-xs text-zinc-500">{formatRelativeDate(note.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

