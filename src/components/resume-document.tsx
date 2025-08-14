'use client';

import * as React from 'react';
import {
  Briefcase,
  GraduationCap,
  Lightbulb,
  Mail,
  Phone,
  Linkedin,
  User,
  Pencil,
  Save,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import type { ResumeData, ResumeSection } from '@/lib/types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { improveResumeSectionAction } from '@/lib/actions';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface ResumeDocumentProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const sectionIcons: Record<string, React.ElementType> = {
  Summary: User,
  Experience: Briefcase,
  Education: GraduationCap,
  Skills: Lightbulb,
};

export function ResumeDocument({ resumeData, setResumeData }: ResumeDocumentProps) {
  const [editingSectionId, setEditingSectionId] = React.useState<string | null>(null);
  const [editingContent, setEditingContent] = React.useState('');
  const [isImproving, setIsImproving] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleEditClick = (section: ResumeSection) => {
    setEditingSectionId(section.id);
    setEditingContent(section.content);
  };

  const handleCancelEdit = () => {
    setEditingSectionId(null);
    setEditingContent('');
  };

  const handleSaveEdit = () => {
    if (editingSectionId) {
      setResumeData((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === editingSectionId ? { ...s, content: editingContent } : s
        ),
      }));
    }
    handleCancelEdit();
  };

  const handleImproveContent = async (section: ResumeSection) => {
    setIsImproving(section.id);
    try {
      const result = await improveResumeSectionAction({ resumeSection: section.content });
      setEditingContent(result.improvedSection);
      toast({
        title: "Content Improved!",
        description: "The section has been updated with AI suggestions.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to improve content. Please try again.",
      });
    } finally {
      setIsImproving(null);
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setResumeData(prev => ({
        ...prev,
        personalInfo: {
            ...prev.personalInfo,
            [field]: value
        }
    }))
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-background font-serif text-gray-800">
      <Card className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 shadow-2xl rounded-lg bg-white">
        <header className="text-center border-b pb-6 mb-8">
          <Input className='text-4xl font-bold text-center border-none shadow-none focus-visible:ring-1' value={resumeData.personalInfo.name} onChange={(e) => handlePersonalInfoChange('name', e.target.value)} />
          <div className="flex justify-center items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-600 flex-wrap">
            <div className='flex items-center gap-2'>
              <Mail className="w-4 h-4 text-primary" />
              <Input className='border-none shadow-none focus-visible:ring-1' value={resumeData.personalInfo.email} onChange={(e) => handlePersonalInfoChange('email', e.target.value)} />
            </div>
            <div className='flex items-center gap-2'>
              <Phone className="w-4 h-4 text-primary" />
              <Input className='border-none shadow-none focus-visible:ring-1' value={resumeData.personalInfo.phone} onChange={(e) => handlePersonalInfoChange('phone', e.target.value)} />
            </div>
            <div className='flex items-center gap-2'>
              <Linkedin className="w-4 h-4 text-primary" />
              <Input className='border-none shadow-none focus-visible:ring-1' value={resumeData.personalInfo.linkedin} onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)} />
            </div>
          </div>
        </header>

        <main className="space-y-8">
          {resumeData.sections.map((section) => {
            const Icon = sectionIcons[section.type] || Briefcase;
            const isEditing = editingSectionId === section.id;
            return (
              <section key={section.id} className="relative group">
                <div className='flex items-center gap-3 mb-4'>
                  <Icon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                </div>
                
                <div className='pl-9'>
                  {isEditing ? (
                    <div className="space-y-2">
                       <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="min-h-[150px] text-base"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                          <X className='mr-2 h-4 w-4' /> Cancel
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleImproveContent(section)} disabled={isImproving === section.id}>
                          {isImproving === section.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className='mr-2 h-4 w-4' />}
                          Improve with AI
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                           <Save className='mr-2 h-4 w-4' /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div onDoubleClick={() => handleEditClick(section)} className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {section.content}
                    </div>
                  )}
                </div>
                
                {!isEditing && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity no-print rounded-full h-8 w-8"
                        onClick={() => handleEditClick(section)}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                )}
              </section>
            );
          })}
        </main>
      </Card>
    </div>
  );
}
