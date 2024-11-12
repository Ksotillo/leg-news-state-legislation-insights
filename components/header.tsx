"use client";

import Image from "next/image";
import SearchBar from "./search-bar";
import CategoryTabs from "./category-tabs";
import logo from "@/assets/logo.png";
import { states } from "@/lib/constants";
import { SelectWithSearch } from "./ui/select-with-search";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { categoryKeywords } from "@/lib/category-inference";
import FilterOptionMobile from "./ui/filter-option-mobile";

export default function Header({ hideFilters = false }: { hideFilters?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  // Get initial values from URL
  const currentState = searchParams.get("state") || states[0].value;
  const currentSearch = searchParams.get("search") || "";
  const currentTopic = searchParams.get("topic") || "";

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'state' && value === 'all') {
        params.delete(key);
      }
      else if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      setTimeout(() => {
        router.push(`?${params.toString()}`);
      }, 100);
    });
  };

  const handleStateChange = (value: string) => {
    updateFilters({ state: value });
    setIsOpen(false);
  };

  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleTopicChange = (value: string) => {
    updateFilters({ topic: value });
    setIsOpen(false);
  };

  const FiltersContent = () => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <CategoryTabs selectedCategory={currentTopic} onCategoryChange={handleTopicChange} />
      <SelectWithSearch 
        options={states} 
        value={currentState} 
        onValueChange={handleStateChange} 
        placeholder="State" 
        className="w-full md:w-[180px] bg-gray-100 rounded-xl" 
      />
    </div>
  );

  const MobileFilters = () => (
    <div className="py-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-normal">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <div className="space-y-2">
                {Object.keys(categoryKeywords).map((category) => (
                  <FilterOptionMobile
                    key={category}
                    label={category}
                    value={category}
                    currentValue={currentTopic}
                    onClick={handleTopicChange}
                  />
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="state">
          <AccordionTrigger className="text-base font-normal">State</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 max-h-[500px] overflow-y-auto">
              <div className="space-y-2">
                {states.map((state) => (
                  <FilterOptionMobile
                    key={state.value}
                    label={state.label}
                    value={state.value}
                    currentValue={currentState}
                    onClick={handleStateChange}
                  />
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <header className="sticky top-0 bg-white z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="md:hidden p-2">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-[300px] sm:w-[400px] bg-white"
              >
                <MobileFilters />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/">
              <Image 
                src={logo} 
                alt="LegNews" 
                width={170} 
                className="h-8 w-auto object-contain"
              />
            </Link>

            {/* Divider */}
            <div className="hidden md:block h-6 w-0.5 bg-black mx-2 rounded-full" />

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md">
              <SearchBar 
                value={currentSearch} 
                onChange={handleSearch} 
                disabled={isPending} 
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Image src="/icons/share.svg" alt="Share" width={20} height={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-4">
          <SearchBar 
            value={currentSearch} 
            onChange={handleSearch} 
            disabled={isPending} 
          />
        </div>

        {/* Desktop Filters */}
        {!hideFilters && (
          <div className="hidden md:block">
            <FiltersContent />
          </div>
        )}
      </div>
    </header>
  );
}
