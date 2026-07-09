import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

const Reviews = () => {
  const dummyReviews = [
    { id: 1, project: 'auth_service.py', date: 'Oct 24, 2026', score: 9.2, issues: { high: 0, med: 2, low: 5 }, status: 'Clean' },
    { id: 2, project: 'payment.js', date: 'Oct 23, 2026', score: 6.8, issues: { high: 3, med: 8, low: 12 }, status: 'Needs Work' },
    { id: 3, project: 'user_model.py', date: 'Oct 20, 2026', score: 8.5, issues: { high: 1, med: 1, low: 3 }, status: 'Good' },
  ];

  const getScoreColor = (score) => {
    if (score >= 9) return '#32D74B';
    if (score >= 7) return '#FF9F0A';
    return '#FF375F';
  };

  return (
    <div className="px-2">
      <div className="mb-8 animate-[fade-in_0.4s_ease-out]">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analysis Reviews</h1>
        <p className="text-[15px] text-white/60">Detailed static analysis reports.</p>
      </div>

      <div className="apple-glass overflow-hidden animate-[slide-up_0.5s_ease-out]">
        <div className="divide-y divide-white/10">
          {dummyReviews.map((review, idx) => {
            const scoreColor = getScoreColor(review.score);
            return (
              <div
                key={review.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[16px] bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                    <Activity className="w-7 h-7 text-[#BF5AF2]" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-white">{review.project}</h3>
                    <p className="text-[13px] text-white/50 mt-1">Reviewed on {review.date}</p>
                  </div>
                </div>

                <div className="flex gap-6 md:px-8">
                  {[
                    { label: 'High', count: review.issues.high, color: '#FF375F' },
                    { label: 'Med', count: review.issues.med, color: '#FF9F0A' },
                    { label: 'Low', count: review.issues.low, color: '#32D74B' }
                  ].map(issue => (
                    <div key={issue.label} className="text-center">
                      <div className="flex items-center gap-1.5 justify-center mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" style={{ color: issue.color }} />
                        <span className="text-[12px] font-semibold text-white/60 uppercase">{issue.label}</span>
                      </div>
                      <span className="text-[16px] font-bold" style={{ color: issue.count > 0 ? 'white' : 'rgba(255,255,255,0.3)' }}>
                        {issue.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" style={{ color: scoreColor }} />
                      <span className="text-[26px] font-bold tracking-tight" style={{ color: scoreColor }}>
                        {review.score}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
