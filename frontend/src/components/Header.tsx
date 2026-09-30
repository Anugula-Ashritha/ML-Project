import React from 'react';
import { Search, Plus, Sparkles, ShieldCheck } from 'lucide-react';
import { NavItem } from './Sidebar';

interface HeaderProps {
  currentNav: NavItem;
  onOpenUpload: () => void;
  onNavigate: (item: NavItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentNav,
  onOpenUpload,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const getNavLabel = () => {
    switch (currentNav) {
      case 'dashboard':
        return 'Knowledge Dashboard';
      case 'documents':
        return 'Document Repository';
      case 'assistant':
        return 'AI Knowledge Assistant';
      case 'reports':
        return 'Generated Reports';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Enterprise AI</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{getNavLabel()}</span>
        </div>
      </div>

      {/* Global Quick Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search policies, bylaws, documents, or chunks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition-colors text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>RBAC Verified</span>
        </div>

        <button
          onClick={() => onNavigate('assistant')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask AI</span>
        </button>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>
    </header>
  );
};
