"use client";

import Image from "next/image";
import SearchBar from "./search-bar";
import CategoryTabs from "./category-tabs";
import logo from "@/assets/logo.png";
import { states } from "@/lib/constants";
import { SelectWithSearch } from "./ui/select-with-search";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get initial values from URL
  const currentState = searchParams.get("state") || states[0].value;
  const currentSearch = searchParams.get("search") || "";
  const currentTopic = searchParams.get("topic") || "";

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    // Update params with new values
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
  };

  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleTopicChange = (value: string) => {
    updateFilters({ topic: value });
  };

  return (
    <header className="sticky top-0 bg-white z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="LegNews" width={170} />
            <div className="h-6 w-0.5 bg-black mx-2 rounded-full" />
            <SearchBar value={currentSearch} onChange={handleSearch} disabled={isPending} />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Image src="/icons/share.svg" alt="Share" width={20} height={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <CategoryTabs selectedCategory={currentTopic} onCategoryChange={handleTopicChange} />
          <SelectWithSearch options={states} value={currentState} onValueChange={handleStateChange} placeholder="State" className="w-[180px] bg-gray-100 rounded-xl" />
        </div>
      </div>
    </header>
  );
}
