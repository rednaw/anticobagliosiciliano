/** Wrap a highlighted option. Empty lists have no valid index. */
export function optionIndexAfterKey(key: string, index: number, count: number): number | null {
	if (count === 0) return null;
	switch (key) {
		case 'ArrowDown':
			return (index + 1) % count;
		case 'ArrowUp':
			return (index - 1 + count) % count;
		case 'Home':
			return 0;
		case 'End':
			return count - 1;
		default:
			return null;
	}
}
