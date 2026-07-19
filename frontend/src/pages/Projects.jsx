import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Plus, MoreHorizontal, Activity, Star, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { api } from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Fetch unique projects directly from backend API
        const data = await api.getProjects();
        
        // Map data to the format expected by the frontend
        const uniqueProjects = data.map(project => {
          // Calculate an average score if reviews are available or default to 0
          // Note: Assuming project model includes a score or we just list them without scores if none available
          return {
            id: project.id,
            name: project.name,
            lastAnalysis: new Date(project.created_at).toLocaleDateString(),
            score: 10, // Default for new projects, or compute from reviews if backend nested them
            status: 'Healthy'
          };
        });
        
        setProjects(uniqueProjects);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="py-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-text-muted mt-1">Manage your codebase repositories and tracked folders.</p>
        </div>
        <Button onClick={() => navigate('/upload')}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {projects.slice(0, 3).map((project) => (
          <Card key={project.id} className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/reviews')}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                  <Folder className="h-5 w-5" />
                </div>
                <Badge variant={project.status === 'Healthy' ? 'success' : 'warning'}>
                  {project.status}
                </Badge>
              </div>
              <CardTitle className="mt-4 text-lg">{project.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                Analyzed {project.lastAnalysis}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">All Projects</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Health Status</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Last Analysis</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-text-muted">Loading projects...</TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-text-muted">No projects found.</TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-surface border border-border rounded-md">
                        <Folder className="w-4 h-4 text-accent" />
                      </div>
                      {project.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.status === 'Healthy' ? 'success' : 'warning'}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-warning fill-warning" />
                      <span className="font-medium">{project.score}/10</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-muted">{project.lastAnalysis}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-text-primary">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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

export default Projects;
