"use client";

import Image from "next/image";
import SearchBar from "./search-bar";
import CategoryTabs from "./category-tabs";
import logo from "@/assets/logo.png";
import { states } from "@/lib/constants";
import { SelectWithSearch } from "./ui/select-with-search";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, Suspense } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Settings, SquarePen } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { categoryKeywords } from "@/lib/category-inference";
import FilterOptionMobile from "./ui/filter-option-mobile";
import { InputSanitizer } from "@/lib/sanitize";
import { useToast } from "@/hooks/use-toast";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@/hooks/useUser";

function HeaderContent({ hideFilters = false }: { hideFilters?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  // Get initial values from URL or user preferences
  const currentState = searchParams.get("state") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentTopic = searchParams.get("topic") || "";

  useEffect(() => {
    // Update the URL with the user's favorite state and category only once
    if (user && !sessionStorage.getItem('filtersInitialized')) {
      updateFilters({ state: Object.keys(user.favorite_states)[0], topic: Object.keys(user.favorite_categories)[0] });
      sessionStorage.setItem('filtersInitialized', 'true');
    }
  }, [user]);

  const updateFilters = (updates: Record<string, string>) => {
    try {
        const sanitizedUpdates: Record<string, string> = {};

        // Sanitize each update
        Object.entries(updates).forEach(([key, value]) => {
          if (key === 'search') {
            sanitizedUpdates[key] = InputSanitizer.sanitizeSearchQuery(value) || '';
          } else if (key === 'topic') {
            sanitizedUpdates[key] = InputSanitizer.sanitizeTopic(value) || '';
          } else if (key === 'state') {
            sanitizedUpdates[key] = InputSanitizer.sanitizeState(value) || 'all';
          }
        });

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

    } catch (error) {
      console.error('Error updating filters:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again later.",
      });
    }
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
            <SignedIn>
              <Link href="/articles/new" className="flex items-center gap-2">
                <SquarePen className="h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors" />
                <span className="hidden md:block text-balck opacity-90">Write</span>
              </Link>
              <Link href="/settings">
                <Settings className="h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors" />
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
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

export default function Header({ hideFilters = false }: { hideFilters?: boolean }) {
  return (
    <Suspense fallback={
      <div className="w-full border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="md:hidden mb-4">
            <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          {!hideFilters && (
            <div className="hidden md:block py-4">
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
            </div>
          )}
        </div>
      </div>
    }>
      <HeaderContent hideFilters={hideFilters} />
    </Suspense>
  );
}
