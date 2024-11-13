import UserPreferences from '@/components/user-preferences';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex items-center gap-3 mb-6">
				<Link href="/" className="hover:opacity-80">
					<ArrowLeft className="h-6 w-6" />
				</Link>
				<h1 className="text-2xl font-bold">Settings</h1>
			</div>
			<UserPreferences />
		</div>
	);
}