interface DeleteConfirmationProps {
	noteTitle?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

/**
 * DeleteConfirmation Component
 *
 * Modal dialog for confirming note deletion.
 * Features:
 * - Shows note title if available for context
 * - Prevents accidental deletions
 * - Transparent backdrop with blur effect
 * - Slide-up animation on appearance
 */
export default function DeleteConfirmation({
	noteTitle,
	onConfirm,
	onCancel,
}: DeleteConfirmationProps) {
	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
			<div className="bg-zinc-900 rounded-lg shadow-xl max-w-md w-full border border-zinc-800 animate-slideUp">
				<div className="p-4">
					<h3 className="text-lg font-semibold text-white mb-2">Delete Note</h3>
					<p className="text-sm text-zinc-300 mb-4">
						Are you sure you want to delete
						{noteTitle ? ` "${noteTitle}"` : " this note"} ? This action cannot
						be undone.
					</p>
					<div className="flex justify-end gap-2">
						<button
							onClick={onCancel}
							className="px-3 py-1.5 text-xs text-zinc-300 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors font-medium"
						>
							Cancel
						</button>
						<button
							onClick={onConfirm}
							className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
