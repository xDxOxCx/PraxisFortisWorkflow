import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, FileText, Clock, Users } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  flow_data: {
    steps: Array<{
      id: string;
      text: string;
      type: 'start' | 'process' | 'decision' | 'end';
    }>;
  };
  created_at: string;
  updated_at: string;
}

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['/api/templates'],
  });

  const categories = ['all', ...new Set(templates.map((t: Template) => t.category))];

  const filteredTemplates = templates.filter((template: Template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const useTemplate = (template: Template) => {
    // Navigate to workflow builder with template data
    window.location.href = `/workflow-builder?template=${template.id}`;
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-montserrat" style={{color: 'hsl(215, 25%, 27%)'}}>
            Workflow Templates
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose from our library of pre-built workflows designed for healthcare practices
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className={selectedCategory === category 
                  ? "bg-slate-blue text-primary-foreground" 
                  : "text-muted-foreground hover:text-emerald-green"
                }
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template: Template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-blue/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-slate-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold" style={{color: 'hsl(215, 25%, 27%)'}}>
                          {template.name}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Workflow Steps Preview */}
                  {template.flow_data?.steps && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Workflow Steps:</h4>
                      <div className="space-y-1">
                        {template.flow_data.steps.slice(0, 3).map((step: any, index: number) => (
                          <div key={step.id} className="flex items-center gap-2 text-xs">
                            <div className={`w-2 h-2 rounded-full ${
                              step.type === 'start' ? 'bg-green-500' :
                              step.type === 'end' ? 'bg-red-500' :
                              step.type === 'decision' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`} />
                            <span className="text-muted-foreground truncate">
                              {index + 1}. {step.text}
                            </span>
                          </div>
                        ))}
                        {template.flow_data.steps.length > 3 && (
                          <div className="text-xs text-muted-foreground pl-4">
                            +{template.flow_data.steps.length - 3} more steps
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.flow_data?.steps?.length || 0} steps
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Popular
                      </div>
                    </div>
                    <Button 
                      onClick={() => useTemplate(template)}
                      size="sm"
                      className="bg-emerald-green hover:bg-emerald-green/90 text-primary-foreground"
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredTemplates.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}