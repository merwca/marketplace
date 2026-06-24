"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 shadow-sm z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" onClick={closeMenu}>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              📦 Marketplace
            </div>
          </Link>

          {/* Desktop Search */}
          <Link
            href="/search"
            className="hidden sm:flex flex-1 max-w-xs items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t.nav.search}</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <p className="text-xs text-gray-500 dark:text-gray-400">Demo Mode</p>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={closeMenu} />
      )}

      <div
        className={`fixed top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 md:hidden z-40 transform transition-all duration-200 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="p-4 space-y-3">
          <Link href="/search" className="block text-sm text-gray-700 hover:text-primary py-2">
            {t.nav.search}
          </Link>
          <p className="text-xs text-gray-500 py-2">Demo mode - Browse listings</p>
        </div>
      </div>

      <div className="h-16" />
    </>
  );
}
