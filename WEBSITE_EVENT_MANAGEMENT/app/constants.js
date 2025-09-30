export const NAV_LINKS = [
	{ label: "Home", href: "#" },
	{ label: "Events", href: "#events" },
	{ label: "My Registrations", href: "#registrations" },
	{ label: "Organizer Panel", href: "#organizer" },
];

export const CATEGORIES = ["All", "Technical", "Cultural", "Sports"];

export const INITIAL_EVENTS = [
	{
		id: "1",
		title: "Hackathon 2025",
		category: "Technical",
		dateTime: "Fri, Oct 10 • 9:00 AM - 6:00 PM",
		location: "Main Auditorium",
		description:
			"Join fellow innovators for a full-day hackathon focused on real-world campus problems.",
		attendees: 42,
		status: "idle",
	},
	{
		id: "2",
		title: "Cultural Night",
		category: "Cultural",
		dateTime: "Sat, Oct 18 • 7:00 PM - 10:00 PM",
		location: "Open Air Theater",
		description:
			"Experience music, dance, and food from diverse cultures across campus.",
		attendees: 128,
		status: "pending",
	},
	{
		id: "3",
		title: "Football Finals",
		category: "Sports",
		dateTime: "Sun, Oct 26 • 4:30 PM - 6:30 PM",
		location: "North Ground",
		description:
			"Cheer for your house in the championship finals with halftime activities.",
		attendees: 89,
		status: "approved",
	},
];

export function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}


