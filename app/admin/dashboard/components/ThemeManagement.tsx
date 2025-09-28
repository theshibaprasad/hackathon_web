"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Target, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from "lucide-react";

interface Theme {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  problemStatements: any[];
}

interface ThemeManagementProps {
  themes: Theme[];
  onRefresh: () => void;
}

export default function ThemeManagement({ themes, onRefresh }: ThemeManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleCreateTheme = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', description: '' });
        setIsCreateOpen(false);
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create theme');
      }
    } catch (error) {
      console.error('Error creating theme:', error);
      alert('Failed to create theme');
    } finally {
      setIsLoading(false);
      setIsCreating(false);
    }
  };

  const handleEditTheme = async () => {
    if (!editingTheme || !formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/themes/${editingTheme._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', description: '' });
        setEditingTheme(null);
        setIsEditOpen(false);
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update theme');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      alert('Failed to update theme');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    if (!confirm('Are you sure you want to delete this theme? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(themeId);
    try {
      const response = await fetch(`/api/admin/themes/${themeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete theme');
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
      alert('Failed to delete theme');
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditDialog = (theme: Theme) => {
    setEditingTheme(theme);
    setFormData({
      name: theme.name,
      description: theme.description
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Themes Management</h3>
          <p className="text-gray-600">Create and manage hackathon themes</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Theme
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Theme</DialogTitle>
              <DialogDescription>
                Add a new theme for the hackathon. Themes help categorize problem statements.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Theme Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Artificial Intelligence"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the theme..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTheme} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Theme'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{theme.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={theme.isActive ? "default" : "secondary"}>
                        {theme.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        {theme.problemStatements?.length || 0} problems
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(theme)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTheme(theme._id)}
                    disabled={isDeleting === theme._id}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {isDeleting === theme._id ? (
                      <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm line-clamp-3">{theme.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Created: {new Date(theme.createdAt).toLocaleDateString()}</span>
                {theme.problemStatements?.length > 0 && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Has problems</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Skeleton loading for creating theme */}
        {isCreating && (
          <Card className="hover:shadow-lg transition-shadow animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Target className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="w-32 h-6 bg-gray-200 rounded mb-2" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-4 bg-gray-200 rounded mb-2" />
              <div className="w-3/4 h-4 bg-gray-200 rounded mb-4" />
              <div className="flex items-center justify-between text-xs">
                <div className="w-24 h-3 bg-gray-200 rounded" />
                <div className="w-16 h-3 bg-gray-200 rounded" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {themes.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No themes yet</h3>
          <p className="text-gray-600 mb-4">Create your first theme to get started</p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Theme
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Theme</DialogTitle>
            <DialogDescription>
              Update the theme information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Theme Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Artificial Intelligence"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the theme..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTheme} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Theme'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
