"use client";

import React, { ReactNode } from "react";
import { ArticleProvider } from "./ArticleContext";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ArticleProvider>
            {children}
        </ArticleProvider>
    );
}
