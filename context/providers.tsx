"use client";

import React, { ReactNode } from "react";
import { ArticleProvider } from "./ArticleContext";
import { ClerkProvider } from "@clerk/nextjs";
export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider dynamic={true}>
            <ArticleProvider>
                    {children}
            </ArticleProvider>
        </ClerkProvider>
    );
}
