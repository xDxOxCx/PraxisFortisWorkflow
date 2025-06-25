import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, FileText, Clock, Users } from 'lucide-react';
import Navbar from '@/components/layout/navbar';

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
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
    <div className="min-h-screen bg-pearl-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-montserrat" style={{color: 'hsl(215, 25%, 27%)'}}>
            Workflow Templates
          </h1>
          <p className="text-silver-gray mt-2">
            Choose from our library of pre-built workflows designed for healthcare practices
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-gray" />
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
                  ? "bg-slate-blue text-white" 
                  : "text-silver-gray hover:text-emerald-green"
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
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded"></div>
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
                  <p className="text-silver-gray text-sm mb-4 line-clamp-3">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-silver-gray">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        5-10 min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Popular
                      </div>
                    </div>
                    <Button 
                      onClick={() => useTemplate(template)}
                      size="sm"
                      className="bg-emerald-green hover:bg-emerald-green/90 text-white"
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
            <FileText className="w-12 h-12 text-silver-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-silver-gray mb-2">No templates found</h3>
            <p className="text-silver-gray">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}