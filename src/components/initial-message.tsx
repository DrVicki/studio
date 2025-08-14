'use client'

import { Button } from "./ui/button"
import { Briefcase, GraduationCap, Lightbulb, User } from "lucide-react"
import { SectionType } from "@/lib/types"

interface InitialMessageProps {
    onSelectSection: (sectionType: SectionType) => void;
    introText?: string;
}

const sections: { type: SectionType, label: string, icon: React.ElementType }[] = [
    { type: 'Summary', label: 'Summary', icon: User },
    { type: 'Experience', label: 'Experience', icon: Briefcase },
    { type: 'Education', label: 'Education', icon: GraduationCap },
    { type: 'Skills', label: 'Skills', icon: Lightbulb },
];

export function InitialMessage({ onSelectSection, introText }: InitialMessageProps) {
    return (
        <div className="space-y-4">
            <p>{introText || "Welcome to ResumeFlow AI! I can help you build your resume from scratch or improve existing sections. What would you like to work on?"}</p>
            <div className="grid grid-cols-2 gap-2">
                {sections.map(({ type, label, icon: Icon }) => (
                    <Button key={type} variant="outline" className="justify-start" onClick={() => onSelectSection(type)}>
                        <Icon className="mr-2 h-4 w-4" />
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    )
}
