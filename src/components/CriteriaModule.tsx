import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Info, Settings2, ChevronRight, Search, Filter, MoreHorizontal, ArrowLeft, MessageSquare, PhoneCall, TrendingUp, Settings, Bell, Cloud, ChevronLeft, User, Calendar, Play, Download, Star, BarChart3, Zap, Users, PieChart, Check, Copy } from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, AreaChart, Area, PieChart as RechartsPieChart, Pie
} from 'recharts';
import { SvgCopyButton } from './SvgCopyButton';
import { cn } from '../lib/utils';

const SCHEMES = [
  { id: '1', name: '通用外呼打分方案', creator: '张经理', createTime: '2026-01-15', lastUpdateTime: '2026-03-01', modifier: '张经理', status: '使用中', usageCount: 1240 },
  { id: '2', name: '金融产品电销方案', creator: '李主管', createTime: '2026-02-10', lastUpdateTime: '2026-02-28', modifier: '李主管', status: '草稿', usageCount: 0 },
  { id: '3', name: '售后回访质检标准', creator: '王组长', createTime: '2025-12-20', lastUpdateTime: '2026-02-25', modifier: '王组长', status: '使用中', usageCount: 856 },
  { id: '4', name: '新员工入职话术考核', creator: '张经理', createTime: '2026-01-05', lastUpdateTime: '2026-02-20', modifier: '张经理', status: '已停用', usageCount: 432 },
];

const DEFAULT_CRITERIA = [
  { id: '1', name: '开场表现', weight: 20.00, desc: '包括握手及对性，能自定轮候次数的授信；自我介绍清晰，清楚报明身份、公司、职位等信息；通话目的明确，开场白语速适中。' },
  { id: '2', name: '倾听与反馈', weight: 20.00, desc: '专注倾听，不打断客户；准确理解客户意图，能提供关键信息；适时反馈，通过重复、提问等方式确认认领真领与理解。' },
  { id: '3', name: '产品介绍', weight: 20.00, desc: '信息完整，全面介绍产品关键要素；重点突出，依据客户情况强调独特特点和优势；表述清晰，用语通俗简洁语言，避免专业术语堆砌。' },
  { id: '4', name: '异议处理', weight: 20.00, desc: '冷静倾听，听完客户异议；理解共情，站在客户角度看问题；解决方案有效，用专业知识化解疑虑；灵活运用沟通技巧。' },
  { id: '5', name: '综合沟通', weight: 20.00, desc: '客户情绪积极中性，无明显负面情绪；沟通顺畅，双方信息交流自然；结束语礼貌，用语得体留别，留下良好收尾。' },
];

export const CriteriaModule = () => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [selectedScheme, setSelectedScheme] = useState<typeof SCHEMES[0] | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('客服：您好，我是智策云语的客户经理，请问是张先生吗？\n客户：是的，什么事？\n客服：张先生您好，打扰您了。我们最近针对老客户推出了一项新的授信服务，想跟您简单介绍一下...\n客户：我现在没空，等下再说吧。\n客服：好的张先生，非常抱歉打扰您。那我不耽误您时间了，稍后我把详细资料发到您手机上，您有空可以了解一下。祝您生活愉快！');
  const [testScores, setTestScores] = useState<Record<string, number>>({
    '1': 85, '2': 80, '3': 70, '4': 75, '5': 90
  });

  const handleEdit = (scheme: typeof SCHEMES[0]) => {
    setSelectedScheme(scheme);
    setView('edit');
    setCriteria(DEFAULT_CRITERIA);
  };

  const handleScoreChange = (id: string, val: number) => {
    setTestScores(prev => ({ ...prev, [id]: val }));
  };

  const handleAddDimension = () => {
    const newId = (criteria.length + 1).toString();
    const newDimension = {
      id: newId,
      name: `新维度 ${newId}`,
      weight: 0,
      desc: '请输入该维度的评分标准描述...'
    };
    setCriteria([...criteria, newDimension]);
    setTestScores(prev => ({ ...prev, [newId]: 50 }));
  };

  const handleCriteriaChange = (id: string, field: 'weight' | 'desc' | 'name', value: string | number) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleDeleteDimension = (id: string) => {
    setCriteria(prev => prev.filter(c => c.id !== id));
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
      const newScores = { ...testScores };
      criteria.forEach(c => {
        newScores[c.id] = Math.floor(Math.random() * 40) + 60;
      });
      setTestScores(newScores);
    }, 1500);
  };

  if (view === 'list') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">话术管理</h2>
            <p className="text-slate-500 text-sm mt-1">管理和配置不同业务场景下的通话质检评分模板</p>
          </div>
          <div className="flex gap-3">
            <SvgCopyButton targetId="scheme-list-section" />
            <button className="flex items-center gap-2 bg-[#0084FF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md font-bold">
              <Plus size={18} />
              <span>新建方案</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索方案名称、创建人..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0084FF] outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            筛选
          </button>
        </div>

        <div id="scheme-list-section" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-[1440px] h-[960px] p-8">
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
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{scheme.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">创建人: {scheme.creator}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      scheme.status === '使用中' ? 'bg-emerald-50 text-emerald-700' : 
                      scheme.status === '草稿' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        scheme.status === '使用中' ? 'bg-emerald-500' : 
                        scheme.status === '草稿' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></span>
                      {scheme.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{scheme.createTime}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{scheme.lastUpdateTime}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{scheme.modifier}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#0084FF] hover:bg-blue-50 rounded-lg transition-colors">
                        <Settings2 size={14} />
                        编辑
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                        删除
                      </button>
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('list')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{selectedScheme?.name} - 标准制定</h2>
            <p className="text-slate-500 text-sm mt-1">定义外呼通话的质检维度、权重及详细评分细则</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsTesting(!isTesting)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm font-bold",
              isTesting ? "bg-amber-500 text-white shadow-amber-200" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            <Settings2 size={18} />
            <span>{isTesting ? "退出测试" : "进入测试模式"}</span>
          </button>
          <SvgCopyButton targetId="criteria-section" />
          <button 
            onClick={handleAddDimension}
            disabled={isTesting}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md font-bold",
              isTesting ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#0084FF] text-white hover:bg-blue-600"
            )}
          >
            <Plus size={18} />
            <span>新增维度</span>
          </button>
        </div>
      </div>

      <div id="criteria-section" className={cn(
        "bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-[1440px] h-[960px] p-8 transition-all duration-500",
        isTesting ? "grid grid-cols-12 gap-8" : "block"
      )}>
        {/* Left: Criteria Table */}
        <div className={cn("space-y-6 overflow-auto pr-2", isTesting ? "col-span-4" : "w-full")}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Info size={20} className="text-[#0084FF]" />
              评分维度配置
            </h3>
            {isTesting && (
              <span className="text-xs font-bold text-[#0084FF] bg-blue-50 px-2 py-1 rounded">测试模式已开启</span>
            )}
          </div>
          
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">维度</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">权重</th>
                  {!isTesting && <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">细则</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criteria.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-4 py-4">
                      {isTesting ? (
                        <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                      ) : (
                        <input 
                          type="text"
                          value={item.name}
                          onChange={(e) => handleCriteriaChange(item.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-900 text-sm p-0"
                        />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {isTesting ? (
                        <div className="text-sm text-slate-600 font-mono font-bold">{item.weight}%</div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input 
                            type="number"
                            value={item.weight}
                            onChange={(e) => handleCriteriaChange(item.id, 'weight', parseFloat(e.target.value) || 0)}
                            className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm text-slate-600 font-mono font-bold focus:ring-1 focus:ring-[#0084FF] outline-none"
                          />
                          <span className="text-slate-400 text-xs">%</span>
                        </div>
                      )}
                    </td>
                    {!isTesting && (
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <textarea 
                            value={item.desc}
                            onChange={(e) => handleCriteriaChange(item.id, 'desc', e.target.value)}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-slate-500 leading-relaxed resize-none p-0 min-h-[40px]"
                          />
                          <button 
                            onClick={() => handleDeleteDimension(item.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
            <div className="text-sm font-bold text-slate-900">
              当前总权重: <span className="text-[#0084FF]">100.00%</span>
            </div>
            <div className="flex gap-1">
              {criteria.map((c) => (
                <div key={c.id} className="w-2 bg-[#0084FF] rounded-full opacity-60" style={{ height: `${Math.max(10, c.weight * 2)}px` }}></div>
              ))}
            </div>
          </div>

          {/* Graphical Representation below table (When not testing) */}
          {!isTesting && (
            <div className="grid grid-cols-2 gap-4 mt-8 animate-in fade-in duration-700">
              <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 h-[300px]">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">权重分布预览</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={criteria}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="weight"
                    >
                      {criteria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0084FF', '#10b981', '#6366f1', '#f59e0b', '#ec4899'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 h-[300px]">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">维度对比图</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={criteria}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="weight" fill="#0084FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right: Test Environment (Only in testing mode) */}
        {isTesting && (
          <div className="col-span-8 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Input Area */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#0084FF]" />
                通话文本模拟
              </h4>
              <div className="relative">
                <textarea 
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full h-[600px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#0084FF] focus:bg-white transition-all resize-none shadow-inner font-mono"
                  placeholder="在此输入通话转写文本进行模拟打分测试..."
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center animate-in fade-in">
                    <div className="w-12 h-12 border-4 border-[#0084FF] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-sm font-bold text-[#0084FF]">AI 正在深度分析文本...</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-6 py-2 bg-[#0084FF] text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isAnalyzing ? "分析中..." : "AI 智能分析"}
                </button>
              </div>
            </div>

            {/* Result Area */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#0084FF] to-blue-600 rounded-2xl p-6 text-white shadow-lg text-center space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">模拟打分结果</h3>
                <div className="text-7xl font-black tracking-tighter">{calculateTotalScore()}</div>
                <div className="inline-flex px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
                  等级: {parseFloat(calculateTotalScore()) >= 85 ? "A (优秀)" : parseFloat(calculateTotalScore()) >= 70 ? "B (良好)" : "C (合格)"}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="h-[300px]">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">维度得分详情</h4>
                  <div className="space-y-4 overflow-y-auto max-h-[240px] pr-2">
                    {criteria.map(item => (
                      <div key={item.id} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-500">{item.name}</span>
                          <span className="text-[#0084FF]">{testScores[item.id] || 0}分</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={testScores[item.id] || 0} 
                          onChange={(e) => handleScoreChange(item.id, parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0084FF]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-[250px]">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">维度分布图</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#0084FF"
                        fill="#0084FF"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
