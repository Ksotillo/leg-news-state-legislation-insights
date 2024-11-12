'use client'

import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function SearchBar({ value, onChange, disabled }: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Input
        type="search"
        placeholder="Search"
        className="bg-gray-100 rounded-xl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  )
}