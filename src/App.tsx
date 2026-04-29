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
          
          <div className="flex items-center gap-4">
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
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <StatCard {...s} />
            </motion.div>
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
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button className="px-3 py-1.5 text-xs font-semibold bg-white rounded-md shadow-sm">Attendance</button>
                  <button className="px-3 py-1.5 text-xs font-semibold text-slate-500">Grades</button>
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
                <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {filteredStudents.map((s, i) => (
                  <motion.div 
                    key={s.student_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
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
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RHS: Prediction Details */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedStudent ? (
                <motion.div
                  key={selectedStudent.student_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Prediction Score Card */}
                  <div className="bg-brand-primary p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
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

                  {/* SHAP / Feature Highlights */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                       <Activity className="w-4 h-4 text-blue-600" />
                       Performance Factors
                    </h4>
                    <div className="space-y-4">
                      {explanation?.top_factors.map(f => (
                        <div key={f.feature} className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <p className="text-xs font-bold uppercase text-slate-600">{f.feature.replace('_', ' ')}</p>
                            <span className="ml-auto text-xs font-bold text-amber-600">{f.value}%</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {f.tip}
                          </p>
                        </div>
                      ))}
                      {!explanation?.top_factors.length && (
                        <div className="text-center py-8">
                          <p className="text-sm text-slate-400 italic">No significant risk factors detected for this student.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Action */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-sm font-bold mb-4">Intervention Plan</h4>
                    <button className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      Generate PDF Report <Download className="w-4 h-4" />
                    </button>
                    <button className="w-full border border-slate-200 mt-2 rounded-xl py-3 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      Contact Guardian <Info className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                   <div className="bg-slate-100 p-4 rounded-full mb-4">
                     <Users className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900">Select a Student</h3>
                   <p className="text-sm text-slate-500 mt-2">Click on a student record to generate real-time AI performance projections and interventions.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
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
