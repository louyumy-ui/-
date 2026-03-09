import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Info, Settings2, ChevronRight, Search, Filter, 
  MoreHorizontal, ArrowLeft, MessageSquare, PhoneCall, TrendingUp, 
  Settings, Bell, Cloud, ChevronLeft, User, Calendar, Play, 
  Download, Star, BarChart3, Zap, Users, PieChart, Check, Copy,
  ShieldCheck, LayoutGrid, Library, Save, AlertCircle
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart as RechartsPieChart, Pie
} from 'recharts';
import { SvgCopyButton } from './SvgCopyButton';
import { cn } from '../lib/utils';

// --- 原子维度库 ---
const ATOMIC_LIBRARY = [
  { id: 'a1', name: '开场白合规', category: '流程', desc: '是否包含标准问候语、公司名称及身份说明。' },
  { id: 'a2', name: '语速控制', category: '素质', desc: '语速是否平稳，是否存在过快或过慢情况。' },
  { id: 'a3', name: '需求挖掘', category: '业务', desc: '是否通过有效提问挖掘客户潜在需求。' },
  { id: 'a4', name: '异议处理', category: '业务', desc: '面对客户拒绝或疑问时，是否能专业化解。' },
  { id: 'a5', name: '结束语礼貌', category: '流程', desc: '是否有礼貌的道别及后续服务提醒。' },
  { id: 'a6', name: '情绪价值', category: '情绪', desc: '通话过程中是否展现出积极、共情的情绪。' },
  { id: 'a7', name: '产品关键点', category: '业务', desc: '是否准确传达了产品的核心卖点和价格。' },
  { id: 'a8', name: '禁言规避', category: '合规', desc: '是否避开了行业禁止使用的敏感词汇。' },
];

// --- 官方套组模板 ---
const OFFICIAL_TEMPLATES = [
  { 
    id: 't1', 
    name: '金融电销标准套组', 
    type: 'official',
    dimensions: [
      { id: 'a1', weight: 15 },
      { id: 'a3', weight: 30 },
      { id: 'a4', weight: 30 },
      { id: 'a7', weight: 15 },
      { id: 'a8', weight: 10 },
    ]
  },
  { 
    id: 't2', 
    name: '售后回访通用套组', 
    type: 'official',
    dimensions: [
      { id: 'a1', weight: 10 },
      { id: 'a2', weight: 10 },
      { id: 'a5', weight: 20 },
      { id: 'a6', weight: 60 },
    ]
  }
];

// --- 方案列表数据 ---
const SCHEMES = [
  { id: '1', name: '通用外呼打分方案', creator: '张经理', createTime: '2026-01-15 14:20:05', lastUpdateTime: '2026-03-01 09:45:12', modifier: '张经理', status: '使用中' },
  { id: '2', name: '金融产品电销方案', creator: '李主管', createTime: '2026-02-10 11:30:00', lastUpdateTime: '2026-02-28 16:20:55', modifier: '李主管', status: '草稿' },
];

interface Dimension {
  id: string;
  name: string;
  weight: number;
  locked: boolean;
  desc: string;
}

export const CriteriaModule = () => {
  const [view, setView] = useState<'list' | 'edit' | 'script-creation'>('list');
  const [editMode, setEditMode] = useState<'template' | 'custom'>('custom');
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [criteria, setCriteria] = useState<Dimension[]>([]);
  const [weightError, setWeightError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [testScores, setTestScores] = useState<Record<string, number>>({});
  const [showSaveToast, setShowSaveToast] = useState(false);

  // 话术创建相关状态
  const [scriptName, setScriptName] = useState('');
  const [robotQuality, setRobotQuality] = useState('standard'); // standard, high, pro
  const [scriptContent, setScriptContent] = useState('');

  // --- 分值自动平分逻辑 ---
  const rebalanceWeights = (currentCriteria: Dimension[], changedId?: string, newWeight?: number) => {
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
      setWeightError("剩余分值不足以分配给其他维度，请调低已锁定项的占比或取消部分维度。");
      // setTimeout(() => setWeightError(''), 4000); // 4秒后自动消失
      return currentCriteria; // 终止本次修改，保持原样
    }

    // Distribute remaining weight among unlocked dimensions using integers
    let distributedSum = 0;
    const newCriteria = currentCriteria.map(d => {
      if (d.id === changedId) return { ...d, weight: newWeight !== undefined ? newWeight : d.weight };
      if (d.locked) return d;
      
      let distributedWeight = Math.round(remaining / unlockedDimensions.length);
      distributedWeight = Math.max(0, distributedWeight);
      distributedSum += distributedWeight;
      
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

  // --- 切换维度选中状态 (穿梭框逻辑) ---
  const toggleDimension = (atomicId: string) => {
    if (editMode === 'template') return; // 模板模式不可增删

    const exists = criteria.find(d => d.id === atomicId);
    let nextCriteria;
    if (exists) {
      nextCriteria = criteria.filter(d => d.id !== atomicId);
    } else {
      const atomic = ATOMIC_LIBRARY.find(a => a.id === atomicId)!;
      nextCriteria = [...criteria, { ...atomic, weight: 0, locked: false }];
    }
    
    const balanced = rebalanceWeights(nextCriteria);
    setCriteria(balanced);
    
    // 自动保存提示
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  const handleWeightChange = (id: string, weight: number) => {
    const balanced = rebalanceWeights(criteria, id, weight);
    setCriteria(balanced);
  };

  const toggleLock = (id: string) => {
    setCriteria(prev => prev.map(d => d.id === id ? { ...d, locked: !d.locked } : d));
  };

  const handleEdit = (scheme: any) => {
    setSelectedScheme(scheme);
    setView('edit');
    // 默认加载一些维度
    setCriteria(ATOMIC_LIBRARY.slice(0, 4).map(a => ({ ...a, weight: 25, locked: false })));
  };

  const selectTemplate = (template: any) => {
    setEditMode('template');
    const dims = template.dimensions.map((d: any) => {
      const atomic = ATOMIC_LIBRARY.find(a => a.id === d.id)!;
      return { ...atomic, weight: d.weight, locked: false };
    });
    setCriteria(dims);
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

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const newScores: any = {};
      criteria.forEach(c => newScores[c.id] = Math.floor(Math.random() * 30) + 70);
      setTestScores(newScores);
    }, 1500);
  };

  const handleCopyFullText = () => {
    navigator.clipboard.writeText(transcript);
  };

  if (view === 'list') {
    return (
      <div id="criteria-root" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">评分标准制定</h2>
            <p className="text-slate-500 text-sm mt-1">配置质检维度、分值及自动化评分逻辑</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setView('script-creation')}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> 创建话术
            </button>
            <button 
              onClick={() => {
                setEditMode('custom');
                setCriteria([]);
                setView('edit');
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> 新增方案
            </button>
          </div>
        </div>

        <div id="scheme-list-section" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-8 min-h-[600px] relative">
          <div className="absolute top-4 right-4 z-10">
            <SvgCopyButton targetId="scheme-list-section" label="复制列表 SVG" />
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">方案名称</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">最后修改时间</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">修改人</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SCHEMES.map((scheme) => (
                <tr key={scheme.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => handleEdit(scheme)}>
                  <td className="px-6 py-4 font-bold text-slate-900">{scheme.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold", scheme.status === '使用中' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                      {scheme.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">{scheme.createTime}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">{scheme.lastUpdateTime}</td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-bold">{scheme.modifier}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Settings2 size={16} /></button>
                      <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === 'script-creation') {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all">
            <ChevronLeft size={20} /> 返回列表
          </button>
          <div className="flex gap-3">
            <div className="group relative">
              <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">存为草稿</button>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                仅与当前话术绑定
              </div>
            </div>
            <div className="group relative">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-700">保存并发布</button>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                同步至通用模板库，支持一键复用
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">创建新话术</h2>
            <p className="text-slate-500 text-sm mt-1">配置机器人通话逻辑与交互话术内容</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">话术名称</label>
              <input 
                type="text" 
                value={scriptName}
                onChange={(e) => setScriptName(e.target.value)}
                placeholder="请输入话术名称，如：金融产品首访话术"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                * 机器人通话质量
                <Info size={14} className="text-slate-300" />
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'standard', name: '基础质检(适合通用)', desc: '覆盖核心合规点，响应极快', icon: Zap },
                  { id: 'high', name: '严格质检(适合高要求)', desc: '深度语义分析，语调自然亲切', icon: Star },
                  { id: 'pro', name: '自定义(专业人员)', desc: '支持复杂逻辑，几乎无法分辨', icon: ShieldCheck },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setRobotQuality(item.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all group",
                      robotQuality === item.id ? "border-blue-600 bg-blue-50/50" : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all",
                      robotQuality === item.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}>
                      <item.icon size={20} />
                    </div>
                    <div className="text-sm font-bold text-slate-800 mb-1">{item.name}</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">话术内容配置</label>
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded transition-all"><Plus size={16} /></button>
                  <div className="w-px h-4 bg-slate-200 my-auto mx-1"></div>
                  <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:bg-white rounded transition-all">插入变量</button>
                  <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:bg-white rounded transition-all">逻辑跳转</button>
                </div>
                <textarea 
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  placeholder="请输入话术流程内容...&#10;例如：&#10;[开场白] 您好，我是XX公司的AI助手...&#10;[分支1] 如果客户回答“不需要”，则跳转到..."
                  className="w-full h-64 p-4 text-sm text-slate-600 outline-none font-mono resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'edit') {
    const totalWeight = criteria.reduce((sum, d) => sum + d.weight, 0);
    return (
      <div id="criteria-root" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><ArrowLeft size={20} /></button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedScheme?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">当前模式:</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                  <button 
                    onClick={() => setEditMode('custom')}
                    className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", editMode === 'custom' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
                  >自定义配置</button>
                  <button 
                    onClick={() => setEditMode('template')}
                    className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", editMode === 'template' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
                  >模板中心</button>
                </div>
              </div>
            </div>
          </div>
        <div className="flex gap-3">
          {showSaveToast && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold animate-in fade-in slide-in-from-top-2">
              <Check size={14} /> 自定义模板已保存 (仅与当前话术绑定)
            </div>
          )}
          <button 
            onClick={() => setIsTesting(!isTesting)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm", isTesting ? "bg-amber-500 text-white" : "bg-white border border-slate-200 text-slate-600")}
          >
            <Zap size={18} /> {isTesting ? "退出测试" : "进入测试模式"}
          </button>
          <SvgCopyButton targetId="criteria-root" />
        </div>
      </div>

      <div id="criteria-config-area" className="grid grid-cols-12 gap-6 min-h-[800px] relative">
        {/* 🌟 核心修改：把错误弹窗直接放在被截取的区域内部 🌟 */}
        {weightError && (
          <div className="absolute top-4 right-4 z-[99] flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold shadow-lg shadow-rose-100">
            <AlertCircle size={16} /> 
            {weightError}
            <button onClick={() => setWeightError('')} className="ml-2 hover:text-rose-800">✕</button>
          </div>
        )}
        {/* 左侧：原子维度库 / 模板列表 */}
        <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-y-auto max-h-[800px]">
          {editMode === 'custom' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Library size={18} className="text-blue-500" /> 原子维度库</h3>
                <span className="text-[10px] font-bold text-slate-400">{ATOMIC_LIBRARY.length} 指标</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" placeholder="搜索指标..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-3">
                {ATOMIC_LIBRARY.map(item => {
                  const isSelected = criteria.some(d => d.id === item.id);
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleDimension(item.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all group",
                        isSelected ? "border-blue-500 bg-blue-50/50" : "border-slate-50 bg-slate-50 hover:border-slate-200"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-700">{item.name}</span>
                        {isSelected ? <Check size={14} className="text-blue-500" /> : <Plus size={14} className="text-slate-300 group-hover:text-slate-500" />}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{item.desc}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[8px] font-bold text-slate-400 uppercase">{item.category}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><LayoutGrid size={18} className="text-blue-500" /> 行业标准套组</h3>
              <div className="space-y-4">
                {OFFICIAL_TEMPLATES.map(tmpl => (
                  <div 
                    key={tmpl.id}
                    onClick={() => selectTemplate(tmpl)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-700">{tmpl.name}</span>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tmpl.dimensions.map(d => (
                        <span key={d.id} className="px-1.5 py-0.5 bg-slate-100 rounded text-[8px] text-slate-500 font-medium">
                          {ATOMIC_LIBRARY.find(a => a.id === d.id)?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：分值策略引擎 / 测试环境 */}
        <div className="col-span-9 space-y-6">
          {!isTesting ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Settings2 size={20} className="text-blue-500" />
                <h3 className="text-lg font-bold text-slate-800">分值策略引擎</h3>
                {editMode === 'template' && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold border border-amber-100 flex items-center gap-1">
                    <AlertCircle size={10} /> 模板模式：维度不可增删
                  </span>
                )}
              </div>
              <div className={cn(
                "px-4 py-2 rounded-xl text-sm font-black font-mono flex items-center gap-3",
                Math.abs(totalWeight - 100) < 0.01 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                <span>总分: {Math.round(totalWeight)}分</span>
                {Math.abs(totalWeight - 100) < 0.01 ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
              </div>
            </div>

              {criteria.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                    <Library size={32} />
                  </div>
                  <p className="text-sm font-medium">请从左侧勾选原子维度开始配置</p>
                </div>
              ) : (
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {criteria.map(item => (
                    <div key={item.id} className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                      <div className="grid grid-cols-12 gap-6 items-center">
                        <div className="col-span-3">
                          <div className="text-sm font-bold text-slate-800 mb-1">{item.name}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</div>
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
                            <span>{item.locked ? "已锁定" : "锁定"}</span>
                          </button>
                          {editMode === 'custom' && (
                            <button 
                              onClick={() => toggleDimension(item.id)}
                              className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-500">分值分布</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-400">剩余待分配</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="group relative">
                    <button 
                      className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <Save size={18} /> 存为草稿
                    </button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      仅与当前话术绑定
                    </div>
                  </div>
                  <div className="group relative">
                    <button 
                      disabled={Math.abs(totalWeight - 100) > 0.01 || criteria.length === 0}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                    >
                      <Check size={18} /> 保存并发布
                    </button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      同步至通用模板库，支持一键复用
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* 测试输入 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><MessageSquare size={18} className="text-blue-500" /> 通话文本模拟</h3>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">加载示例</button>
                </div>
                <div className="flex-1 relative">
                  <textarea 
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="w-full h-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 font-mono resize-none"
                    placeholder={"请输入对话内容...\n例如：\nAI：您好，请问是王先生吗？\n客户：是的。"}
                  />
                  <button 
                    onClick={handleCopyFullText}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur shadow-sm border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-all flex items-center gap-2 text-[10px] font-bold"
                  >
                    <Copy size={12} /> 一键复制全文
                  </button>
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center animate-in fade-in">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <span className="text-xs font-bold text-blue-600">AI 正在深度诊断...</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
                >
                  开始智能分析
                </button>
              </div>

              {/* 测试结果 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">综合诊断得分</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black font-mono">{calculateTotalScore()}</span>
                    <span className="text-sm font-bold opacity-70">/ 100</span>
                  </div>
                  <div className="mt-4 inline-flex px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold backdrop-blur-md border border-white/20">
                    评级: {parseFloat(calculateTotalScore()) >= 85 ? "A 优秀" : "B 良好"}
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">维度得分明细</h4>
                  {criteria.map(item => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="text-blue-600 font-mono">{testScores[item.id] || 0}分</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${testScores[item.id] || 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} />
                      <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
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
}

return null;
};
