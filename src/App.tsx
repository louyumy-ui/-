import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { CriteriaModule } from './components/CriteriaModule';
import { ScoringModule } from './components/ScoringModule';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { cn } from './lib/utils';

type Module = 'criteria' | 'scoring' | 'analysis';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('criteria');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'criteria', label: '打分标准制定', icon: ClipboardList },
    { id: 'scoring', label: '打分效果呈现', icon: FileText },
    { id: 'analysis', label: '数据分析看板', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:hidden"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              智
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">智策云语</h1>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">核心功能</div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as Module)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  activeModule === item.id 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-colors",
                  activeModule === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-900"
                )} />
                {item.label}
                {activeModule === item.id && <ChevronRight size={14} className="ml-auto" />}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <Settings size={18} />
              系统设置
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all mt-1">
              <LogOut size={18} />
              退出登录
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索通话记录、标准或报表..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm w-80 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">超级管理员</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">质检部门负责人</div>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img 
                  src="https://picsum.photos/seed/admin/100/100" 
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {activeModule === 'criteria' && <CriteriaModule />}
            {activeModule === 'scoring' && <ScoringModule />}
            {activeModule === 'analysis' && <AnalysisDashboard />}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        ></div>
      )}
    </div>
  );
}
