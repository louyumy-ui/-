import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, ResponsiveContainer } from 'recharts';
import { Star, MessageSquare, Phone, User, Calendar, Play, Pause, Download, ChevronRight, Info, X, MoreHorizontal, UserCircle, Bot } from 'lucide-react';
import { SvgCopyButton } from './SvgCopyButton';
import { cn } from '../lib/utils';

const SCORE_DATA = [
  { subject: '合规红线', A: 10, full: 10 },
  { subject: '接通质量', A: 0, full: 15 },
  { subject: '客户画像分析', A: 0, full: 20 },
  { subject: '还款意愿激发', A: 0, full: 25 },
  { subject: '还款结果闭环', A: 0, full: 30 },
  { subject: '还款行动落实', A: 0, full: 15 },
];

const CHAT_MESSAGES = [
  { id: 1, role: 'bot', time: '5.2s', text: '【停顿0.5秒】唯？（轻笑）您好！【停顿0.3秒】（嗯）这里是云蝠智能，（正常换气）有什么可以帮到您的吗？！！', tag: '触发预设开场白' },
  { id: 2, role: 'user', time: '6.9s', text: '你好，我想要找一下我们的那个ai 外呼的业务。', subText: '触发注意力：输出不要超过 80 字！口语化，符合打电话的特点，有耐心、亲切、不要重复，不要每次都重复先生、女士。' },
  { id: 3, role: 'bot', time: '1.2s', text: '[嗯]您好！您是想了解AI外呼这块对吧？我们这边主打大模型语音外呼，接通率高、话术自然，能帮您做回访、营销、通知这些～ 需要我详细说说吗？', tag: '触发大模型', footer: '(以上内容由AI生成)' },
  { id: 4, role: 'user', time: '3.0s', text: '我想了解一下这个收费标准是什么？', subText: '触发注意力：输出不要超过 80 字！口语化，符合打电话的特点，有耐心、亲切、不要重复，不要每次都重复先生、女士。' },
  { id: 5, role: 'bot', time: '2.4s', text: '[嗯]收费标准分两块哈～ 坐席费和通话费。外呼坐席6988元/年，呼入坐席12888元/年，后面按通话时长计费～ 具体优惠和方案，我让同事微信跟您细说？', tag: '触发大模型', footer: '(以上内容由AI生成)' },
  { id: 6, role: 'user', time: '2.4s', text: '你好。嗯，那你这个收费标准是怎么做的判断？' },
];

export const ScoringModule = () => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">外呼管理</h2>
          <p className="text-slate-500 text-sm mt-1">查看单通通话的详细评分报告与AI分析总结</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowDetail(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-bold"
          >
            <Star size={18} className="text-amber-400 fill-amber-400" />
            <span>查看评分详情</span>
          </button>
          <SvgCopyButton targetId="scoring-container" />
        </div>
      </div>

      <div id="scoring-container" className="bg-[#f8fafc] rounded-2xl border border-slate-200 w-[1440px] h-[960px] shadow-sm overflow-hidden flex relative">
        {/* Left: Chat Interface */}
        <div className="flex-1 flex flex-col bg-white border-r border-slate-100">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[#0084FF]" />
              <span className="font-bold text-slate-700">通话记录: 188****4221</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                通话中
              </div>
              <MoreHorizontal size={18} className="text-slate-400 cursor-pointer" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {CHAT_MESSAGES.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.role === 'bot' ? "ml-auto items-end" : "items-start")}>
                <div className={cn("flex items-start gap-3", msg.role === 'bot' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-sm", msg.role === 'bot' ? "bg-blue-50 text-[#0084FF]" : "bg-slate-100 text-slate-500")}>
                    {msg.role === 'bot' ? <Bot size={24} /> : <UserCircle size={24} />}
                  </div>
                  <div className="space-y-2">
                    <div className={cn(
                      "p-4 rounded-2xl text-sm shadow-sm relative",
                      msg.role === 'bot' ? "bg-[#0084FF] text-white rounded-tr-none" : "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none"
                    )}>
                      {msg.text}
                      {msg.tag && (
                        <div className={cn(
                          "absolute -bottom-6 px-2 py-0.5 rounded text-[10px] font-bold",
                          msg.role === 'bot' ? "right-0 bg-blue-100 text-[#0084FF]" : "left-0 bg-slate-100 text-slate-500"
                        )}>
                          {msg.tag}
                        </div>
                      )}
                    </div>
                    {msg.subText && (
                      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-[11px] text-blue-600 leading-relaxed italic">
                        {msg.subText}
                      </div>
                    )}
                    {msg.footer && (
                      <div className="text-[10px] text-slate-400 mt-1">
                        {msg.footer}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 self-end">{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-[#0084FF] text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md">
                <Play size={20} fill="currentColor" />
              </button>
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1/4 bg-[#0084FF]"></div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">00:54 / 03:43</span>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="w-80 bg-white p-6 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">通话概况</h3>
            <div className="space-y-3">
              {[
                { label: '模型 (ID)', value: '云蝠智能客服姣姣' },
                { label: '呼叫时间', value: '2026-02-25 16:49:47' },
                { label: '时长', value: '03:43' },
                { label: '平均分', value: '1.7 / 19.2', highlight: true },
                { label: '总分', value: '10.0 / 115.0', highlight: true },
                { label: '交互轮次', value: '3' },
                { label: '挂断方', value: '客户', badge: 'bg-rose-50 text-rose-500 border-rose-100' },
                { label: 'token', value: '25135' },
                { label: 'TTS', value: '967', info: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    {item.label}
                    {item.info && <Info size={10} className="text-slate-300" />}
                  </span>
                  {item.badge ? (
                    <span className={cn("px-2 py-0.5 rounded border text-[10px] font-bold", item.badge)}>{item.value}</span>
                  ) : (
                    <span className={cn("font-bold", item.highlight ? "text-[#0084FF]" : "text-slate-700")}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User size={14} />
              用户信息
            </h3>
            <div className="space-y-4">
              {[
                { label: '手机号', value: '188****4221' },
                { label: '公司', value: '其他' },
                { label: '客户行业', value: '未知' },
                { label: '客户需求', value: '有意向' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[10px] text-slate-400">{item.label}</div>
                  <div className="text-xs font-bold text-slate-700">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scoring Detail Overlay */}
        {showDetail && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-12 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">评分详情</h3>
                    <p className="text-[10px] text-slate-400">保留小数点后两位</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetail(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 flex gap-12">
                {/* Left: Score List */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    {SCORE_DATA.map((item) => (
                      <div key={item.subject} className="flex items-center justify-between group">
                        <div className="w-32 text-sm font-bold text-slate-600">{item.subject}</div>
                        <div className="flex-1 flex items-center gap-1 mx-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={18} 
                              className={star <= Math.round((item.A / item.full) * 5) ? "text-amber-400 fill-amber-400" : "text-slate-100"} 
                            />
                          ))}
                        </div>
                        <div className="w-24 text-right">
                          <span className="text-sm font-mono font-bold text-[#0084FF]">{item.A.toFixed(2)}</span>
                          <span className="text-xs text-slate-300 mx-1">/</span>
                          <span className="text-xs font-mono text-slate-400">{item.full.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-600">平均分</span>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-0.5">
                          <Star size={16} className="text-amber-400 fill-amber-400" />
                          <Star size={16} className="text-slate-100" />
                          <Star size={16} className="text-slate-100" />
                          <Star size={16} className="text-slate-100" />
                          <Star size={16} className="text-slate-100" />
                        </div>
                        <span className="text-sm font-mono font-bold text-[#0084FF]">1.7</span>
                        <span className="text-xs text-slate-300">/ 19.2</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-600">总分</span>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-0.5">
                          <Star size={16} className="text-amber-400 fill-amber-400" />
                          <Star size={16} className="text-slate-100" />
                          <Star size={16} className="text-slate-100" />
                          <Star size={16} className="text-slate-100" />
                          <Star size={16} className="text-slate-100" />
                        </div>
                        <span className="text-sm font-mono font-bold text-[#0084FF]">10.0</span>
                        <span className="text-xs text-slate-300">/ 115.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">总结</h4>
                    <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      该通话内容为B2B场景下的AI外呼产品销售咨询，非债务催收场景。全程无任何债务人信息、欠款信息、还款协商等内容，不涉及客户还款能力/意愿分析、还款方案设计、行动承诺或结果追踪等催收核心环节。因此，“接通质量”“客户画像分析”“还款意愿激发”“还款行动落实”“还款结果闭环”五个维度均不适用，计0分；“合规红线”维度因全程未出现威胁恐吓、未泄露他人信息、虽无双录证据但通话内容本身无违规言行，且作为销售外呼符合基础合规要求，故给满分10分。
                    </p>
                  </div>
                </div>

                {/* Right: Radar Chart */}
                <div className="w-[400px] flex flex-col items-center justify-center border-l border-slate-100 pl-12">
                  <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SCORE_DATA}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 30]} tick={false} axisLine={false} />
                        <RechartsRadar
                          name="Score"
                          dataKey="A"
                          stroke="#0084FF"
                          fill="#0084FF"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">总分: 10.0 / 115.0</div>
                    <div className="text-4xl font-black text-[#0084FF]">10.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
