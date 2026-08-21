/** Wrap a highlighted option. Empty lists have no valid index. Skips disabled options when given. */
export function optionIndexAfterKey(
	key: string,
	index: number,
	count: number,
	isDisabled: (index: number) => boolean = () => false
): number | null {
	if (count === 0) return null;

	const firstEnabled = () => {
		for (let i = 0; i < count; i++) if (!isDisabled(i)) return i;
		return 0;
	};
	const lastEnabled = () => {
		for (let i = count - 1; i >= 0; i--) if (!isDisabled(i)) return i;
		return count - 1;
	};
	const step = (dir: 1 | -1) => {
		let i = index;
		for (let n = 0; n < count; n++) {
			i = (i + dir + count) % count;
			if (!isDisabled(i)) return i;
		}
		return index;
	};

	switch (key) {
		case 'ArrowDown':
			return step(1);
		case 'ArrowUp':
			return step(-1);
		case 'Home':
			return firstEnabled();
		case 'End':
			return lastEnabled();
		default:
			return null;
	}
}
