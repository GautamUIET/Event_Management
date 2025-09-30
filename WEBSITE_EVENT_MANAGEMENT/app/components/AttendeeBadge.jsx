export default function AttendeeBadge({ count }) {
	return (
		<span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
			{count} going
		</span>
	);
}


