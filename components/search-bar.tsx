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
    // Only trigger onChange if the debounced value is different from the current value
    // and is not an empty string (to prevent unnecessary URL updates)
    const trimmedValue = debouncedValue.trim();
    if (trimmedValue !== value) {
      onChange(trimmedValue);
    }
  }, [debouncedValue])

  // Update local value when parent value changes
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value)
    }
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