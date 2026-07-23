"use client";

import React, { useState } from "react";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <html lang="ar" dir="rtl" className={darkMode ? "dark" : ""}>
      <head>
        <title>نظام الصيانة والمبيعات الشامل - ERP & POS</title>
        <meta
          name="description"
          content="نظام متكامل لإدارة مراكز الصيانة، المبيعات، المخازن، والطباعة الحرارية مباشرة."
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 flex font-sans antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
