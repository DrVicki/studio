'use server';

import {
  generateResumeSection,
  GenerateResumeSectionInput,
} from '@/ai/flows/generate-resume-section';
import {
  improveResumeSection,
  ImproveResumeSectionInput,
} from '@/ai/flows/improve-resume-section';

export async function generateResumeSectionAction(
  input: GenerateResumeSectionInput
) {
  try {
    const output = await generateResumeSection(input);
    return output;
  } catch (error) {
    console.error('Error in generateResumeSectionAction:', error);
    throw new Error('Failed to generate resume section.');
  }
}

export async function improveResumeSectionAction(
  input: ImproveResumeSectionInput
) {
  try {
    const output = await improveResumeSection(input);
    return output;
  } catch (error) {
    console.error('Error in improveResumeSectionAction:', error);
    throw new Error('Failed to improve resume section.');
  }
}
