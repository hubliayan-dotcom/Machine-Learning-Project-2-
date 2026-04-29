import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  Users, UserCheck, AlertTriangle, TrendingUp, Search, 
  Filter, Download, ChevronRight, BrainCircuit, Activity,
  Clock, BookOpen, GraduationCap, ArrowRight, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { MOCK_STUDENTS } from './mock-data';
import { StudentData, PredictionResult, ExplainResult } from './types';

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend, colorClass }: { title: string, value: string | number, icon: any, trend?: string, colorClass: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className={cn("p-2.5 rounded-xl", colorClass)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", 
          trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);

const RiskBadge = ({ level }: { level: 'HIGH' | 'MEDIUM' | 'LOW' }) => {
  const styles = {
    HIGH: "bg-red-50 text-red-700 border-red-100",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-100",
    LOW: "bg-emerald-50 text-emerald-700 border-emerald-100"
  };
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", styles[level])}>
      {level}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [explanation, setExplanation] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'dashboard' | 'performance'>('dashboard');

  const rocData = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.1, tpr: 0.7 },
    { fpr: 0.2, tpr: 0.85 },
    { fpr: 0.4, tpr: 0.9 },
    { fpr: 0.8, tpr: 0.98 },
    { fpr: 1, tpr: 1 }
  ];

  const SHAP_DATA = [
    { name: 'Attendance', importance: 0.82 },
    { name: 'Prior GPA', importance: 0.75 },
    { name: 'Quiz Avg', importance: 0.61 },
    { name: 'Midterm', importance: 0.45 },
    { name: 'Study Hours', importance: 0.38 },
  ];

  const handlePredict = async (student: StudentData) => {
    setLoading(true);
    setSelectedStudent(student);
    
    try {
      const predRes = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      const predData = await predRes.json();
      setPrediction(predData);

      const explRes = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      const explData = await explRes.json();
      setExplanation(explData);
    } catch (error) {
      console.error("Prediction failed", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { title: "Total Students", value: 1248, icon: Users, trend: "+12%", colorClass: "bg-blue-600" },
    { title: "Avg. Attendance", value: "84.2%", icon: UserCheck, trend: "-2%", colorClass: "bg-indigo-600" },
    { title: "At Risk (High)", value: 42, icon: AlertTriangle, trend: "+5%", colorClass: "bg-amber-600" },
    { title: "Success Rate", value: "89.4%", icon: TrendingUp, trend: "+3%", colorClass: "bg-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">EduPredict AI</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Academic Excellence Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setView('dashboard')}
                className={cn("px-4 py-1.5 text-sm font-bold rounded-lg transition-all", 
                view === 'dashboard' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setView('performance')}
                className={cn("px-4 py-1.5 text-sm font-bold rounded-lg transition-all", 
                view === 'performance' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
              >
                Model Insights
              </button>
            </nav>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transitioning shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-brand-primary text-white p-2 rounded-xl">
              <Activity className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-8 flex-1">
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Stats Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((s, i) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Dashboard Area */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Chart Area */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-bold">Predictive Risk Trends</h3>
                        <p className="text-sm text-slate-500">Weekly probability flux across domains</p>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_STUDENTS.map(s => ({ name: s.name.split(' ')[0], val: s.attendance_pct }))}>
                          <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                          <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Student List */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                      <h3 className="font-bold text-slate-900">Target Cohort</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {filteredStudents.map((s, i) => (
                        <div 
                          key={s.student_id}
                          onClick={() => handlePredict(s)}
                          className={cn(
                            "flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50 transition-all",
                            selectedStudent?.student_id === s.student_id && "bg-blue-50/50 border-l-4 border-blue-600"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                              {s.name.substring(0, 2)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                              <p className="text-xs text-slate-500">UID: {s.student_id} • {s.school_type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="hidden md:block">
                              <p className="text-xs text-slate-400 font-medium mb-1">Attendance</p>
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${s.attendance_pct}%` }} />
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-900">{s.grade}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RHS: Prediction Details */}
                <div className="space-y-6">
                  {/* ... Existing prediction details ... */}
                  {selectedStudent ? (
                    <div className="space-y-6">
                      <div className="bg-brand-primary p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Risk Assessment</span>
                            <BrainCircuit className="w-6 h-6 text-blue-400" />
                          </div>
                          <div className="text-center mb-8">
                            <h2 className="text-5xl font-bold mb-2">{((prediction?.risk_prob ?? 0) * 100).toFixed(0)}%</h2>
                            <p className="text-slate-300 text-sm">Pass Probability Rate</p>
                          </div>
                          <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                            <div>
                              <p className="text-xs text-slate-400 font-medium">Status</p>
                              <p className="font-bold">{prediction?.at_risk ? 'At Risk' : 'Healthy'}</p>
                            </div>
                            <RiskBadge level={prediction?.risk_level || 'LOW'} />
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
                      </div>

                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                           <Activity className="w-4 h-4 text-blue-600" />
                           Performance Factors
                        </h4>
                        <div className="space-y-4">
                          {explanation?.top_factors.map(f => (
                            <div key={f.feature} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <p className="text-xs font-bold uppercase text-slate-600">{f.feature}</p>
                                <span className="ml-auto text-xs font-bold text-amber-600">{f.value}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed italic">{f.tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                       <Users className="w-8 h-8 text-slate-300 mb-4" />
                       <h3 className="text-lg font-bold">Select a Student</h3>
                       <p className="text-sm text-slate-500 mt-2">Generate real-time AI projections.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="performance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ROC Curve */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-lg font-bold">Receiver Operating Characteristic (ROC)</h3>
                      <p className="text-sm text-slate-500">Model discriminative power across thresholds</p>
                    </div>
                    <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">
                      AUC: 0.92
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rocData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="fpr" label={{ value: 'False Positive Rate', position: 'bottom', offset: 0, fontSize: 12 }} fontSize={11} axisLine={false} tickLine={false} />
                        <YAxis label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fontSize: 12 }} fontSize={11} axisLine={false} tickLine={false} />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="tpr" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                        <Line type="monotone" dataKey="fpr" stroke="#cbd5e1" strokeDasharray="5 5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Confusion Matrix */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold mb-2">Confusion Matrix</h3>
                  <p className="text-sm text-slate-500 mb-8">Experimental validation on test cohort (n=200)</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-6 rounded-2xl text-center border border-emerald-100">
                      <p className="text-xs font-bold text-emerald-600 uppercase mb-1">True Positive</p>
                      <h4 className="text-4xl font-black text-emerald-700">145</h4>
                      <p className="text-[10px] text-emerald-500 mt-2 italic">Correctly identified 'Pass'</p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
                      <p className="text-xs font-bold text-red-600 uppercase mb-1">False Negative</p>
                      <h4 className="text-4xl font-black text-red-700">5</h4>
                      <p className="text-[10px] text-red-500 mt-2 italic">Missed 'At Risk' (Critical)</p>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-2xl text-center border border-amber-100">
                      <p className="text-xs font-bold text-amber-600 uppercase mb-1">False Positive</p>
                      <h4 className="text-4xl font-black text-amber-700">8</h4>
                      <p className="text-[10px] text-amber-500 mt-2 italic">Type I Error</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                      <p className="text-xs font-bold text-slate-600 uppercase mb-1">True Negative</p>
                      <h4 className="text-4xl font-black text-slate-700">42</h4>
                      <p className="text-[10px] text-slate-500 mt-2 italic">Correctly identified 'Fail'</p>
                    </div>
                  </div>
                </div>

                {/* SHAP Importance */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                  <h3 className="text-lg font-bold mb-2">Global Feature Importance (SHAP)</h3>
                  <p className="text-sm text-slate-500 mb-8">Mean absolute impact on model output magnitude</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={SHAP_DATA} layout="vertical" margin={{ left: 40 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} />
                        <RechartsTooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={25} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium uppercase tracking-widest">
          <p>© 2026 EduPredict AI System • Faculty of Data Science</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600">Methodology</a>
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
