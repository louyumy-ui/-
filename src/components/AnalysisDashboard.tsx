import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, BarChart, Bar, ComposedChart, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { 
  TrendingUp, Users, PhoneCall, Clock, ArrowUpRight, ArrowDownRight, 
  Download, Calendar, Filter, RotateCcw, ChevronDown, MessageSquare,
  Activity, Tag, ShieldCheck, BarChart3, PieChart, LayoutDashboard, Info,
  ChevronRight, ListFilter, Search, MoreVertical, FileText, CheckCircle2
} from 'lucide-react';
import { SvgCopyButton } from './SvgCopyButton';
import { cn } from '../lib/utils';

// --- 类型定义 ---
type GroupId = 'results' | 'efficiency' | 'tags' | 'scores';

interface MetricGroup {
  id: GroupId;
  title: string;
  mainLabel: string;
  mainValue: string;
  subMetrics: { label: string; value: string; detail?: string[] }[];
  color: string;
  icon: React.ReactNode;
}

// --- Mock 数据 ---
// 🌟 新增：时间维度降采样数据模拟
const DOWN_SAMPLED_DATA = {
  '日': [
    { date: '03-01', total: 420, connected: 380, busy: 20, empty: 10, poweroff: 5, suspended: 5, rate: 90.5, tags: 120, tag1: 50, tag2: 40, tag3: 30, score: 88.5, s1: 9.2, s2: 8.5, s3: 8.8, totalDuration: 12.5, avgDuration: 118 },
    { date: '03-02', total: 380, connected: 340, busy: 25, empty: 8, poweroff: 4, suspended: 3, rate: 89.4, tags: 110, tag1: 45, tag2: 35, tag3: 30, score: 86.2, s1: 8.8, s2: 8.2, s3: 8.5, totalDuration: 11.2, avgDuration: 122 },
    { date: '03-03', total: 450, connected: 410, busy: 15, empty: 12, poweroff: 8, suspended: 5, rate: 91.1, tags: 140, tag1: 60, tag2: 50, tag3: 30, score: 90.1, s1: 9.5, s2: 8.8, s3: 9.2, totalDuration: 14.1, avgDuration: 115 },
    { date: '03-04', total: 410, connected: 370, busy: 22, empty: 10, poweroff: 5, suspended: 3, rate: 90.2, tags: 125, tag1: 55, tag2: 40, tag3: 30, score: 87.8, s1: 9.0, s2: 8.4, s3: 8.7, totalDuration: 12.8, avgDuration: 120 },
    { date: '03-05', total: 390, connected: 350, busy: 20, empty: 10, poweroff: 6, suspended: 4, rate: 89.7, tags: 115, tag1: 48, tag2: 37, tag3: 30, score: 85.5, s1: 8.6, s2: 8.1, s3: 8.4, totalDuration: 11.8, avgDuration: 125 },
    { date: '03-06', total: 440, connected: 400, busy: 18, empty: 12, poweroff: 7, suspended: 3, rate: 90.9, tags: 135, tag1: 58, tag2: 47, tag3: 30, score: 89.2, s1: 9.3, s2: 8.7, s3: 9.0, totalDuration: 13.5, avgDuration: 117 },
    { date: '03-07', total: 405, connected: 365, busy: 20, empty: 10, poweroff: 6, suspended: 4, rate: 90.1, tags: 122, tag1: 52, tag2: 40, tag3: 30, score: 87.2, s1: 8.9, s2: 8.3, s3: 8.6, totalDuration: 12.2, avgDuration: 121 }
  ],
  '月': [
    { date: '2026-03', total: 14000, connected: 12700, busy: 900, empty: 300, poweroff: 70, suspended: 30, rate: 90.7, tags: 4400, tag1: 1900, tag2: 1500, tag3: 1000, score: 90.5, s1: 9.3, s2: 8.8, s3: 9.1, totalDuration: 440, avgDuration: 118 },
    { date: '2026-02', total: 13500, connected: 12200, busy: 880, empty: 320, poweroff: 80, suspended: 20, rate: 90.4, tags: 4200, tag1: 1800, tag2: 1400, tag3: 1000, score: 89.8, s1: 9.2, s2: 8.7, s3: 9.0, totalDuration: 425, avgDuration: 120 },
    { date: '2026-01', total: 12900, connected: 11600, busy: 820, empty: 280, poweroff: 150, suspended: 50, rate: 89.9, tags: 3950, tag1: 1600, tag2: 1350, tag3: 1000, score: 88.7, s1: 9.0, s2: 8.5, s3: 8.8, totalDuration: 400, avgDuration: 123 },
    { date: '2025-12', total: 13200, connected: 11900, busy: 850, empty: 300, poweroff: 100, suspended: 50, rate: 90.1, tags: 4100, tag1: 1700, tag2: 1400, tag3: 1000, score: 89.1, s1: 9.1, s2: 8.6, s3: 8.9, totalDuration: 410, avgDuration: 121 },
    { date: '2025-11', total: 11800, connected: 10600, busy: 750, empty: 250, poweroff: 120, suspended: 80, rate: 89.8, tags: 3600, tag1: 1400, tag2: 1200, tag3: 1000, score: 88.2, s1: 9.0, s2: 8.5, s3: 8.8, totalDuration: 365, avgDuration: 124 },
    { date: '2025-10', total: 12500, connected: 11200, busy: 800, empty: 300, poweroff: 150, suspended: 50, rate: 89.6, tags: 3800, tag1: 1500, tag2: 1300, tag3: 1000, score: 87.5, s1: 8.9, s2: 8.4, s3: 8.7, totalDuration: 380, avgDuration: 122 }
  ],
  '年': [
    { date: '2026', total: 168000, connected: 152000, busy: 10500, empty: 3000, poweroff: 2000, suspended: 500, rate: 90.4, tags: 52000, tag1: 22000, tag2: 18000, tag3: 12000, score: 89.5, s1: 9.1, s2: 8.6, s3: 8.9, totalDuration: 5100, avgDuration: 121 },
    { date: '2025', total: 155000, connected: 139000, busy: 11000, empty: 3500, poweroff: 1000, suspended: 500, rate: 89.6, tags: 48000, tag1: 20000, tag2: 16000, tag3: 12000, score: 87.1, s1: 8.8, s2: 8.3, s3: 8.6, totalDuration: 4600, avgDuration: 123 },
    { date: '2024', total: 142000, connected: 126000, busy: 10000, empty: 4000, poweroff: 1500, suspended: 500, rate: 88.7, tags: 45000, tag1: 18000, tag2: 15000, tag3: 12000, score: 85.2, s1: 8.6, s2: 8.1, s3: 8.4, totalDuration: 4200, avgDuration: 125 }
  ]
};

const METRIC_GROUPS: MetricGroup[] = [
  {
    id: 'results',
    title: '呼叫结果明细',
    mainLabel: '拨打总量',
    mainValue: '1,600',
    color: 'blue',
    icon: <PhoneCall size={20} />,
    subMetrics: [
      { label: '已接听量', value: '1,250' },
      { label: '未接通总量', value: '350', detail: ['响铃未接: 120', '空号: 80', '关机: 100', '停机: 50'] }
    ]
  },
  {
    id: 'efficiency',
    title: '通话效率明细',
    mainLabel: '接通率',
    mainValue: '78.1%',
    color: 'emerald',
    icon: <Activity size={20} />,
    subMetrics: [
      { label: '接通率', value: '78.1%' },
      { label: '总通话时长', value: '12.5h' },
      { label: '平均通话时长', value: '35s' }
    ]
  },
  {
    id: 'tags',
    title: '通话标签明细',
    mainLabel: '工单标签总量',
    mainValue: '720',
    color: 'rose',
    icon: <Tag size={20} />,
    subMetrics: [
      { label: '自定义标签 1', value: '320' },
      { label: '自定义标签 2', value: '210' },
      { label: '自定义标签 3', value: '150' },
      { label: '无标签通话量', value: '40' }
    ]
  },
  {
    id: 'scores',
    title: '综合质量评分',
    mainLabel: '综合质量总分',
    mainValue: '91.2',
    color: 'indigo',
    icon: <ShieldCheck size={20} />,
    subMetrics: [
      { label: '评分维度 1', value: '9.2' },
      { label: '评分维度 2', value: '8.5' },
      { label: '评分维度 3', value: '7.8' }
    ]
  }
];

export const AnalysisDashboard: React.FC = () => {
  const [activeGroups, setActiveGroups] = useState<GroupId[]>(['results', 'scores']);
  const [timeRange, setTimeRange] = useState<'日' | '月' | '年'>('日');
  const [compareMode, setCompareMode] = useState<'overall' | 'detailed'>('detailed');

  const currentChartData = useMemo(() => {
    return (DOWN_SAMPLED_DATA as any)[timeRange] || DOWN_SAMPLED_DATA['日'];
  }, [timeRange]);

  // --- FIFO 联动逻辑 ---
  const toggleGroup = (id: GroupId) => {
    setActiveGroups(prev => {
      if (prev.includes(id)) {
        return prev.filter(g => g !== id);
      }
      const next = [...prev, id];
      if (next.length > 2) {
        return next.slice(1); // 移除最早选中的 (FIFO)
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50" id="analysis-root">
      {/* 顶部筛选器 */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0084FF] rounded-lg text-white shadow-md shadow-blue-200">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">数据分析大盘</h1>
            <p className="text-xs text-slate-500">全链路质量评估数据实时监控与多维下钻分析</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100">
            <span className={cn("text-[10px] font-bold transition-colors", compareMode === 'overall' ? "text-blue-600" : "text-slate-400")}>总体数据</span>
            <button 
              onClick={() => setCompareMode(compareMode === 'overall' ? 'detailed' : 'overall')}
              className="w-10 h-5 bg-slate-200 rounded-full relative transition-all overflow-hidden border border-slate-300"
            >
              <div className={cn(
                "absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all duration-300",
                compareMode === 'overall' ? "left-0.5" : "left-5.5 bg-blue-600"
              )}></div>
            </button>
            <span className={cn("text-[10px] font-bold transition-colors", compareMode === 'detailed' ? "text-blue-600" : "text-slate-400")}>切片细致数据</span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['日', '月', '年', '自定义'].map(r => (
              <button 
                key={r}
                className={cn("px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all", timeRange === r ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
                onClick={() => setTimeRange(r)}
              >{r}</button>
            ))}
          </div>
          <SvgCopyButton targetId="analysis-root" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 space-y-8" id="analysis-content-area">
        <div className="w-[1440px] mx-auto space-y-8">
          {/* 2x2 核心指标矩阵 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 左侧：客观结果组 */}
            <div className="grid grid-cols-2 gap-4">
              {METRIC_GROUPS.slice(0, 2).map((group) => {
                const isActive = activeGroups.includes(group.id);
                return (
                  <div 
                    key={group.id}
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      "p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group relative overflow-hidden",
                      isActive ? "border-blue-500 bg-white shadow-xl shadow-blue-100 -translate-y-1" : "border-white bg-white shadow-sm hover:border-slate-200"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("p-2.5 rounded-xl", isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-400")}>
                        {group.icon}
                      </div>
                      {isActive && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{group.title}</h4>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-slate-800 font-mono">{group.mainValue}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{group.mainLabel}</span>
                    </div>
                    <div className="space-y-2">
                      {group.subMetrics.map((sm, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500">{sm.label}</span>
                            <span className="text-[10px] font-bold text-slate-700">{sm.value}</span>
                          </div>
                          {sm.detail && compareMode === 'detailed' && (
                            <div className="grid grid-cols-2 gap-1 pl-2 border-l border-slate-100">
                              {sm.detail.map((d, j) => (
                                <span key={j} className="text-[9px] text-slate-400">{d}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 右侧：质量评估组 */}
            <div className="grid grid-cols-2 gap-4">
              {METRIC_GROUPS.slice(2, 4).map((group) => {
                const isActive = activeGroups.includes(group.id);
                return (
                  <div 
                    key={group.id}
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      "p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group relative overflow-hidden",
                      isActive ? "border-blue-500 bg-white shadow-xl shadow-blue-100 -translate-y-1" : "border-white bg-white shadow-sm hover:border-slate-200"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("p-2.5 rounded-xl", isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-400")}>
                        {group.icon}
                      </div>
                      {isActive && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{group.title}</h4>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-slate-800 font-mono">{group.mainValue}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{group.mainLabel}</span>
                    </div>
                    <div className="space-y-2">
                      {group.subMetrics.map((sm, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500">{sm.label}</span>
                            <span className="text-[10px] font-bold text-slate-700">{sm.value}</span>
                          </div>
                          {sm.detail && compareMode === 'detailed' && (
                            <div className="grid grid-cols-2 gap-1 pl-2 border-l border-slate-100">
                              {sm.detail.map((d, j) => (
                                <span key={j} className="text-[9px] text-slate-400">{d}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 可视化趋势区 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp size={18} className="text-blue-500" />
                <h3 className="text-sm font-bold text-slate-700">多维分析看板</h3>
                <div className="flex gap-2 ml-4">
                  {activeGroups.map(id => (
                    <span key={id} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">
                      {METRIC_GROUPS.find(g => g.id === id)?.title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div> 左轴: 数值型 (柱状)
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> 右轴: 比率/分值 (波浪)
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={currentChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '16px' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 0' }}
                    labelStyle={{ fontSize: '12px', fontWeight: 'black', color: '#1e293b', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}
                  />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px', fontWeight: 'bold' }} />
                  
                  {/* 联动渲染逻辑 */}
                  {activeGroups.includes('results') && (
                    <>
                      {compareMode === 'overall' && (
                        <Bar yAxisId="left" name="拨打总量" dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                      )}
                      {compareMode === 'detailed' && (
                        <>
                          <Bar yAxisId="left" name="已接听" dataKey="connected" stackId="a" fill="#1e3a8a" barSize={30} />
                          <Bar yAxisId="left" name="响铃未接" dataKey="busy" stackId="a" fill="#1e40af" barSize={30} />
                          <Bar yAxisId="left" name="空号" dataKey="empty" stackId="a" fill="#2563eb" barSize={30} />
                          <Bar yAxisId="left" name="关机" dataKey="poweroff" stackId="a" fill="#3b82f6" barSize={30} />
                          <Bar yAxisId="left" name="停机" dataKey="suspended" stackId="a" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={30} />
                        </>
                      )}
                    </>
                  )}
                  {activeGroups.includes('tags') && (
                    <>
                      {compareMode === 'overall' && (
                        <Bar yAxisId="left" name="标签总量" dataKey="tags" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
                      )}
                      {compareMode === 'detailed' && (
                        <>
                          <Bar yAxisId="left" name="自定义标签 1" dataKey="tag1" stackId="b" fill="#f43f5e" barSize={30} />
                          <Bar yAxisId="left" name="自定义标签 2" dataKey="tag2" stackId="b" fill="#fb7185" barSize={30} />
                          <Bar yAxisId="left" name="自定义标签 3" dataKey="tag3" stackId="b" fill="#fda4af" radius={[4, 4, 0, 0]} barSize={30} />
                        </>
                      )}
                    </>
                  )}
                  {activeGroups.includes('efficiency') && (
                    <>
                      <Area yAxisId="right" name="接通率" type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} fillOpacity={0.1} fill="#10b981" />
                      {compareMode === 'detailed' && (
                        <>
                          <Line yAxisId="left" name="总通话时长(h)" type="monotone" dataKey="totalDuration" stroke="#059669" strokeWidth={2} dot={false} />
                          <Line yAxisId="right" name="平均时长(s)" type="monotone" dataKey="avgDuration" stroke="#34d399" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </>
                      )}
                    </>
                  )}
                  {activeGroups.includes('scores') && (
                    <>
                      {compareMode === 'overall' && (
                        <Area yAxisId="right" name="综合得分" type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={0.1} fill="#6366f1" />
                      )}
                      {compareMode === 'detailed' && (
                        <>
                          <Area yAxisId="right" name="评分维度 1" type="monotone" dataKey="s1" stroke="#6366f1" strokeWidth={2} fillOpacity={0.05} fill="#6366f1" />
                          <Area yAxisId="right" name="评分维度 2" type="monotone" dataKey="s2" stroke="#818cf8" strokeWidth={2} fillOpacity={0.05} fill="#818cf8" />
                          <Area yAxisId="right" name="评分维度 3" type="monotone" dataKey="s3" stroke="#a5b4fc" strokeWidth={2} fillOpacity={0.05} fill="#a5b4fc" />
                        </>
                      )}
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 联动详情区 */}
          <div className="space-y-8">
            {activeGroups.includes('tags') && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Tag size={18} className="text-purple-500" />
                    <h3 className="text-sm font-bold text-slate-700">工单业务视图</h3>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {['高意向', '官网咨询', '售后诉求', '无标签'].map((label, i) => (
                    <div key={label} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</div>
                      <div className="text-xl font-black text-slate-800 font-mono">{[320, 210, 150, 40][i]}</div>
                      <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${[45, 30, 20, 5][i]}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeGroups.includes('scores') && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-700">质检诊断视图</h3>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-5 space-y-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">子维度得分 (当前分/总分)</h4>
                    {['开场白合规', '语速控制', '需求挖掘', '异议处理'].map((dim, i) => (
                      <div key={dim} className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-600">{dim}</span>
                          <span className="text-blue-600 font-mono">{[22.5, 21.2, 19.5, 18.0][i]} <span className="text-slate-300">/ 25</span></span>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${([22.5, 21.2, 19.5, 18.0][i] / 25) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-7">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">多维质检雷达图 (最新周期: {currentChartData[currentChartData.length - 1]?.date})</h4>
                    <div className="h-[240px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                          { subject: '开场白合规', A: 90, full: 100 },
                          { subject: '语速控制', A: 85, full: 100 },
                          { subject: '需求挖掘', A: 78, full: 100 },
                          { subject: '异议处理', A: 72, full: 100 },
                          { subject: '情绪价值', A: 88, full: 100 },
                        ]}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                          <Radar name="得分" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部明细数据 (子母表) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="analysis-detail-table-container">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">
                {activeGroups.includes('scores') ? '质检诊断明细数据' : '每日明细数据明细'}
              </h3>
              <div className="flex items-center gap-3">
                <SvgCopyButton targetId="analysis-detail-table-container" label="复制表格 SVG" />
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200">
                  <Download size={14} /> 导出报表
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1800px]">
                <thead id="analysis-table-header">
                  {activeGroups.includes('scores') ? (
                    <tr className="bg-indigo-50/30 text-[10px] font-bold text-indigo-900 uppercase tracking-wider border-b border-indigo-100">
                      <th className="px-4 py-4 sticky left-0 bg-indigo-50/30 z-20">日期</th>
                      <th className="px-4 py-4">综合得分</th>
                      <th className="px-4 py-4">开场白得分</th>
                      <th className="px-4 py-4">语速控制得分</th>
                      <th className="px-4 py-4">需求挖掘得分</th>
                      <th className="px-4 py-4">异议处理得分</th>
                      <th className="px-4 py-4">结束语得分</th>
                      <th className="px-4 py-4">情绪价值得分</th>
                      <th className="px-4 py-4">产品关键点得分</th>
                      <th className="px-4 py-4">禁言规避得分</th>
                      <th className="px-4 py-4">AI 判定结论</th>
                      <th className="px-4 py-4 text-right sticky right-0 bg-indigo-50/30 z-20">操作</th>
                    </tr>
                  ) : (
                    <>
                      <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <th className="px-4 py-4 sticky left-0 bg-slate-50/50 z-20">日期</th>
                        <th className="px-4 py-4 text-center bg-blue-50/30" colSpan={7}>呼叫结果明细</th>
                        <th className="px-4 py-4 text-center bg-emerald-50/30" colSpan={3}>通话效率明细</th>
                        <th className="px-4 py-4 text-center bg-rose-50/30" colSpan={4}>通话标签明细</th>
                        <th className="px-4 py-4 text-center bg-indigo-50/30" colSpan={4}>综合质量评分</th>
                        <th className="px-4 py-4 text-right sticky right-0 bg-slate-50/50 z-20">操作</th>
                      </tr>
                      <tr className="bg-slate-50/80 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-4 py-3 sticky left-0 bg-slate-50/80 z-20">Date</th>
                        <th className="px-4 py-3">拨打总量</th>
                        <th className="px-4 py-3">已接听量</th>
                        <th className="px-4 py-3">未接通总量</th>
                        <th className="px-4 py-3">响铃未接</th>
                        <th className="px-4 py-3">空号</th>
                        <th className="px-4 py-3">关机</th>
                        <th className="px-4 py-3">停机</th>
                        <th className="px-4 py-3">接通率</th>
                        <th className="px-4 py-3">总时长(h)</th>
                        <th className="px-4 py-3">平均时长(s)</th>
                        <th className="px-4 py-3">标签1</th>
                        <th className="px-4 py-3">标签2</th>
                        <th className="px-4 py-3">标签3</th>
                        <th className="px-4 py-3">无标签</th>
                        <th className="px-4 py-3">总分</th>
                        <th className="px-4 py-3">维度1</th>
                        <th className="px-4 py-3">维度2</th>
                        <th className="px-4 py-3">维度3</th>
                        <th className="px-4 py-3 sticky right-0 bg-slate-50/80 z-20"></th>
                      </tr>
                    </>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentChartData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group text-[11px]">
                      <td className="px-4 py-4 font-bold text-slate-700 sticky left-0 bg-white z-10 group-hover:bg-slate-50/50">{row.date}</td>
                      {activeGroups.includes('scores') ? (
                        <>
                          <td className="px-4 py-4 font-mono text-indigo-600 font-bold">{row.score}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{row.s1}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{row.s2}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{row.s3}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{(Math.random() * 2 + 7).toFixed(1)}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{(Math.random() * 2 + 7).toFixed(1)}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{(Math.random() * 2 + 7).toFixed(1)}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{(Math.random() * 2 + 7).toFixed(1)}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{(Math.random() * 2 + 7).toFixed(1)}</td>
                          <td className="px-4 py-4 text-slate-500 italic">系统判定：整体流程合规，建议加强异议处理。</td>
                          <td className="px-4 py-4 text-right sticky right-0 bg-white z-10 group-hover:bg-slate-50/50">
                            <button className="p-1 text-slate-400 hover:text-blue-500 transition-colors">
                              <MoreVertical size={14} />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-4 font-mono text-slate-600">{row.total}</td>
                          <td className="px-4 py-4 font-mono text-blue-600 font-bold">{row.connected}</td>
                          <td className="px-4 py-4 font-mono text-rose-600 font-bold">{row.total - row.connected}</td>
                          <td className="px-4 py-4 font-mono text-slate-400">{row.busy}</td>
                          <td className="px-4 py-4 font-mono text-slate-400">{row.empty}</td>
                          <td className="px-4 py-4 font-mono text-slate-400">{row.poweroff}</td>
                          <td className="px-4 py-4 font-mono text-slate-400">{row.suspended}</td>
                          <td className="px-4 py-4 font-mono text-emerald-600 font-bold">{row.rate}%</td>
                          <td className="px-4 py-4 font-mono text-slate-600">{row.totalDuration}</td>
                          <td className="px-4 py-4 font-mono text-slate-600">{row.avgDuration}</td>
                          <td className="px-4 py-4 font-mono text-slate-600">{row.tag1}</td>
                          <td className="px-4 py-4 font-mono text-slate-600">{row.tag2}</td>
                          <td className="px-4 py-4 font-mono text-slate-600">{row.tag3}</td>
                          <td className="px-4 py-4 font-mono text-slate-400">{row.total - row.tag1 - row.tag2 - row.tag3}</td>
                          <td className="px-4 py-4 font-mono text-indigo-600 font-bold">{row.score}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{row.s1}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{row.s2}</td>
                          <td className="px-4 py-4 font-mono text-slate-500">{row.s3}</td>
                          <td className="px-4 py-4 text-right sticky right-0 bg-white z-10 group-hover:bg-slate-50/50">
                            <button className="p-1 text-slate-400 hover:text-blue-500 transition-colors">
                              <MoreVertical size={14} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
