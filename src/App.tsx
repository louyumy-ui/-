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
  X,
  UserCircle,
  HelpCircle
} from 'lucide-react';
import { CriteriaModule } from './components/CriteriaModule';
import { ScoringModule } from './components/ScoringModule';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ManagementModule } from './components/ManagementModule';
import { cn } from './lib/utils';

type Module = 'criteria' | 'scoring' | 'analysis' | 'management';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('criteria');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'management', label: '管理端控制台', icon: Settings, desc: '原子库与官方套组维护' },
    { id: 'criteria', label: '打分标准制定', icon: ClipboardList, desc: '配置质检维度与分值' },
    { id: 'scoring', label: '打分效果呈现', icon: FileText, desc: '查看单通通话诊断详情' },
    { id: 'analysis', label: '数据分析看板', icon: BarChart3, desc: '全量通话质量趋势分析' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#1E293B] text-slate-300 transition-all duration-300 lg:relative lg:translate-x-0 flex flex-col",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-700/50">
          <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <LayoutDashboard size={24} />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-lg font-black tracking-tight text-white">AI 智策云语</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quality Assessment</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {isSidebarOpen && (
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Main Menu</div>
          )}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as Module)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                activeModule === item.id 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                activeModule === item.id ? "text-white" : "text-slate-400 group-hover:text-blue-400"
              )} />
              {isSidebarOpen && (
                <div className="text-left">
                  <div className="text-sm font-bold">{item.label}</div>
                  <div className={cn(
                    "text-[10px] transition-colors",
                    activeModule === item.id ? "text-blue-100" : "text-slate-500"
                  )}>{item.desc}</div>
                </div>
              )}
              {activeModule === item.id && isSidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
              {!isSidebarOpen && activeModule === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-1">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Settings size={20} />
            {isSidebarOpen && <span>系统设置</span>}
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              {isSidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
            </button>
            <div className="relative hidden xl:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="搜索质检标准、通话流水、分析报表..." 
                className="pl-12 pr-6 py-2.5 bg-slate-100 border-none rounded-2xl text-sm w-96 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all border border-transparent focus:border-blue-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-all">
                <HelpCircle size={20} />
              </button>
            </div>
            
            <div className="h-8 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-800">Admin User</div>
                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">超级管理员</div>
              </div>
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-4 ring-slate-100 shadow-inner">
                <img 
                  src="https://picsum.photos/seed/admin/120/120" 
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="p-8 min-h-full">
            {activeModule === 'criteria' && <CriteriaModule />}
            {activeModule === 'scoring' && <ScoringModule />}
            {activeModule === 'analysis' && <AnalysisDashboard />}
            {activeModule === 'management' && <ManagementModule />}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        ></div>
      )}
    </div>
  );
}

