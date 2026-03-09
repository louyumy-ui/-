import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit3, Search, Filter, ChevronRight, 
  CheckCircle2, AlertCircle, Clock, ShieldCheck,
  Tag, LayoutGrid, FileText, Settings2, Save,
  History, ArrowUpRight, Database, Layers, MoreVertical,
  MessageSquare, Info, User, Scale, Zap, Lock, Unlock
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer 
} from 'recharts';
import { SvgCopyButton } from './SvgCopyButton';
import { cn } from '../lib/utils';

// --- 原子维度库 ---
const ATOMIC_LIBRARY = [
  { id: 'a1', name: '开场白合规', category: '流程', status: 'active', modifier: '张经理', lastUpdate: '2026-03-01 14:20:05' },
  { id: 'a2', name: '语速控制', category: '素质', status: 'active', modifier: '李主管', lastUpdate: '2026-02-15 09:12:33' },
  { id: 'a3', name: '需求挖掘', category: '业务', status: 'active', modifier: '王组长', lastUpdate: '2026-03-02 16:45:12' },
  { id: 'a4', name: '情绪价值', category: '情绪', status: 'active', modifier: '张经理', lastUpdate: '2026-02-20 11:30:00' },
];

const INITIAL_ATOMIC_TAGS = ATOMIC_LIBRARY;

const CATEGORIES = ['流程', '业务', '素质', '情绪', '合规', '服务'];

const SCRIPT_ASSOCIATIONS = [
  { id: 's1', script: '金融产品电销话术 A', template: '金融电销标准套组', account: 'FIN_DEPT_01', status: 'active', createdAt: '2026-01-10 10:00:00' },
  { id: 's2', script: '售后回访话术 V2', template: '售后回访通用套组', account: 'SERVICE_TEAM_A', status: 'active', createdAt: '2026-02-05 14:30:00' },
  { id: 's3', script: '保险理赔咨询话术', template: '金融电销标准套组', account: 'INSURE_DEPT_B', status: 'inactive', createdAt: '2026-03-01 09:15:00' },
];

const OFFICIAL_SETS = [
  { id: 'set1', name: '金融电销标准套组', dimensions: 8, lastUpdate: '2026-03-01 14:20:05', status: 'published' },
  { id: 'set2', name: '售后回访通用套组', dimensions: 6, lastUpdate: '2026-02-28 09:12:33', status: 'published' },
  { id: 'set3', name: '高潜客户挖掘套组', dimensions: 10, lastUpdate: '2026-03-02 16:45:12', status: 'draft' },
];

export const ManagementModule = () => {
  const [activeTab, setActiveTab] = useState<'atomic' | 'templateManagement' | 'templates' | 'scripts'>('atomic');
  const [view, setView] = useState<'list' | 'editTemplate'>('list');
  const [showAtomicModal, setShowAtomicModal] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [tags, setTags] = useState(INITIAL_ATOMIC_TAGS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [catSearch, setCatSearch] = useState('');
  const [showAdvancedAI, setShowAdvancedAI] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [weightError, setWeightError] = useState<string>('');

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setShowAtomicModal(true);
  };

  const handleCreate = () => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    setEditingTag({ 
      id: `new-${Date.now()}`, 
      name: '', 
      category: '业务', 
      status: 'draft', 
      modifier: '当前用户',
      lastUpdate: timestamp
    });
    setShowAtomicModal(true);
  };

  const handleSave = () => {
    if (editingTag.id.startsWith('new')) {
      setTags([...tags, { ...editingTag, id: `a${tags.length + 1}` }]);
    } else {
      setTags(tags.map(t => t.id === editingTag.id ? editingTag : t));
    }
    setShowAtomicModal(false);
  };

  const filteredCategories = categories.filter(c => c.includes(catSearch));

  return (
    <div id="management-root" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">质检库</h2>
          <p className="text-slate-500 text-sm mt-1">维护全局原子维度库、模板广场及话术关联关系</p>
        </div>
        <div className="flex gap-3">
          <SvgCopyButton targetId="management-root" />
          {activeTab !== 'scripts' && (
            <button 
              onClick={() => {
                if (activeTab === 'atomic') handleCreate();
                else if (activeTab === 'templateManagement') {
                  setEditingTemplate({ id: `s${Date.now()}`, name: '新质检方案', dims: 5, time: '2026-03-01 10:00', status: 'draft', dimensions: ATOMIC_LIBRARY.slice(0, 5).map(a => ({ ...a, weight: 20, locked: false })) });
                  setView('editTemplate');
                } else {
                  setEditingTemplate({ id: `set${Date.now()}`, name: '新模板', dimensions: ATOMIC_LIBRARY.slice(0, 4).map(a => ({ ...a, weight: 25, locked: false })) });
                  setView('editTemplate');
                }
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-all"
            >
              <Plus size={18} />
              <span>{activeTab === 'atomic' ? '新建原子维度' : activeTab === 'templateManagement' ? '新增' : '新建模板'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 标签切换 */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'atomic', label: '原子维度库', icon: Database },
          { id: 'templateManagement', label: '模板管理', icon: Scale },
          { id: 'templates', label: '模板广场', icon: LayoutGrid },
          { id: 'scripts', label: '话术关联管理', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div id="management-content-area" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
        {view === 'editTemplate' ? (
          <TemplateEditView 
            template={editingTemplate} 
            onBack={() => setView('list')} 
            isTesting={isTesting}
            setIsTesting={setIsTesting}
          />
        ) : (
          <>
            {activeTab === 'atomic' && (
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="搜索原子维度名称、ID..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 font-bold">
                    <Filter size={16} /> 筛选类型
                  </button>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">维度名称</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">分类</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">责任人</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">最后更新</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tags.map(tag => (
                      <tr key={tag.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-800">{tag.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {tag.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{tag.category}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 font-bold">{tag.modifier}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "flex items-center gap-1.5 text-[10px] font-bold",
                            tag.status === 'active' ? "text-emerald-600" : "text-amber-600"
                          )}>
                            {tag.status === 'active' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {tag.status === 'active' ? '已发布' : '草稿'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">{tag.lastUpdate}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(tag)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={16} /></button>
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><History size={16} /></button>
                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'templateManagement' && (
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="搜索方案名称..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">方案名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">关联维度</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">创建时间</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { id: 's1', name: '新零售话术质检方案', dims: 5, time: '2026-03-01 10:00', status: 'published', dimensions: ATOMIC_LIBRARY.slice(0, 5).map(a => ({ ...a, weight: 20, locked: false })) },
                        { id: 's2', name: '金融催收合规方案', dims: 8, time: '2026-02-28 15:30', status: 'draft', dimensions: ATOMIC_LIBRARY.slice(0, 8).map(a => ({ ...a, weight: 12.5, locked: false })) },
                      ].map(scheme => (
                        <tr key={scheme.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4 font-bold text-slate-800 text-sm">{scheme.name}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">{scheme.dims} 维度</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-mono">{scheme.time}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                              scheme.status === 'published' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                            )}>
                              {scheme.status === 'published' ? '已发布' : '草稿'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setEditingTemplate(scheme);
                                  setView('editTemplate');
                                }}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="p-8 grid grid-cols-3 gap-6">
                {OFFICIAL_SETS.map(set => (
                  <div key={set.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-white hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20">
                        <Layers size={24} />
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                        set.status === 'published' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                      )}>
                        {set.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-800 mb-2">{set.name}</h4>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold mb-6">
                      <span className="flex items-center gap-1"><Database size={12} /> {set.dimensions} 维度</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {set.lastUpdate}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingTemplate(set);
                          setView('editTemplate');
                        }}
                        className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                      >编辑模板</button>
                      <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all"><MoreVertical size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'scripts' && (
              <div className="p-8 space-y-6">
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">话术关联管理 (只读)</h4>
                    <p className="text-xs text-blue-700/70">展示当前系统中话术与评分模板、使用账号的映射关系。</p>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">评分模板</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">所关联的话术</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">所关联的账号</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">创建时间</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {SCRIPT_ASSOCIATIONS.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-blue-600">{item.template}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-800">{item.script}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">{item.account}</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                            {item.createdAt}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                className={cn(
                                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
                                  item.status === 'active' ? "bg-blue-600" : "bg-slate-200"
                                )}
                              >
                                <span className={cn(
                                  "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                                  item.status === 'active' ? "translate-x-5" : "translate-x-1"
                                )} />
                              </button>
                              <span className={cn(
                                "text-[10px] font-bold",
                                item.status === 'active' ? "text-emerald-600" : "text-slate-400"
                              )}>
                                {item.status === 'active' ? '启用中' : '已停用'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={16} /></button>
                              <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 原子维度编辑弹窗 */}
      {showAtomicModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-[800px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{editingTag?.id.startsWith('new') ? '新建原子维度' : '编辑原子维度'}</h3>
                <p className="text-xs text-slate-400 mt-1">配置原子维度的核心属性、评分逻辑及发布状态</p>
              </div>
              <button onClick={() => setShowAtomicModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">维度名称</label>
                  <input 
                    type="text" 
                    value={editingTag?.name}
                    onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
                    placeholder="例如：开场白合规" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" 
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">所属分类</label>
                  <div className="relative group/cat">
                    <input 
                      type="text"
                      value={catSearch || editingTag?.category}
                      onChange={(e) => {
                        setCatSearch(e.target.value);
                        setEditingTag({...editingTag, category: e.target.value});
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && catSearch && !categories.includes(catSearch)) {
                          setCategories([...categories, catSearch]);
                          setEditingTag({...editingTag, category: catSearch});
                          setCatSearch('');
                        }
                      }}
                      placeholder="搜索或输入新增分类"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                    />
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 hidden group-focus-within/cat:block max-h-48 overflow-y-auto">
                      {filteredCategories.map(c => (
                        <button 
                          key={c}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setEditingTag({...editingTag, category: c});
                            setCatSearch('');
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                        >{c}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">维度定义</label>
                <textarea 
                  placeholder="从业务角度描述该维度的具体考核点..." 
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">评分标准</label>
                <textarea 
                  placeholder="明确拟定当前维度的判断标准，例如：必须包含'您好'且语速在180-220字/分钟之间..." 
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Settings2 size={16} className="text-blue-500" />
                      AI 识别逻辑配置 (技术实现)
                    </h4>
                    <button 
                      onClick={() => setShowAdvancedAI(!showAdvancedAI)}
                      className={cn("px-2 py-0.5 rounded text-[9px] font-bold transition-all border", showAdvancedAI ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-600 border-blue-200")}
                    >
                      {showAdvancedAI ? "隐藏高级配置" : "开启高级配置"}
                    </button>
                  </div>
                </div>
                
                {showAdvancedAI ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <Tag size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">关键词匹配</span>
                        </div>
                        <button className="text-xs text-blue-600 font-bold">配置规则</button>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                            <MessageSquare size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">语义理解 (LLM)</span>
                        </div>
                        <button className="text-xs text-blue-600 font-bold">配置 Prompt</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <AlertCircle size={24} />
                    <p className="text-xs font-medium text-center">已根据[维度描述]与[判断标准]自动关联基础识别逻辑</p>
                    <button onClick={() => setShowAdvancedAI(true)} className="text-[10px] font-bold text-blue-600 hover:underline">需要手动干预技术实现？</button>
                  </div>
                )}
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">发布状态:</span>
                  <div className="flex bg-slate-200 p-0.5 rounded-lg">
                    <button 
                      onClick={() => setEditingTag({...editingTag, status: 'draft'})}
                      className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", editingTag?.status === 'draft' ? "bg-white text-amber-600 shadow-sm" : "text-slate-500")}
                    >草稿</button>
                    <button 
                      onClick={() => setEditingTag({...editingTag, status: 'active'})}
                      className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", editingTag?.status === 'active' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500")}
                    >发布</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAtomicModal(false)} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all">取消</button>
                <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all">
                  <Save size={18} />
                  <span>保存配置</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 模板编辑视图组件 ---
const TemplateEditView = ({ template, onBack, isTesting, setIsTesting }: any) => {
  const [criteria, setCriteria] = useState<any[]>(template.dimensions || []);
  const [testScores, setTestScores] = useState<Record<string, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('客服：您好，请问是王先生吗？\n客户：是的。\n客服：王先生您好，我是云蝠智能的顾问...');
  const [weightError, setWeightError] = useState<string>('');

  const totalWeight = criteria.reduce((sum, d) => sum + d.weight, 0);

  // --- 权重自动平分逻辑 ---
  const rebalanceWeights = (currentCriteria: any[], changedId?: string, newWeight?: number) => {
    if (currentCriteria.length === 0) return [];
    
    const totalWeight = 100;
    const lockedDimensions = currentCriteria.filter(d => d.locked || d.id === changedId);
    const unlockedDimensions = currentCriteria.filter(d => !d.locked && d.id !== changedId);
    
    if (unlockedDimensions.length === 0) {
      if (changedId) {
        return currentCriteria.map(d => d.id === changedId ? { ...d, weight: newWeight || d.weight } : d);
      }
      return currentCriteria;
    }

    let lockedTotal = lockedDimensions.reduce((sum, d) => {
      const w = d.id === changedId ? (newWeight !== undefined ? newWeight : d.weight) : d.weight;
      return sum + w;
    }, 0);

    if (lockedTotal > totalWeight) lockedTotal = totalWeight;

    const remaining = totalWeight - lockedTotal;

    // 🌟 防呆拦截逻辑：每个未锁定的维度至少需要 1% 的空间
    if (unlockedDimensions.length > 0 && remaining < unlockedDimensions.length * 1) {
      setWeightError("剩余权重不足以分配给其他维度，请调低已锁定项的占比或取消部分维度。");
      return currentCriteria; 
    }

    setWeightError('');

    // Distribute remaining weight among unlocked dimensions using integers
    const newCriteria = currentCriteria.map(d => {
      if (d.id === changedId) return { ...d, weight: newWeight !== undefined ? newWeight : d.weight };
      if (d.locked) return d;
      
      let distributedWeight = Math.round(remaining / unlockedDimensions.length);
      distributedWeight = Math.max(0, distributedWeight);
      
      return { ...d, weight: distributedWeight };
    });

    // Adjust for rounding errors to ensure total is exactly 100
    const finalTotal = newCriteria.reduce((sum, d) => sum + d.weight, 0);
    const diff = totalWeight - finalTotal;
    
    if (diff !== 0 && unlockedDimensions.length > 0) {
      const lastUnlockedId = unlockedDimensions[unlockedDimensions.length - 1].id;
      return newCriteria.map(d => {
        if (d.id === lastUnlockedId) {
          return { ...d, weight: Math.max(0, d.weight + diff) };
        }
        return d;
      });
    }

    return newCriteria;
  };

  const handleWeightChange = (id: string, weight: number) => {
    const balanced = rebalanceWeights(criteria, id, weight);
    setCriteria(balanced);
  };

  const handleAddDimension = (tag: any) => {
    if (criteria.find(c => c.id === tag.id)) return;
    const nextCriteria = [...criteria, { ...tag, weight: 0, locked: false }];
    const balanced = rebalanceWeights(nextCriteria);
    setCriteria(balanced);
  };

  const handleRemoveDimension = (id: string) => {
    const nextCriteria = criteria.filter(c => c.id !== id);
    const balanced = rebalanceWeights(nextCriteria);
    setCriteria(balanced);
  };

  const toggleLock = (id: string) => {
    setCriteria(criteria.map(d => d.id === id ? { ...d, locked: !d.locked } : d));
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const newScores: any = {};
      criteria.forEach(c => newScores[c.id] = Math.floor(Math.random() * 30) + 70);
      setTestScores(newScores);
    }, 1500);
  };

  const calculateTotalScore = () => {
    const total = criteria.reduce((acc, curr) => {
      const score = testScores[curr.id] || 0;
      return acc + (score * (curr.weight / 100));
    }, 0);
    return total.toFixed(1);
  };

  const radarData = criteria.map(c => ({
    subject: c.name,
    A: testScores[c.id] || 0,
    full: 100
  }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div>
            <h3 className="text-lg font-bold text-slate-800">编辑模板: {template.name}</h3>
            <p className="text-xs text-slate-400">配置模板的维度权重及测试评分逻辑</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsTesting(!isTesting)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm", isTesting ? "bg-amber-500 text-white" : "bg-white border border-slate-200 text-slate-600")}
          >
            <Zap size={18} /> {isTesting ? "退出测试" : "进入测试模式"}
          </button>
          <button onClick={onBack} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all">取消</button>
          <button onClick={onBack} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
            <Save size={18} />
            <span>存为草稿</span>
          </button>
          <button onClick={onBack} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all">
            <ShieldCheck size={18} />
            <span>保存并发布</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 relative">
        {weightError && (
          <div className="absolute top-4 right-4 z-[99] flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold shadow-lg shadow-rose-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={16} /> 
            {weightError}
            <button onClick={() => setWeightError('')} className="ml-2 hover:text-rose-800">✕</button>
          </div>
        )}
        {/* 左侧：原子维度库 (简化版) */}
        <div className="col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-6 overflow-y-auto">
          <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Database size={16} className="text-blue-500" /> 原子维度库</h4>
          <div className="space-y-3">
            {INITIAL_ATOMIC_TAGS.map(tag => (
              <div 
                key={tag.id} 
                onClick={() => handleAddDimension(tag)}
                className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex justify-between items-center group cursor-pointer hover:border-blue-400 transition-all"
              >
                <span>{tag.name}</span>
                <Plus size={14} className={cn("text-slate-300 group-hover:text-blue-500", criteria.find(c => c.id === tag.id) && "text-emerald-500")} />
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：配置/测试区 */}
        <div className="col-span-9">
          {!isTesting ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Settings2 size={20} className="text-blue-500" />
                  <h3 className="text-lg font-bold text-slate-800">权重策略引擎</h3>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl text-sm font-black font-mono flex items-center gap-3",
                  Math.abs(totalWeight - 100) < 0.01 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  <span>总分: {Math.round(totalWeight)}分</span>
                  {Math.abs(totalWeight - 100) < 0.01 ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {criteria.map(item => (
                  <div key={item.id} className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                    <div className="grid grid-cols-12 gap-6 items-center">
                      <div className="col-span-3">
                        <div className="text-sm font-bold text-slate-800 mb-1">{item.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">原子维度描述占位符...</div>
                      </div>
                      <div className="col-span-6 flex items-center gap-4">
                        <input 
                          type="range" 
                          min="0" max="100" step="1"
                          value={item.weight}
                          onChange={(e) => handleWeightChange(item.id, parseInt(e.target.value))}
                          className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                          <input 
                            type="number" 
                            value={item.weight}
                            onChange={(e) => handleWeightChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-12 text-xs font-black text-slate-700 outline-none bg-transparent text-center font-mono"
                          />
                          <span className="text-[10px] font-bold text-slate-400">%</span>
                        </div>
                      </div>
                      <div className="col-span-3 flex justify-end items-center gap-3">
                        <button 
                          onClick={() => toggleLock(item.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg transition-all text-[10px] font-bold flex items-center gap-1.5", 
                            item.locked ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-400 hover:text-blue-500"
                          )}
                        >
                          {item.locked ? <Lock size={12} /> : <Unlock size={12} />}
                          <span>{item.locked ? "已锁定" : "锁定"}</span>
                        </button>
                        <button 
                          onClick={() => handleRemoveDimension(item.id)}
                          className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><MessageSquare size={18} className="text-blue-500" /> 通话文本模拟</h3>
                </div>
                <textarea 
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 font-mono resize-none"
                />
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
                >
                  {isAnalyzing ? "分析中..." : "开始智能分析"}
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">综合诊断得分</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black font-mono">{calculateTotalScore()}</span>
                    <span className="text-sm font-bold opacity-70">/ 100</span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4 overflow-y-auto pr-2">
                  {criteria.map((item, i) => (
                    <div key={item.id} className={cn(
                      "p-4 rounded-2xl border transition-all",
                      i === 0 ? "col-span-2 bg-blue-50 border-blue-100" : "bg-white border-slate-100"
                    )}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-600">{item.name}</span>
                        <span className="text-xs font-black text-blue-600 font-mono">
                          {testScores[item.id] || 0} <span className="text-[9px] text-slate-300">/ 100</span>
                        </span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", i === 0 ? "bg-blue-600" : "bg-blue-400")} 
                          style={{ width: `${testScores[item.id] || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-40 bg-slate-50/50 rounded-2xl border border-slate-100 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 'bold' }} />
                      <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
