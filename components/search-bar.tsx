'use client'

import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce"
import { useState, useEffect } from "react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}


export default function SearchBar({ value, onChange, disabled }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, 500) // 500ms delay

  // Update parent when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      const search = debouncedValue.trim();
      onChange(search);
    }
  }, [debouncedValue, onChange, value])

  // Update local value when parent value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <div className="relative flex-1 max-w-md">
      <Input
        type="search"
        placeholder="Search"
        className="bg-gray-100 rounded-xl"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        disabled={disabled}
      />
    </div>
  )
}