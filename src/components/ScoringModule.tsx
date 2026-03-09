import React, { useState, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, ResponsiveContainer 
} from 'recharts';
import { 
  Star, Phone, User, Calendar, Play, Pause, Download, ChevronRight, 
  Info, X, MoreHorizontal, UserCircle, Bot, Tag, BarChart3, 
  MessageSquare, CheckCircle2, AlertCircle, Clock, ShieldCheck,
  PhoneIncoming, PhoneOff, Timer, Activity, Copy
} from 'lucide-react';
import { SvgCopyButton } from './SvgCopyButton';
import { cn } from '../lib/utils';

// --- 类型定义 ---
interface ScoreDetail {
  subject: string;
  score: number;
  full: number;
  weight: number;
}

// --- Mock 数据 ---
const SCORE_DATA: ScoreDetail[] = [
  { subject: '开场白合规', score: 18, full: 20, weight: 20 },
  { subject: '语速控制', score: 16.5, full: 20, weight: 20 },
  { subject: '需求挖掘', score: 14.2, full: 20, weight: 20 },
  { subject: '异议处理', score: 13.8, full: 20, weight: 20 },
  { subject: '情绪价值', score: 17.5, full: 20, weight: 20 },
];

const CHAT_MESSAGES = [
  { id: 1, role: 'bot', time: '2026-03-04 16:49:47', text: '您好！我是云蝠智能的数字员工姣姣，请问是王先生吗？', tag: '触发预设开场白' },
  { id: 2, role: 'user', time: '2026-03-04 16:49:52', text: '是的，哪位？' },
  { id: 3, role: 'bot', time: '2026-03-04 16:49:55', text: '王先生您好，看到您近期在我们官网咨询过AI外呼系统，想跟您简单沟通下您的业务需求。', tag: '触发大模型' },
  { id: 4, role: 'user', time: '2026-03-04 16:50:05', text: '哦，那个啊，我现在在开会，你晚点再打吧。' },
  { id: 5, role: 'bot', time: '2026-03-04 16:50:10', text: '好的王先生，那不打扰您开会了。我稍后把相关的行业案例发到您手机上，祝您工作顺利！', tag: '结束语合规' },
];

const TICKET_TAGS = ['高意向', '官网咨询', '金融行业', '需二次回访'];

export const ScoringModule: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [callStatus, setCallStatus] = useState<'connected' | 'unconnected'>('connected');
  const [copied, setCopied] = useState(false);

  const handleCopyFullText = () => {
    const text = CHAT_MESSAGES.map(msg => `${msg.role === 'bot' ? 'AI' : '客户'}：${msg.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalScore = useMemo(() => 
    callStatus === 'unconnected' ? null : SCORE_DATA.reduce((sum, item) => sum + item.score, 0)
  , [callStatus]);

  const duration = callStatus === 'unconnected' ? '--' : '35秒';

  return (
    <div className="flex flex-col h-full bg-slate-50/50" id="scoring-root">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0084FF] rounded-lg text-white shadow-md shadow-blue-200">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">单通对话诊断</h1>
            <p className="text-xs text-slate-500">基于预设标准对单通通话进行全维度质量评估</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg mr-4">
            <button 
              onClick={() => setCallStatus('connected')}
              className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", callStatus === 'connected' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
            >已接通</button>
            <button 
              onClick={() => setCallStatus('unconnected')}
              className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", callStatus === 'unconnected' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
            >未接通</button>
          </div>
          <SvgCopyButton targetId="scoring-root" />
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-8">
        <div className="h-full flex gap-8 max-w-7xl mx-auto" id="scoring-diagnosis-area">
          {/* 左栏：通讯详情 (对话流) */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue-500" />
                  <h3 className="text-sm font-bold text-slate-800">对话明细流呈现</h3>
                </div>
                {callStatus === 'connected' && (
                  <button 
                    onClick={handleCopyFullText}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all border",
                      copied 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200"
                    )}
                  >
                    {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                    {copied ? "已复制全文" : "一键复制全文"}
                  </button>
                )}
              </div>
              {callStatus === 'connected' ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                  <CheckCircle2 size={10} /> 呼叫成功 - 已接通
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold border border-rose-100">
                  <PhoneOff size={10} /> 呼叫失败 - 拒接/空号
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20">
              {callStatus === 'connected' ? (
                CHAT_MESSAGES.map((msg) => (
                  <div key={msg.id} className={cn("flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2", msg.role === 'bot' ? "ml-auto items-end" : "items-start")}>
                    <div className={cn("flex items-start gap-4", msg.role === 'bot' ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-sm border shrink-0", 
                        msg.role === 'bot' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-400 border-slate-200")}>
                        {msg.role === 'bot' ? <Bot size={22} /> : <UserCircle size={22} />}
                      </div>
                      <div className="space-y-2">
                        <div className={cn(
                          "p-4 rounded-2xl text-sm shadow-sm relative leading-relaxed",
                          msg.role === 'bot' 
                            ? "bg-white text-slate-700 border border-blue-100 rounded-tr-none" 
                            : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
                        )}>
                          {msg.text}
                          {msg.tag && (
                            <div className={cn(
                              "absolute -bottom-6 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                              msg.role === 'bot' ? "right-0 bg-blue-50 text-blue-600 border-blue-100" : "left-0 bg-slate-50 text-slate-500 border-slate-200"
                            )}>
                              {msg.tag}
                            </div>
                          )}
                        </div>
                        <div className={cn("text-[10px] text-slate-400 font-mono mt-1", msg.role === 'bot' ? "text-right" : "text-left")}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                    <PhoneOff size={40} />
                  </div>
                  <p className="text-sm font-bold">未接通通话，无对话明细</p>
                </div>
              )}
            </div>

            {/* 播放控制条 */}
            {callStatus === 'connected' && (
              <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-[#0084FF] text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 group"
                  >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1 group-hover:scale-110 transition-transform" />}
                  </button>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-slate-100 rounded-full relative overflow-hidden cursor-pointer group">
                      <div className="absolute left-0 top-0 h-full w-1/3 bg-[#0084FF] rounded-full group-hover:bg-blue-500 transition-colors"></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400">
                      <span>00:12</span>
                      <span>00:35</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右栏：通讯信息 & 维度打分 */}
          <div className="w-80 flex flex-col gap-6">
            {/* 通讯信息 */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Phone size={14} className="text-blue-500" /> 通讯信息
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">呼叫结果</span>
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", callStatus === 'connected' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                    {callStatus === 'connected' ? '成功接通' : '拒接/空号'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">通话时长</span>
                  <span className="text-xs font-bold text-slate-700 font-mono">{duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">挂断原因</span>
                  <span className="text-xs font-bold text-slate-700">{callStatus === 'connected' ? '客户主动挂断' : '--'}</span>
                </div>
              </div>
            </section>

            {/* 工单标签命中 */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Tag size={14} className="text-purple-500" /> 工单标签命中
              </h3>
              <div className="flex flex-wrap gap-2">
                {callStatus === 'connected' ? TICKET_TAGS.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold border border-purple-100 shadow-sm">
                    {tag}
                  </span>
                )) : <span className="text-xs text-slate-300">--</span>}
              </div>
            </section>

            {/* 维度打分 - Bento 风格 */}
            <section className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <BarChart3 size={14} className="text-amber-500" /> 综合诊断得分
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-blue-600 font-mono">
                      {totalScore !== null ? totalScore.toFixed(1) : '--'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                  </div>
                </div>

                {/* 雷达图集成 */}
                {callStatus === 'connected' && (
                  <div className="h-48 mb-6 bg-slate-50/50 rounded-2xl border border-slate-100 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={SCORE_DATA.map(d => ({ subject: d.subject, A: (d.score / d.full) * 100 }))}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 'bold' }} />
                        <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {callStatus === 'connected' ? SCORE_DATA.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/30 border border-slate-100 rounded-xl group hover:bg-white hover:shadow-md transition-all relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/10 group-hover:bg-blue-500 transition-colors"></div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-700">{item.subject}</span>
                          <span className="text-[8px] text-slate-400 uppercase tracking-tighter font-mono">Dimension ID: {idx + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-blue-600 font-mono">{item.score}</span>
                          <span className="text-[9px] text-slate-300">/ {item.full}</span>
                        </div>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.2)]" 
                          style={{ width: `${(item.score / item.full) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-300 space-y-2">
                      <Activity size={24} />
                      <p className="text-[10px] font-bold">无评分数据</p>
                    </div>
                  )}
                </div>
              </div>

              {callStatus === 'connected' && (
                <div className="bg-[#0084FF] rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden group shrink-0">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={120} />
                  </div>
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">AI 诊断结论</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed opacity-90">
                      该通话整体表现良好，开场白标准，但在需求挖掘环节略显生硬，建议加强同理心表达。
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
