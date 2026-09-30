import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Bot,
  FileBarChart,
  Layers,
  ChevronRight,
  Database,
  Building2,
} from 'lucide-react';

export type NavItem = 'dashboard' | 'documents' | 'assistant' | 'reports';

interface SidebarProps {
  currentNav: NavItem;
  onNavigate: (item: NavItem) => void;
  documentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentNav,
  onNavigate,
  documentsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavItem,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'documents' as NavItem,
      label: 'Documents',
      icon: FileText,
      badge: documentsCount > 0 ? documentsCount : null,
    },
    {
      id: 'assistant' as NavItem,
      label: 'AI Assistant',
      icon: Bot,
      badge: 'RAG',
    },
    {
      id: 'reports' as NavItem,
      label: 'Reports',
      icon: FileBarChart,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            Enterprise AI
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Knowledge &amp; Workflow</div>
        </div>
      </div>

      {/* Organization Scope Indicator */}
      <div className="px-3.5 py-3 border-b border-slate-800/60">
        <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-xs font-medium text-slate-200 truncate">Central Organization</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              24 Verified Corpora
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Index Engine Status */}
      <div className="px-4 py-3 mx-3 mb-2 rounded-lg bg-slate-800/40 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium mb-1">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>Vector RAG Pipeline</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Dense embeddings active with citation cross-referencing.
        </p>
      </div>

      {/* User / Session Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xs font-semibold text-blue-300">
            DU
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-200 truncate">Demo User</div>
            <div className="text-[11px] text-slate-400 truncate">College Project MVP</div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>
    </aside>
  );
};
