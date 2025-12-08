import { useState, useEffect } from "react";
import type { Note, NoteFilters } from "../../types/notes";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import DeleteConfirmation from "./DeleteConfirmation";
import type { ToastData } from "./ToastContainer";
import { storage } from "../../utils/storage";

interface NoteListProps {
	filters: NoteFilters;
	onNoteUpdate: () => void;
	onShowToast: (message: string, type?: ToastData["type"]) => void;
}

/**
 * NoteList Component
 *
 * Manages and displays the grid of note cards.
 * Responsibilities:
 * - Loads notes from storage on mount
 * - Filters and sorts notes based on search query and type filter
 * - Handles note editing, deletion, and todo completion
 * - Shows empty state when no notes match filters
 * - Manages modal states for editor and delete confirmation
 */
export default function NoteList({
	filters,
	onNoteUpdate,
	onShowToast,
}: NoteListProps) {
	const [notes, setNotes] = useState<Note[]>([]);
	const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
	const [editingNote, setEditingNote] = useState<Note | null>(null);
	const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

	// Load notes from storage on component mount
	useEffect(() => {
		loadNotes();
	}, []);

	// Filter and sort notes whenever notes or filters change
	useEffect(() => {
		const filtered = storage.filter(notes, filters);
		// Sort by updatedAt descending (newest first)
		const sorted = filtered.sort((a, b) => b.updatedAt - a.updatedAt);
		setFilteredNotes(sorted);
	}, [notes, filters]);

	const loadNotes = () => {
		const allNotes = storage.getAll();
		setNotes(allNotes);
	};

	const handleDeleteClick = (note: Note) => {
		setNoteToDelete(note);
	};

	const handleDeleteConfirm = () => {
		if (noteToDelete) {
			storage.delete(noteToDelete.id);
			onShowToast("Note deleted successfully");
			loadNotes();
			onNoteUpdate();
			setNoteToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setNoteToDelete(null);
	};

	const handleToggleComplete = (id: string) => {
		const note = storage.getById(id);
		if (note) {
			const newCompleted = !note.completed;
			storage.update(id, { completed: newCompleted });
			onShowToast(
				newCompleted ? "Todo marked as complete!" : "Todo marked as incomplete",
			);
			loadNotes();
			onNoteUpdate();
		}
	};

	const handleEdit = (note: Note) => {
		setEditingNote(note);
	};

	const handleEditClose = () => {
		setEditingNote(null);
		loadNotes();
		onNoteUpdate();
	};

	if (filteredNotes.length === 0) {
		return (
			<div className="text-center py-12 animate-fadeIn">
				<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 mb-3">
					<svg
						className="h-6 w-6 text-zinc-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<h3 className="mt-2 text-base font-semibold text-white">
					No notes found
				</h3>
				<p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
					{notes.length === 0
						? "Get started by creating your first note above! Use Ctrl/Cmd + Enter to save quickly."
						: "Update your search or filters to find what you need."}
				</p>
				{notes.length === 0 && (
					<div className="mt-4 text-xs text-zinc-500 space-y-1">
						<p>💡 Tip: Select a type (Note, Todo, or Snippet) before typing</p>
						<p>⌨️ Keyboard shortcut: Ctrl/Cmd + Enter to save</p>
					</div>
				)}
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 animate-fadeIn items-stretch">
				{filteredNotes.map((note, index) => (
					<div
						key={note.id}
						className="animate-fadeIn flex"
						style={{ animationDelay: `${index * 50}ms` }}
					>
						<NoteCard
							note={note}
							onEdit={handleEdit}
							onDelete={() => handleDeleteClick(note)}
							onToggleComplete={
								note.type === "todo" ? handleToggleComplete : undefined
							}
						/>
					</div>
				))}
			</div>
			{editingNote && (
				<NoteEditor
					note={editingNote}
					onClose={handleEditClose}
					onShowToast={onShowToast}
				/>
			)}
			{noteToDelete && (
				<DeleteConfirmation
					noteTitle={noteToDelete.title}
					onConfirm={handleDeleteConfirm}
					onCancel={handleDeleteCancel}
				/>
			)}
		</>
	);
}
