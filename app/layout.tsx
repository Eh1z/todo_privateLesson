import "./globals.css";

export const metadata = {
	title: "Modern Todo App",
	description: "A beautiful todo list built with Next.js 15 + Tailwind",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="dark">
			<body className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 antialiased">
				<div className="min-h-screen flex items-center justify-center">
					{children}
				</div>
			</body>
		</html>
	);
}
