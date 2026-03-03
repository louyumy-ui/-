import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend 
} from 'recharts';
import { 
  TrendingUp, Users, PhoneCall, Clock, ArrowUpRight, ArrowDownRight, 
  Download, Calendar, Filter, RotateCcw, ChevronDown, MessageSquare
} from 'lucide-react';
import { SvgCopyButton } from './SvgCopyButton';
import { cn } from '../lib/utils';

const DAILY_DATA = [
  { date: '2026-02-19(周四)', aiConnect: 120, aiDuration: 450, avgDuration: 3.75, aiCalls: 200, connectRate: '60%', intentRate: '15%', aClass: 12, bClass: 18, abClass: 30, cost: 450, bill: 1200, score: 78, sms: 45 },
  { date: '2026-02-20(周五)', aiConnect: 145, aiDuration: 520, avgDuration: 3.58, aiCalls: 250, connectRate: '58%', intentRate: '18%', aClass: 15, bClass: 22, abClass: 37, cost: 520, bill: 1500, score: 82, sms: 52 },
  { date: '2026-02-21(周六)', aiConnect: 85, aiDuration: 310, avgDuration: 3.65, aiCalls: 150, connectRate: '56%', intentRate: '12%', aClass: 8, bClass: 12, abClass: 20, cost: 310, bill: 900, score: 75, sms: 28 },
  { date: '2026-02-22(周日)', aiConnect: 60, aiDuration: 220, avgDuration: 3.67, aiCalls: 100, connectRate: '60%', intentRate: '10%', aClass: 5, bClass: 8, abClass: 13, cost: 220, bill: 600, score: 72, sms: 15 },
  { date: '2026-02-23(周一)', aiConnect: 160, aiDuration: 580, avgDuration: 3.62, aiCalls: 280, connectRate: '57%', intentRate: '20%', aClass: 18, bClass: 25, abClass: 43, cost: 580, bill: 1680, score: 85, sms: 60 },
  { date: '2026-02-24(周二)', aiConnect: 180, aiDuration: 650, avgDuration: 3.61, aiCalls: 300, connectRate: '60%', intentRate: '22%', aClass: 22, bClass: 28, abClass: 50, cost: 650, bill: 1800, score: 88, sms: 72 },
  { date: '2026-02-25(周三)', aiConnect: 175, aiDuration: 630, avgDuration: 3.60, aiCalls: 290, connectRate: '60%', intentRate: '21%', aClass: 20, bClass: 26, abClass: 46, cost: 630, bill: 1740, score: 86, sms: 68 },
  { date: '2026-02-26(周四)', aiConnect: 190, aiDuration: 690, avgDuration: 3.63, aiCalls: 320, connectRate: '59%', intentRate: '23%', aClass: 25, bClass: 30, abClass: 55, cost: 690, bill: 1920, score: 90, sms: 75 },
  { date: '2026-02-27(周五)', aiConnect: 210, aiDuration: 750, avgDuration: 3.57, aiCalls: 350, connectRate: '60%', intentRate: '25%', aClass: 28, bClass: 35, abClass: 63, cost: 750, bill: 2100, score: 92, sms: 85 },
  { date: '2026-02-28(周六)', aiConnect: 95, aiDuration: 340, avgDuration: 3.58, aiCalls: 160, connectRate: '59%', intentRate: '14%', aClass: 10, bClass: 15, abClass: 25, cost: 340, bill: 960, score: 78, sms: 32 },
];

export const AnalysisDashboard = () => {
  const [activeTab, setActiveTab] = useState('trend');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex bg-white p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setActiveTab('trend')}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === 'trend' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              数据趋势
            </button>
            <button 
              onClick={() => setActiveTab('rate')}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === 'rate' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              接通率
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600">
            <Calendar size={16} />
            <span>2026-01-29 ~ 2026-02-28</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600">
            <span>我负责的</span>
            <ChevronDown size={14} />
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Filter size={16} />
            筛选
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
            <RotateCcw size={18} />
          </button>
          <SvgCopyButton targetId="full-analysis-view" />
        </div>
      </div>

      <div id="full-analysis-view" className="space-y-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
        {/* Chart Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-md">
                <button className="px-3 py-1 text-xs font-bold bg-white text-indigo-600 rounded shadow-sm">全部</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500">AI</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500">人工</button>
              </div>
              <div className="text-xs text-slate-400">总通话时长: <span className="text-slate-900 font-bold">4,810s</span></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="hideNoCalls" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="hideNoCalls" className="text-xs text-slate-500">隐藏无呼叫日</label>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_DATA}>
                <defs>
                  <linearGradient id="colorConnect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  interval={1}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                <Area name="AI接通量" type="monotone" dataKey="aiConnect" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorConnect)" />
                <Area name="A类客户" type="monotone" dataKey="aClass" stroke="#10b981" strokeWidth={2} fill="transparent" />
                <Area name="B类客户" type="monotone" dataKey="bClass" stroke="#f59e0b" strokeWidth={2} fill="transparent" />
                <Area name="综合评分" type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div> AI接通量
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> A类客户
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div> B类客户
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div> 综合评分
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold">
              + 短信数量: {DAILY_DATA.reduce((acc, curr) => acc + curr.sms, 0)}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <h3 className="text-sm font-bold text-slate-900">详情数据</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
              <Download size={14} />
              导出数据
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">日期</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-indigo-600 uppercase">AI接通量</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-emerald-600 uppercase">AI通话时长</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">平均通话时长(s)</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">AI呼叫量</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">AI接通率</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">AB意向客户率</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">A类客户</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">B类客户</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">获客成本</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">账单消费</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-rose-600 uppercase">综合评分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* Summary Rows */}
                <tr className="bg-indigo-50/20 font-bold">
                  <td className="px-4 py-3 text-xs text-slate-900">求和</td>
                  <td className="px-4 py-3 text-xs text-indigo-600">1,510</td>
                  <td className="px-4 py-3 text-xs text-emerald-600">5,180</td>
                  <td className="px-4 py-3 text-xs text-slate-900">3.62</td>
                  <td className="px-4 py-3 text-xs text-slate-900">2,500</td>
                  <td className="px-4 py-3 text-xs text-slate-900">60.4%</td>
                  <td className="px-4 py-3 text-xs text-slate-900">18.2%</td>
                  <td className="px-4 py-3 text-xs text-slate-900">171</td>
                  <td className="px-4 py-3 text-xs text-slate-900">229</td>
                  <td className="px-4 py-3 text-xs text-slate-900">5,180</td>
                  <td className="px-4 py-3 text-xs text-slate-900">15,120</td>
                  <td className="px-4 py-3 text-xs text-rose-600">82.4</td>
                </tr>
                <tr className="bg-slate-50/30 font-bold">
                  <td className="px-4 py-3 text-xs text-slate-900">平均</td>
                  <td className="px-4 py-3 text-xs text-indigo-600">151.0</td>
                  <td className="px-4 py-3 text-xs text-emerald-600">518.0</td>
                  <td className="px-4 py-3 text-xs text-slate-900">3.62</td>
                  <td className="px-4 py-3 text-xs text-slate-900">250.0</td>
                  <td className="px-4 py-3 text-xs text-slate-900">60.4%</td>
                  <td className="px-4 py-3 text-xs text-slate-900">18.2%</td>
                  <td className="px-4 py-3 text-xs text-slate-900">17.1</td>
                  <td className="px-4 py-3 text-xs text-slate-900">22.9</td>
                  <td className="px-4 py-3 text-xs text-slate-900">518.0</td>
                  <td className="px-4 py-3 text-xs text-slate-900">1,512.0</td>
                  <td className="px-4 py-3 text-xs text-rose-600">82.4</td>
                </tr>
                {/* Data Rows */}
                {DAILY_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-600">{row.date}</td>
                    <td className="px-4 py-3 text-xs font-bold text-indigo-600">{row.aiConnect}</td>
                    <td className="px-4 py-3 text-xs font-bold text-emerald-600">{row.aiDuration}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.avgDuration}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.aiCalls}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.connectRate}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.intentRate}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.aClass}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.bClass}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.cost}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.bill}</td>
                    <td className="px-4 py-3 text-xs font-bold text-rose-600">{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
