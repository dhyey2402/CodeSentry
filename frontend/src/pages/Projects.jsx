import React from 'react';
import { Folder, Plus, ChevronRight } from 'lucide-react';

const Projects = () => {
  const dummyProjects = [
    { id: 1, name: 'Auth Service', files: 4, date: '2h ago', status: 'Active' },
    { id: 2, name: 'Payment Gateway', files: 12, date: '1d ago', status: 'Completed' },
    { id: 3, name: 'Legacy API', files: 8, date: '3d ago', status: 'Active' },
    { id: 4, name: 'Utils Library', files: 2, date: '1w ago', status: 'Completed' },
  ];

  return (
    <div className="px-2 pb-8">
      <div className="flex items-center justify-between mb-8 animate-[fade-in_0.4s_ease-out]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
        </div>
        <button className="apple-btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyProjects.map((project, idx) => (
          <div
            key={project.id}
            className="apple-glass group cursor-pointer overflow-hidden flex flex-col"
            style={{ animation: `slide-up 0.5s ease-out ${idx * 0.1}s both` }}
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <span className={`apple-badge ${project.status === 'Active' ? 'apple-badge-blue' : 'apple-badge-green'}`}>
                  {project.status}
                </span>
              </div>
              
              <h3 className="text-[19px] font-semibold text-white mb-2">{project.name}</h3>
              <p className="text-[14px] text-white/50 font-medium">
                {project.files} files • Updated {project.date}
              </p>
            </div>
            
            <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-between items-center group-hover:bg-white/10 transition-colors">
              <span className="text-[14px] font-medium text-white/70 group-hover:text-white transition-colors">View project</span>
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
