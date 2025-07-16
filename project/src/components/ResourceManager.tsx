import React, { useState } from 'react';
import { Resource, Subject } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  Video, 
  Book, 
  Link, 
  Star, 
  StarOff,
  Edit,
  Trash2,
  Tag,
  Calendar,
  Eye
} from 'lucide-react';

interface ResourceManagerProps {
  resources: Resource[];
  subjects: Subject[];
  onAddResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  onUpdateResource: (id: string, resource: Partial<Resource>) => void;
  onDeleteResource: (id: string) => void;
  onBack: () => void;
}

const resourceTypeIcons = {
  link: Link,
  file: FileText,
  note: FileText,
  video: Video,
  book: Book
};

const resourceTypeColors = {
  link: 'text-blue-600 bg-blue-100',
  file: 'text-green-600 bg-green-100',
  note: 'text-purple-600 bg-purple-100',
  video: 'text-red-600 bg-red-100',
  book: 'text-orange-600 bg-orange-100'
};

export default function ResourceManager({ 
  resources, 
  subjects, 
  onAddResource, 
  onUpdateResource, 
  onDeleteResource, 
  onBack 
}: ResourceManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || resource.subjectId === selectedSubject;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  const handleToggleFavorite = (resource: Resource) => {
    onUpdateResource(resource.id, { isFavorite: !resource.isFavorite });
  };

  const handleAccessResource = (resource: Resource) => {
    onUpdateResource(resource.id, { lastAccessed: new Date() });
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resource Manager</h1>
                <p className="text-gray-600">Organize your study materials and resources</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Resource
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="link">Links</option>
              <option value="file">Files</option>
              <option value="note">Notes</option>
              <option value="video">Videos</option>
              <option value="book">Books</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => {
            const Icon = resourceTypeIcons[resource.type];
            const subject = subjects.find(s => s.id === resource.subjectId);
            
            return (
              <div key={resource.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${resourceTypeColors[resource.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFavorite(resource)}
                      className={`p-1 rounded-lg transition-colors ${
                        resource.isFavorite 
                          ? 'text-yellow-600 hover:text-yellow-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {resource.isFavorite ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditingResource(resource)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteResource(resource.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                
                {subject && (
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="text-sm text-gray-600">{subject.name}</span>
                  </div>
                )}

                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{resource.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {resource.createdAt.toLocaleDateString()}
                  </div>
                  {resource.lastAccessed && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {resource.lastAccessed.toLocaleDateString()}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAccessResource(resource)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {resource.type === 'link' ? <ExternalLink className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {resource.type === 'link' ? 'Open Link' : 'View Resource'}
                </button>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedSubject !== 'all' || selectedType !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Start by adding your first study resource'
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Resource
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Resource Modal */}
      {(showAddForm || editingResource) && (
        <ResourceForm
          resource={editingResource}
          subjects={subjects}
          onSubmit={(resourceData) => {
            if (editingResource) {
              onUpdateResource(editingResource.id, resourceData);
              setEditingResource(null);
            } else {
              onAddResource(resourceData);
              setShowAddForm(false);
            }
          }}
          onClose={() => {
            setShowAddForm(false);
            setEditingResource(null);
          }}
        />
      )}
    </div>
  );
}

interface ResourceFormProps {
  resource?: Resource | null;
  subjects: Subject[];
  onSubmit: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

function ResourceForm({ resource, subjects, onSubmit, onClose }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    type: resource?.type || 'link' as const,
    url: resource?.url || '',
    content: resource?.content || '',
    tags: resource?.tags.join(', ') || '',
    subjectId: resource?.subjectId || subjects[0]?.id || '',
    isFavorite: resource?.isFavorite || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      lastAccessed: resource?.lastAccessed
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {resource ? 'Edit Resource' : 'Add New Resource'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="link">Link</option>
                <option value="file">File</option>
                <option value="note">Note</option>
                <option value="video">Video</option>
                <option value="book">Book</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData(prev => ({ ...prev, subjectId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>

          {(formData.type === 'link' || formData.type === 'video') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          )}

          {formData.type === 'note' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
                placeholder="Enter your notes here..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="calculus, formulas, important"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.isFavorite}
              onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="favorite" className="text-sm font-medium text-gray-700">
              Mark as favorite
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {resource ? 'Update Resource' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}