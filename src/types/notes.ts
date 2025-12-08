/**
 * Type definitions for the NoteRoom application
 */

/** Available note types */
export type NoteType = 'note' | 'todo' | 'snippet';

/**
 * Note interface representing a single note, todo, or snippet
 */
export interface Note {
  /** Unique identifier (UUID) */
  id: string;
  /** Type of note (note, todo, or snippet) */
  type: NoteType;
  /** Main content of the note */
  content: string;
  /** Timestamp when note was created (milliseconds since epoch) */
  createdAt: number;
  /** Timestamp when note was last updated (milliseconds since epoch) */
  updatedAt: number;
  /** Optional array of tags for categorization */
  tags?: string[];
  /** Completion status (only used for todos) */
  completed?: boolean;
  /** Optional title for better organization and quick identification */
  title?: string;
}

/**
 * Filter criteria for searching and filtering notes
 */
export interface NoteFilters {
  /** Search query string (searches content, title, and tags) */
  searchQuery: string;
  /** Filter by note type, or 'all' to show all types */
  typeFilter?: NoteType | 'all';
}

