import type { NoteType } from '../types/notes';

/**
 * Get the color classes for a note type badge
 */
export function getTypeColorClasses(type: NoteType): string {
  switch (type) {
    case 'todo':
      return 'bg-green-900/30 text-green-400 border-green-700/50';
    case 'snippet':
      return 'bg-purple-900/30 text-purple-400 border-purple-700/50';
    default:
      return 'bg-blue-900/30 text-blue-400 border-blue-700/50';
  }
}

/**
 * Get the color classes for active type buttons
 */
export function getTypeButtonClasses(type: NoteType, isActive: boolean): string {
  const baseClasses = 'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border';
  
  if (!isActive) {
    return `${baseClasses} bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700`;
  }

  switch (type) {
    case 'todo':
      return `${baseClasses} bg-green-900/30 text-green-400 border-green-700/50 shadow-md`;
    case 'snippet':
      return `${baseClasses} bg-purple-900/30 text-purple-400 border-purple-700/50 shadow-md`;
    default:
      return `${baseClasses} bg-blue-900/30 text-blue-400 border-blue-700/50 shadow-md`;
  }
}

