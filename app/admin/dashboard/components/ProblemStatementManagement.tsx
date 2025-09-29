"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Lightbulb, 
  CheckCircle, 
  XCircle,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Quote
} from "lucide-react";

interface ProblemStatement {
  _id: string;
  title: string;
  description: string;
  themeId: {
    _id: string;
    name: string;
    description: string;
  };
  isActive: boolean;
  createdAt: string;
}

interface Theme {
  _id: string;
  name: string;
  description: string;
}

interface ProblemStatementManagementProps {
  problemStatements: ProblemStatement[];
  themes: Theme[];
  onRefresh: () => void;
}

export default function ProblemStatementManagement({ 
  problemStatements, 
  themes, 
  onRefresh 
}: ProblemStatementManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProblemStatement, setEditingProblemStatement] = useState<ProblemStatement | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    themeId: ''
  });

  const editorRef = useRef<HTMLDivElement>(null);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const handleCreateProblemStatement = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.themeId) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/problem-statements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ title: '', description: '', themeId: '' });
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
        setIsCreateOpen(false);
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create problem statement');
      }
    } catch (error) {
      console.error('Error creating problem statement:', error);
      alert('Failed to create problem statement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProblemStatement = async () => {
    if (!editingProblemStatement || !formData.title.trim() || !formData.description.trim() || !formData.themeId) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/problem-statements/${editingProblemStatement._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ title: '', description: '', themeId: '' });
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
        setEditingProblemStatement(null);
        setIsEditOpen(false);
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update problem statement');
      }
    } catch (error) {
      console.error('Error updating problem statement:', error);
      alert('Failed to update problem statement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProblemStatement = async (problemStatementId: string) => {
    if (!confirm('Are you sure you want to delete this problem statement? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(problemStatementId);
    try {
      const response = await fetch(`/api/admin/problem-statements/${problemStatementId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete problem statement');
      }
    } catch (error) {
      console.error('Error deleting problem statement:', error);
      alert('Failed to delete problem statement');
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditDialog = (problemStatement: ProblemStatement) => {
    setEditingProblemStatement(problemStatement);
    setFormData({
      title: problemStatement.title,
      description: problemStatement.description,
      themeId: problemStatement.themeId._id
    });
    setIsEditOpen(true);
    
    // Set editor content
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = problemStatement.description;
      }
    }, 100);
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      setFormData(prev => ({
        ...prev,
        description: editorRef.current?.innerHTML || ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Problem Statements Management</h3>
          <p className="text-gray-600">Create and manage problem statements for each theme</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Problem Statement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Problem Statement</DialogTitle>
              <DialogDescription>
                Add a new problem statement for a specific theme.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Problem Statement Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., AI-powered Healthcare Diagnostic Tool"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={formData.themeId} onValueChange={(value) => setFormData({ ...formData, themeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme._id} value={theme._id}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <div className="border rounded-lg">
                  {/* Rich Text Editor Toolbar */}
                  <div className="border-b p-2 flex flex-wrap gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('bold')}
                      className="h-8 w-8 p-0"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('italic')}
                      className="h-8 w-8 p-0"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('underline')}
                      className="h-8 w-8 p-0"
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={insertLink}
                      className="h-8 w-8 p-0"
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('insertUnorderedList')}
                      className="h-8 w-8 p-0"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('insertOrderedList')}
                      className="h-8 w-8 p-0"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('formatBlock', 'blockquote')}
                      className="h-8 w-8 p-0"
                    >
                      <Quote className="w-4 h-4" />
                    </Button>
                  </div>
                  {/* Rich Text Editor Content */}
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleEditorChange}
                    className="min-h-[200px] p-3 focus:outline-none"
                    style={{ minHeight: '200px' }}
                    placeholder="Write your problem statement description here..."
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProblemStatement} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Problem Statement'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Problem Statements List */}
      <div className="space-y-4">
        {problemStatements.map((problemStatement) => (
          <Card key={problemStatement._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{problemStatement.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        {problemStatement.themeId.name}
                      </Badge>
                      <Badge variant={problemStatement.isActive ? "default" : "secondary"}>
                        {problemStatement.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(problemStatement)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProblemStatement(problemStatement._id)}
                    disabled={isDeleting === problemStatement._id}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {isDeleting === problemStatement._id ? (
                      <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="text-gray-600 text-sm line-clamp-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: problemStatement.description }}
              />
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Created: {new Date(problemStatement.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {problemStatements.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No problem statements yet</h3>
          <p className="text-gray-600 mb-4">Create your first problem statement to get started</p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Problem Statement
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Problem Statement</DialogTitle>
            <DialogDescription>
              Update the problem statement information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Problem Statement Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AI-powered Healthcare Diagnostic Tool"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-theme">Theme</Label>
              <Select value={formData.themeId} onValueChange={(value) => setFormData({ ...formData, themeId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme._id} value={theme._id}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <div className="border rounded-lg">
                {/* Rich Text Editor Toolbar */}
                <div className="border-b p-2 flex flex-wrap gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('bold')}
                    className="h-8 w-8 p-0"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('italic')}
                    className="h-8 w-8 p-0"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('underline')}
                    className="h-8 w-8 p-0"
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={insertLink}
                    className="h-8 w-8 p-0"
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('insertUnorderedList')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('insertOrderedList')}
                    className="h-8 w-8 p-0"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('formatBlock', 'blockquote')}
                    className="h-8 w-8 p-0"
                  >
                    <Quote className="w-4 h-4" />
                  </Button>
                </div>
                {/* Rich Text Editor Content */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorChange}
                  className="min-h-[200px] p-3 focus:outline-none"
                  style={{ minHeight: '200px' }}
                  placeholder="Write your problem statement description here..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProblemStatement} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Problem Statement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
