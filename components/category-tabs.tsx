'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    setActiveCategory(selectedCategory)
  }, [selectedCategory])

  const handleCategoryChange = (category: string) => {
    const newCategory = category === activeCategory ? '' : category
    setActiveCategory(newCategory)
    onCategoryChange(newCategory)
  }

  return (
    <div className="flex gap-2 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-1 rounded-full text-sm whitespace-nowrap capitalize
            transition-colors duration-200 ease-in-out
            ${activeCategory === category 
              ? 'bg-fireOpal text-white hover:bg-red-600' 
              : 'border border-gray-200 hover:bg-gray-100'
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