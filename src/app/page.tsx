'use client';

import * as React from 'react';
import { useState } from 'react';
import { ChatPanel } from '@/components/chat-panel';
import { ResumeDocument } from '@/components/resume-document';
import type { Message, ResumeData, SectionType } from '@/lib/types';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Download, Github } from 'lucide-react';
import { nanoid } from 'nanoid';
import { InitialMessage } from '@/components/initial-message';
import { generateResumeSectionAction } from '@/lib/actions';

const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'Alex Doe',
    email: 'alex.doe@email.com',
    phone: '+1 234 567 890',
    linkedin: 'linkedin.com/in/alex-doe',
  },
  sections: [
    {
      id: nanoid(),
      type: 'Summary',
      title: 'Professional Summary',
      content:
        'Highly motivated and results-oriented professional with a proven track record of success. Seeking to leverage my skills and experience to contribute to a dynamic organization.',
    },
    {
      id: nanoid(),
      type: 'Experience',
      title: 'Work Experience',
      content:
        '**Senior Software Engineer** @ Tech Solutions Inc. (2020-Present)\n- Led the development of a scalable web application, improving performance by 30%.\n- Mentored junior developers and conducted code reviews to maintain high-quality standards.',
    },
    {
      id: nanoid(),
      type: 'Education',
      title: 'Education',
      content:
        '**B.S. in Computer Science** - University of Technology (2016-2020)',
    },
    {
      id: nanoid(),
      type: 'Skills',
      title: 'Skills',
      content:
        'JavaScript, React, Node.js, Python, SQL, Agile Methodologies',
    },
  ],
};

const sectionPrompts: Record<SectionType, string> = {
  Summary:
    "Let's craft a compelling professional summary. Tell me about your career highlights, key skills, and what you're looking for in your next role.",
  Experience:
    'Great, let\'s add a work experience entry. Please provide the following:\n\n- Job Title\n- Company Name & Location\n- Start and End Dates\n- A description of your key responsibilities and achievements.',
  Education:
    "Let's add your educational background. Please provide:\n\n- Your Degree & Major\n- University/Institution Name\n- Graduation Year",
  Skills:
    "Time to showcase your skills! List your technical skills, soft skills, languages, or anything else relevant to your field.",
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'assistant', content: <InitialMessage onSelectSection={handleSectionSelect} /> },
  ]);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionType | null>(null);

  async function handleSectionSelect(sectionType: SectionType) {
    setCurrentSection(sectionType);
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: `Let's work on my ${sectionType}.`,
    };
    const assistantMessage: Message = {
      id: nanoid(),
      role: 'assistant',
      content: sectionPrompts[sectionType],
    };
    setMessages(prev => [...prev, userMessage, assistantMessage]);
  }

  async function handleSendMessage(text: string) {
    if (!currentSection || !text.trim()) return;

    const userMessage: Message = { id: nanoid(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const result = await generateResumeSectionAction({
        sectionType: currentSection,
        userDetails: text,
      });

      const newSection = {
        id: nanoid(),
        type: currentSection,
        title: currentSection === 'Summary' ? 'Professional Summary' : currentSection,
        content: result.generatedSectionContent,
      };

      if(currentSection === 'Summary') {
        setResumeData(prev => ({
          ...prev,
          sections: prev.sections.map(s => s.type === 'Summary' ? { ...s, content: newSection.content } : s)
        }));
      } else {
        setResumeData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
      }
      
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: `I've drafted the ${currentSection} section for you. You can edit it on the right. What would you like to work on next?`,
      };
      
      setMessages(prev => [...prev, {
        id: nanoid(),
        role: 'assistant',
        content: <InitialMessage onSelectSection={handleSectionSelect} introText={`I've drafted the ${currentSection} section for you. You can edit it on the right. What would you like to work on next?`} />
      }]);

    } catch (error) {
      console.error("Failed to generate resume section:", error);
      const errorMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: "Sorry, I had trouble generating that section. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
      setCurrentSection(null);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <header className="flex items-center justify-between p-4 border-b bg-card no-print">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">ResumeFlow AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/firebase/genkit-nextjs-shadcn-resume-builder" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button onClick={handlePrint} variant="default">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </header>

      <div className="flex-1 grid md:grid-cols-2 overflow-hidden">
        <div className="flex flex-col h-full no-print">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
          />
        </div>

        <div className="bg-background border-l overflow-auto print-area">
          <ResumeDocument resumeData={resumeData} setResumeData={setResumeData} />
        </div>
      </div>
    </div>
  );
}
