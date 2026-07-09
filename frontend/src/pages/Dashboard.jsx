import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Folder, Activity, Plus, TrendingUp, Code2 } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Projects', value: '12', change: '+3 this week', icon: Folder, color: '#0A84FF' },
    { title: 'Code Reviews', value: '34', change: '+8 this week', icon: Activity, color: '#5E5CE6' },
    { title: 'Avg. Score', value: '8.4', change: '+0.3 improvement', icon: TrendingUp, color: '#32D74B' },
  ];

  const recentUploads = [
    { id: 1, name: 'auth_service.py', date: '2h ago', status: 'Completed', score: '9.2', lang: 'Python' },
    { id: 2, name: 'utils.js', date: '5h ago', status: 'Pending', score: '—', lang: 'JavaScript' },
    { id: 3, name: 'main_api.py', date: '1d ago', status: 'Completed', score: '7.8', lang: 'Python' },
    { id: 4, name: 'database.py', date: '2d ago', status: 'Completed', score: '8.9', lang: 'Python' },
  ];

  return (
    <div className="space-y-6 px-2 animate-[fade-in_0.5s_ease-out]">
      {/* Welcome Banner */}
      <div className="apple-glass p-8 flex justify-between items-center relative overflow-hidden animate-[slide-up_0.5s_ease-out]">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome back, Developer
          </h1>
          <p className="text-[15px] text-white/60">
            Your codebase is looking healthy today.
          </p>
        </div>
        
        {/* Subtle decorative visual */}
        <div className="hidden md:flex w-24 h-24 rounded-full border border-white/20 bg-white/5 backdrop-blur-md items-center justify-center relative z-10">
          <Code2 className="w-10 h-10 text-white/80" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="apple-glass p-6" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-semibold text-white/50 uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-[13px] font-medium mt-2" style={{ color: stat.color }}>{stat.change}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-8">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 apple-glass p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-[17px] font-semibold text-white">Recent Uploads</h2>
            <Link to="/reviews" className="text-[14px] font-medium text-[#0A84FF] hover:text-white transition-colors">
              See All
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentUploads.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[12px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Code2 className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-white/90">{item.name}</p>
                    <p className="text-[13px] text-white/50 mt-0.5">{item.lang} • {item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[15px] font-bold text-white/90 w-8 text-right">{item.score}</span>
                  <span className={`apple-badge ${item.status === 'Completed' ? 'apple-badge-green' : 'apple-badge-orange'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="apple-glass p-6 flex flex-col gap-4">
          <h2 className="text-[17px] font-semibold text-white mb-2">Actions</h2>
          <Link to="/upload" className="apple-btn-primary w-full flex items-center justify-center gap-2 no-underline">
            <UploadCloud className="w-5 h-5" />
            Upload Code
          </Link>
          <Link to="/projects" className="apple-btn-glass w-full flex items-center justify-center gap-2 no-underline">
            <Plus className="w-5 h-5" />
            New Project
          </Link>

          <div className="mt-auto pt-6 border-t border-white/10">
             <p className="text-[13px] font-semibold text-white/50 uppercase tracking-wider mb-3">Quality Trend</p>
             <div className="flex items-end gap-1.5 h-16">
              {[40, 55, 45, 60, 70, 65, 80, 75, 85, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all duration-500 ease-out hover:opacity-100"
                  style={{
                    height: `${h}%`,
                    background: i === 9 ? '#32D74B' : 'rgba(255, 255, 255, 0.2)',
                    opacity: i === 9 ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
