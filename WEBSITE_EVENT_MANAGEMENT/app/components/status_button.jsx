"use client";

export default function StatusButton({ status, onRegister }) {
	if (status === "pending") {
		return (
			<button
				disabled
				className="w-full cursor-not-allowed rounded-md bg-amber-500/20 px-3 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-300"
			>
				Pending Approval
			</button>
		);
	}
	if (status === "approved") {
		return (
			<button
				disabled
				className="w-full cursor-default rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600/90"
			>
				Approved
			</button>
		);
	}
	return (
		<button
			onClick={onRegister}
			className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
		>
			Register
		</button>
	);
}


