import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Search, ShieldCheck, Filter, FileCode2 } from 'lucide-react';
import { api } from '../api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const StatCard = ({ title, value, subtitle }) => (
  <Card>
    <CardContent className="p-6">
      <div className="text-sm font-medium text-text-muted mb-1">{title}</div>
      <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
      {subtitle && <div className="text-xs text-text-muted">{subtitle}</div>}
    </CardContent>
  </Card>
);

const Reviews = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, reviewsData] = await Promise.all([
          api.getStats(),
          api.getReviews()
        ]);
        setStats(statsData);
        // Format reviews for UI
        setReviews(reviewsData.map(r => ({
          id: r.id,
          project: r.project?.name || 'Unknown Project',
          date: new Date(r.created_at).toLocaleDateString(),
          pylint_score: parseFloat(r.pylint_score || 0),
          ai_score: parseFloat(r.ai_score || 0),
          issues: {
            high: r.findings?.filter(f => f.severity === 'HIGH' || f.severity === 'CRITICAL').length || 0,
            med: r.findings?.filter(f => f.severity === 'MEDIUM' || f.severity === 'WARNING').length || 0,
            low: r.findings?.filter(f => f.severity === 'LOW' || f.severity === 'INFO').length || 0,
          }
        })));
      } catch (err) {
        console.error('Failed to fetch review history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredReviews = reviews.filter(r => r.project.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="py-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Review History</h1>
        <p className="text-text-muted mt-2">View and manage past code analysis reports and AI insights.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Reviews" value={stats.total_reviews} subtitle="Across all projects" />
          <StatCard title="Avg Quality Score" value={`${stats.average_quality_score}/10`} subtitle="Pylint static analysis" />
          <StatCard title="Avg Complexity" value={stats.average_complexity} subtitle="Cyclomatic complexity" />
          <StatCard title="Avg AI Score" value={`${stats.average_ai_score}/10`} subtitle="Deep AI analysis" />
        </div>
      )}

      <Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
            <Input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>High Issues</TableHead>
              <TableHead>Med Issues</TableHead>
              <TableHead>Low Issues</TableHead>
              <TableHead className="text-right">Quality Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-text-muted">Loading reviews...</TableCell>
              </TableRow>
            ) : filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-text-muted">No reviews found matching your search.</TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow 
                  key={review.id} 
                  className="cursor-pointer group"
                  onClick={() => navigate(`/reviews/${review.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-accent/10 flex items-center justify-center">
                        <FileCode2 className="w-4 h-4 text-accent" />
                      </div>
                      <span className="group-hover:text-accent transition-colors">{review.project}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-muted">{review.date}</TableCell>
                  <TableCell>
                    {review.issues.high > 0 ? (
                      <Badge variant="destructive">{review.issues.high}</Badge>
                    ) : (
                      <span className="text-border">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {review.issues.med > 0 ? (
                      <Badge variant="warning">{review.issues.med}</Badge>
                    ) : (
                      <span className="text-border">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {review.issues.low > 0 ? (
                      <Badge variant="success">{review.issues.low}</Badge>
                    ) : (
                      <span className="text-border">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ShieldCheck className={
                        review.pylint_score >= 9 ? 'text-success' : 
                        review.pylint_score >= 7 ? 'text-warning' : 'text-destructive'
                      } />
                      <span className="font-semibold">{review.pylint_score}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Reviews;
