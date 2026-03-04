import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit3, Search, Filter, ChevronRight, 
  CheckCircle2, AlertCircle, Clock, ShieldCheck,
  Tag, LayoutGrid, FileText, Settings2, Save,
  History, ArrowUpRight, Database, Layers, MoreVertical,
  MessageSquare, Info, User, Scale
} from 'lucide-react';
import { SvgCopyButton } from './SvgCopyButton';
import { cn } from '../lib/utils';

// --- Mock 数据 ---
const INITIAL_ATOMIC_TAGS = [
  { id: 'a1', name: '开场白合规', category: '流程', status: 'active', modifier: '张经理', lastUpdate: '2026-03-01' },
  { id: 'a2', name: '语速控制', category: '素质', status: 'active', modifier: '李主管', lastUpdate: '2026-02-15' },
  { id: 'a3', name: '需求挖掘', category: '业务', status: 'active', modifier: '王组长', lastUpdate: '2026-03-02' },
  { id: 'a4', name: '情绪价值', category: '情绪', status: 'active', modifier: '张经理', lastUpdate: '2026-02-20' },
];

const CATEGORIES = ['流程', '业务', '素质', '情绪', '合规', '服务'];

const SCRIPT_ASSOCIATIONS = [
  { id: 's1', script: '金融产品电销话术 A', template: '金融电销标准套组', account: 'FIN_DEPT_01', status: 'active' },
  { id: 's2', script: '售后回访话术 V2', template: '售后回访通用套组', account: 'SERVICE_TEAM_A', status: 'active' },
  { id: 's3', script: '保险理赔咨询话术', template: '金融电销标准套组', account: 'INSURE_DEPT_B', status: 'active' },
];

const OFFICIAL_SETS = [
  { id: 'set1', name: '金融电销标准套组', dimensions: 8, lastUpdate: '2026-03-01', status: 'published' },
  { id: 'set2', name: '售后回访通用套组', dimensions: 6, lastUpdate: '2026-02-28', status: 'published' },
  { id: 'set3', name: '高潜客户挖掘套组', dimensions: 10, lastUpdate: '2026-03-02', status: 'draft' },
];

export const ManagementModule = () => {
  const [activeTab, setActiveTab] = useState<'atomic' | 'templates' | 'scripts'>('atomic');
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingTag, setEditingTag] = useState<any>(null);
  const [tags, setTags] = useState(INITIAL_ATOMIC_TAGS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [catSearch, setCatSearch] = useState('');

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setView('edit');
  };

  const handleCreate = () => {
    setEditingTag({ 
      id: `new-${Date.now()}`, 
      name: '', 
      category: '业务', 
      status: 'draft', 
      modifier: '当前用户',
      lastUpdate: new Date().toISOString().split('T')[0] 
    });
    setView('edit');
  };

  const handleSave = () => {
    if (editingTag.id.startsWith('new')) {
      setTags([...tags, { ...editingTag, id: `a${tags.length + 1}` }]);
    } else {
      setTags(tags.map(t => t.id === editingTag.id ? editingTag : t));
    }
    setView('list');
  };

  const filteredCategories = categories.filter(c => c.includes(catSearch));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">管理端控制台</h2>
          <p className="text-slate-500 text-sm mt-1">维护全局原子维度库、官方套组及话术关联关系</p>
        </div>
        <div className="flex gap-3">
          <SvgCopyButton targetId="management-content-area" />
          {view === 'list' && activeTab !== 'scripts' && (
            <button 
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-all"
            >
              <Plus size={18} />
              <span>{activeTab === 'atomic' ? '新建原子维度' : '新建官方套组'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 标签切换 */}
      {view === 'list' && (
        <div className="flex border-b border-slate-200">
          {[
            { id: 'atomic', label: '原子维度库', icon: Database },
            { id: 'templates', label: '官方套组广场', icon: LayoutGrid },
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
      )}

      <div id="management-content-area" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
        {view === 'edit' ? (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                  <ChevronRight className="rotate-180" size={20} />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{editingTag?.id.startsWith('a') ? '编辑原子维度' : '新建原子维度'}</h3>
                  <p className="text-xs text-slate-400">配置原子维度的核心属性、评分逻辑及发布状态</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('list')} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all">取消</button>
                <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all">
                  <Save size={18} />
                  <span>保存并发布</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
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
                        {catSearch && !categories.includes(catSearch) && (
                          <button 
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setCategories([...categories, catSearch]);
                              setEditingTag({...editingTag, category: catSearch});
                              setCatSearch('');
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors border-t border-slate-100"
                          >+ 新增分类: "{catSearch}" (回车确认)</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">维度描述 (业务定义)</label>
                  <textarea 
                    placeholder="从业务角度描述该维度的具体考核点..." 
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">判断标准 (Pass/Fail 准则)</label>
                  <textarea 
                    placeholder="明确拟定当前维度的判断标准，例如：必须包含'您好'且语速在180-220字/分钟之间..." 
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Settings2 size={16} className="text-blue-500" />
                      AI 识别逻辑配置 (技术实现)
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                      <Info size={12} />
                      样例参考
                    </div>
                  </div>
                  
                  <div className="space-y-4">
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
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-700">配置样例：</span>
                        <code className="ml-1 text-blue-600">("您好" | "你好") & ("工号" | "很高兴为您服务")</code>
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
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-700">Prompt 样例：</span>
                        <p className="mt-1 italic opacity-80">"请根据上述[判断标准]，分析通话文本中坐席是否达标..."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-6">
                  <h4 className="text-sm font-bold text-slate-700">发布设置</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">当前状态</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                        editingTag?.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {editingTag?.status === 'active' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">发布操作</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingTag({...editingTag, status: 'draft'})}
                          className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", editingTag?.status === 'draft' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500")}
                        >下线/草稿</button>
                        <button 
                          onClick={() => setEditingTag({...editingTag, status: 'active'})}
                          className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", editingTag?.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}
                        >立即发布</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-slate-700">元数据信息</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1"><User size={10}/> 责任人</span>
                      <span className="text-[11px] text-slate-600 font-bold">{editingTag?.modifier}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1"><Clock size={10}/> 最后更新</span>
                      <span className="text-[11px] text-slate-600 font-mono">{editingTag?.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                      <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">编辑模板</button>
                      <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all"><MoreVertical size={16} /></button>
                    </div>
                  </div>
                ))}
                <button className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all space-y-2 min-h-[240px]">
                  <Plus size={32} />
                  <span className="text-sm font-bold">创建新官方套组</span>
                </button>
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
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
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
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                              <CheckCircle2 size={12} />
                              生效中
                            </span>
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
    </div>
  );
};
