"use client";

import { CATEGORIES, classNames } from "../constants";

export default function Filters({ query, category, onQueryChange, onCategoryChange }) {
	return (
		<div className="mx-auto max-w-7xl px-4">
			<div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
				<div className="relative w-full md:max-w-md">
					<input
						type="text"
						placeholder="Search events..."
						value={query}
						onChange={(e) => onQueryChange(e.target.value)}
						className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
					/>
				</div>
				<div className="flex items-center gap-2">
					{CATEGORIES.map((cat) => (
						<button
							key={cat}
							onClick={() => onCategoryChange(cat)}
							className={classNames(
								"rounded-md px-3 py-2 text-sm font-medium transition",
								category === cat
									? "bg-indigo-600 text-white shadow"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							)}
						>
							{cat}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}


