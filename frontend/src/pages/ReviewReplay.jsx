import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Box, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

const ReplayScore = ({ label, oldScore, newScore }) => {
  const diff = Number(newScore) - Number(oldScore);
  const isPositive = diff > 0;
  const isNegative = diff < 0;
  
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface">
      <span className="font-medium text-text-primary">{label}</span>
      <div className="flex items-center gap-4">
        <span className="text-text-muted">{Number(oldScore).toFixed(1)}</span>
        <div className="flex items-center justify-center w-8">
          {isPositive ? <TrendingUp className="w-4 h-4 text-success" /> : isNegative ? <TrendingDown className="w-4 h-4 text-destructive" /> : <Minus className="w-4 h-4 text-text-muted" />}
        </div>
        <span className="font-bold text-text-primary">{Number(newScore).toFixed(1)}</span>
      </div>
    </div>
  );
};

const ReviewReplay = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [baseReviewId, setBaseReviewId] = useState("");
  const [compareReviewId, setCompareReviewId] = useState("");
  
  const [baseReview, setBaseReview] = useState(null);
  const [compareReview, setCompareReview] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.getReviews();
        setReviews(data);
        if (data.length >= 2) {
          setBaseReviewId(data[1].id);
          setCompareReviewId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchDetailedReviews = async () => {
      if (baseReviewId && compareReviewId) {
        try {
          const [base, compare] = await Promise.all([
            api.getReview(baseReviewId),
            api.getReview(compareReviewId)
          ]);
          setBaseReview(base);
          setCompareReview(compare);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchDetailedReviews();
  }, [baseReviewId, compareReviewId]);

  if (loading) {
    return (
      <div className="py-6 space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="py-6 animate-in fade-in duration-500">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Review Replay</h1>
          <p className="text-text-muted mt-1">Compare how your code quality has evolved over time.</p>
        </div>
      </div>

      {reviews.length < 2 ? (
        <Card className="border-dashed bg-surface/50 text-center py-16">
          <CardContent>
             <Box className="w-12 h-12 text-accent mx-auto mb-4 opacity-50" />
             <h3 className="text-xl font-semibold mb-2">Not enough data</h3>
             <p className="text-text-muted">You need at least two code reviews to compare progress.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface p-6 rounded-xl border border-border">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Base Review (Older)</label>
              <select 
                className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={baseReviewId}
                onChange={(e) => setBaseReviewId(e.target.value)}
              >
                {reviews.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.project?.name} - {new Date(r.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Comparison Review (Newer)</label>
              <select 
                className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={compareReviewId}
                onChange={(e) => setCompareReviewId(e.target.value)}
              >
                {reviews.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.project?.name} - {new Date(r.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {baseReview && compareReview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics Diff</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReplayScore 
                    label="Overall AI Score" 
                    oldScore={baseReview.ai_score || 0} 
                    newScore={compareReview.ai_score || 0} 
                  />
                  <ReplayScore 
                    label="Code Quality" 
                    oldScore={baseReview.pylint_score || 0} 
                    newScore={compareReview.pylint_score || 0} 
                  />
                  <ReplayScore 
                    label="Maintainability" 
                    oldScore={baseReview.maintainability_index || 0} 
                    newScore={compareReview.maintainability_index || 0} 
                  />
                  <ReplayScore 
                    label="Complexity" 
                    oldScore={baseReview.cyclomatic_complexity || 0} 
                    newScore={compareReview.cyclomatic_complexity || 0} 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issue Resolution Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex flex-col h-full justify-center space-y-6 pb-4">
                     <div className="flex items-center justify-between px-6">
                        <div className="text-center">
                          <span className="block text-4xl font-bold text-destructive mb-2">{baseReview.findings?.length || 0}</span>
                          <span className="text-sm text-text-muted uppercase">Base Issues</span>
                        </div>
                        <ArrowLeft className="w-8 h-8 text-text-muted rotate-180" />
                        <div className="text-center">
                          <span className="block text-4xl font-bold text-success mb-2">{compareReview.findings?.length || 0}</span>
                          <span className="text-sm text-text-muted uppercase">Remaining</span>
                        </div>
                     </div>
                     
                     <div className="bg-success/5 border border-success/20 p-4 rounded-lg flex items-start gap-3">
                       <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                       <div>
                         <h4 className="font-medium text-success">Progress Recognized</h4>
                         <p className="text-sm text-text-primary mt-1">
                           By comparing these snapshots, you can visibly track technical debt reduction over time. Great job refactoring!
                         </p>
                       </div>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewReplay;
