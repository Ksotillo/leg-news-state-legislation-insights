'use client'

import { useState } from 'react'
import { Category } from '@/lib/types';
import { categoryKeywords } from '@/lib/category-inference';

const categories = Object.keys(categoryKeywords) as Category[];

interface CategoryTabsProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  disabled?: boolean
}

export default function CategoryTabs({ selectedCategory, onCategoryChange, disabled }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    onCategoryChange(category)
  }

  return (
    <div className="flex gap-2 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-1 rounded-full text-sm whitespace-nowrap capitalize
            ${activeCategory === category 
              ? 'bg-red-500 text-white' 
              : 'border border-gray-200'
            }`}
          onClick={() => handleCategoryChange(category)}
          disabled={disabled}
        >
          {category}
        </button>
      ))}
    </div>
  )
} 