"use client";

import Link from "next/link";
import { Home, Users, Search, BarChart3 } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Link */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-xl font-bold">Política Transparência</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </Link>
            <Link
              href="/deputies"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Deputados</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
