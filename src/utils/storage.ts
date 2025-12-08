import type { Note, NoteFilters } from '../types/notes';

/**
 * Storage utility for managing notes in localStorage
 * 
 * All notes are stored as JSON in localStorage under the key 'noteroom-notes'.
 * This provides persistence across browser sessions.
 */

const STORAGE_KEY = 'noteroom-notes';

export const storage = {
  /**
   * Retrieves all notes from localStorage
   * @returns Array of all notes, or empty array if none exist or on error
   */
  getAll(): Note[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as Note[];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  /**
   * Saves all notes to localStorage
   * @param notes - Array of notes to save
   */
  saveAll(notes: Note[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Retrieves a single note by its ID
   * @param id - The unique identifier of the note
   * @returns The note if found, null otherwise
   */
  getById(id: string): Note | null {
    const notes = this.getAll();
    return notes.find(note => note.id === id) || null;
  },

  /**
   * Creates a new note with auto-generated ID and timestamps
   * @param note - Note data without id, createdAt, and updatedAt (these are auto-generated)
   * @returns The newly created note with all fields populated
   */
  create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const notes = this.getAll();
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes.push(newNote);
    this.saveAll(notes);
    return newNote;
  },

  /**
   * Updates an existing note
   * @param id - The unique identifier of the note to update
   * @param updates - Partial note object with fields to update (updatedAt is auto-set)
   * @returns The updated note if found, null otherwise
   */
  update(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null {
    const notes = this.getAll();
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) return null;

    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: Date.now(),
    };
    this.saveAll(notes);
    return notes[index];
  },

  /**
   * Deletes a note by ID
   * @param id - The unique identifier of the note to delete
   * @returns true if note was deleted, false if not found
   */
  delete(id: string): boolean {
    const notes = this.getAll();
    const filtered = notes.filter(note => note.id !== id);
    if (filtered.length === notes.length) return false;
    this.saveAll(filtered);
    return true;
  },

  /**
   * Filters notes based on search query and type filter
   * @param notes - Array of notes to filter
   * @param filters - Filter criteria (searchQuery and typeFilter)
   * @returns Filtered array of notes matching the criteria
   */
  filter(notes: Note[], filters: NoteFilters): Note[] {
    let filtered = [...notes];

    // Search query - matches against content, title, and tags
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(note => {
        const contentMatch = note.content.toLowerCase().includes(query);
        const titleMatch = note.title?.toLowerCase().includes(query);
        const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(query));
        return contentMatch || titleMatch || tagMatch;
      });
    }

    // Type filter - filter by note type (note, todo, snippet)
    if (filters.typeFilter && filters.typeFilter !== 'all') {
      filtered = filtered.filter(note => note.type === filters.typeFilter);
    }

    return filtered;
  },

};

