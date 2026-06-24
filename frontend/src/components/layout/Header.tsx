"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

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
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
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
            className="hidden sm:flex flex-1 max-w-xs items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-gray-600">{t.nav.search}</span>
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
            {isAuthenticated ? (
              <>
                <Link
                  href="/listings/create"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ➕ {t.nav.postListing}
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  {t.nav.dashboard}
                </Link>
                <Link href="/dashboard/settings" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  ⚙️
                </Link>
                {user?.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                    🔐 Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t.nav.signUp}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={closeMenu} />
      )}

      <div
        className={`fixed top-16 left-0 right-0 bg-white border-b md:hidden z-40 transform transition-all duration-200 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="p-4 space-y-3">
          <Link href="/search" className="block text-sm text-gray-700 hover:text-primary py-2">
            {t.nav.search}
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/listings/create" className="block text-sm text-gray-700 hover:text-primary py-2">
                {t.nav.postListing}
              </Link>
              <Link href="/dashboard" className="block text-sm text-gray-700 hover:text-primary py-2">
                {t.nav.dashboard}
              </Link>
              <Link href="/dashboard/settings" className="block text-sm text-gray-700 hover:text-primary py-2">
                Settings
              </Link>
              {user?.role === "ADMIN" && (
                <Link href="/admin" className="block text-sm text-gray-700 hover:text-primary py-2">
                  {t.nav.admin}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block w-full text-center px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                onClick={closeMenu}
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="block w-full text-center px-3 py-2 text-sm bg-primary text-white rounded hover:bg-accent"
                onClick={closeMenu}
              >
                {t.nav.signUp}
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="h-16" />
    </>
  );
}
