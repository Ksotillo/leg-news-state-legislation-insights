import React from 'react'
import { Check } from "lucide-react";

function FilterOptionMobile({ 
	label, 
	value, 
	currentValue, 
	onClick 
}: { 
	label: string;
	value: string;
	currentValue: string;
	onClick: (value: string) => void;
}) {
	return (
		<button
			onClick={() => onClick(value)}
			className="flex items-center justify-start gap-2 w-full px-2 py-1.5 text-sm hover:bg-gray-50 rounded-lg transition-colors capitalize"
		>
			<Check className={`w-4 h-4 ${currentValue === value ? "text-fireOpal" : "opacity-0"}`} />
			<span className={`${currentValue === value ? "text-fireOpal" : ""}`}>{label}</span>
		</button>
	);
}

export default FilterOptionMobile;
