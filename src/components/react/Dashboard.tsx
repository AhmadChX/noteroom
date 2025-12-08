import { useState, useCallback } from "react";
import type { NoteFilters, NoteType } from "../../types/notes";
import NoteCapture from "./NoteCapture";
import SearchBar from "./SearchBar";
import NoteList from "./NoteList";
import ToastContainer, { type ToastData } from "./ToastContainer";
import { storage } from "../../utils/storage";
import { getTypeButtonClasses } from "../../utils/colors";

/**
 * Dashboard Component
 *
 * Main application component that manages global state and coordinates all sub-components.
 * Responsibilities:
 * - Manages search and filter state
 * - Handles note creation, updates, and refresh triggers
 * - Manages toast notifications
 * - Renders the navigation bar, note capture, search bar, filters, and note list
 */
export default function Dashboard() {
	// Filter state for search query and type filtering
	const [filters, setFilters] = useState<NoteFilters>({
		searchQuery: "",
		typeFilter: "all",
	});

	// Refresh key forces NoteList to reload when notes are created/updated
	const [refreshKey, setRefreshKey] = useState(0);

	// Toast notifications state
	const [toasts, setToasts] = useState<ToastData[]>([]);

	const showToast = useCallback(
		(message: string, type: ToastData["type"] = "success") => {
			const id = crypto.randomUUID();
			setToasts((prev) => [...prev, { id, message, type }]);
		},
		[],
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const handleSearchChange = useCallback((query: string) => {
		setFilters((prev) => ({ ...prev, searchQuery: query }));
	}, []);

	/**
	 * Handles note creation from NoteCapture component
	 * Saves the note to localStorage and triggers a refresh
	 */
	const handleNoteCreate = useCallback(
		(type: NoteType, content: string, title?: string) => {
			storage.create({
				type,
				content,
				title: title || undefined,
			});

			const typeName = type.charAt(0).toUpperCase() + type.slice(1);
			showToast(`${typeName} created successfully!`);
			setRefreshKey((prev) => prev + 1);
		},
		[showToast],
	);

	/**
	 * Handles note updates - triggers a refresh of the note list
	 */
	const handleNoteUpdate = useCallback(() => {
		setRefreshKey((prev) => prev + 1);
	}, []);

	return (
		<div className="min-h-screen bg-zinc-950">
			{/* Navigation bar with app branding */}
			<nav className="border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-md sticky top-0 z-40 shadow-sm shadow-black/10">
				<div className="container mx-auto px-4 sm:px-6 py-3 sm:py-3.5 max-w-5xl">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3 sm:gap-3.5">
							{/* Logo with subtle glow effect */}
							<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/20">
								<svg
									className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="NoteRoom logo"
								>
									<title>NoteRoom Logo</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							{/* Branding text */}
							<div className="flex flex-col">
								<h1 className="text-base sm:text-lg font-bold text-white leading-tight tracking-tight">
									note room
								</h1>
								<p className="text-xs text-zinc-400 leading-tight mt-0.5">
									Your personal space for notes, todos, and snippets, stored
									locally in your browser.
								</p>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<div className="container mx-auto px-4 py-4 max-w-5xl">
				{/* Note capture form */}
				<div className="mb-4">
					<NoteCapture onNoteCreate={handleNoteCreate} />
				</div>

				{/* Search bar */}
				<div className="mb-4">
					<SearchBar onSearchChange={handleSearchChange} />
				</div>

				{/* Type filter buttons */}
				<div className="mb-4 flex gap-1.5 flex-wrap justify-center">
					<button
						type="button"
						onClick={() =>
							setFilters((prev) => ({
								...prev,
								typeFilter: "all",
							}))
						}
						className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${
							filters.typeFilter === "all"
								? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border-blue-500"
								: "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
						}`}
					>
						All
					</button>
					<button
						type="button"
						onClick={() =>
							setFilters((prev) => ({
								...prev,
								typeFilter: "note",
							}))
						}
						className={getTypeButtonClasses(
							"note",
							filters.typeFilter === "note",
						)}
					>
						Notes
					</button>
					<button
						type="button"
						onClick={() =>
							setFilters((prev) => ({
								...prev,
								typeFilter: "todo",
							}))
						}
						className={getTypeButtonClasses(
							"todo",
							filters.typeFilter === "todo",
						)}
					>
						Todos
					</button>
					<button
						type="button"
						onClick={() =>
							setFilters((prev) => ({
								...prev,
								typeFilter: "snippet",
							}))
						}
						className={getTypeButtonClasses(
							"snippet",
							filters.typeFilter === "snippet",
						)}
					>
						Snippets
					</button>
				</div>

				<NoteList
					key={refreshKey}
					filters={filters}
					onNoteUpdate={handleNoteUpdate}
					onShowToast={showToast}
				/>
			</div>
			
			{/* Footer */}
			<footer className="mt-12 mb-6 sm:mb-8">
				<div className="container mx-auto px-4 sm:px-6 max-w-5xl">
					<div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-4 border-t border-zinc-900">
						<div className="flex items-center gap-2 text-zinc-500">
							<svg
								className="w-4 h-4 text-zinc-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
							<span className="text-xs sm:text-sm text-zinc-500 text-center">
								All data is stored locally in your browser
							</span>
						</div>
					</div>
				</div>
			</footer>
			
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</div>
	);
}
