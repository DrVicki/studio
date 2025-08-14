export type SectionType = 'Summary' | 'Experience' | 'Education' | 'Skills';

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
}
