// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for improving resume sections.
 *
 * The flow accepts a resume section as input and returns suggestions for improvement,
 * focusing on clarity, impact, and keyword optimization.
 *
 * @module src/ai/flows/improve-resume-section
 *
 * @interface ImproveResumeSectionInput - The input type for the improveResumeSection function.
 * @interface ImproveResumeSectionOutput - The output type for the improveResumeSection function.
 * @function improveResumeSection - A function that handles the resume section improvement process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveResumeSectionInputSchema = z.object({
  resumeSection: z
    .string()
    .describe('The resume section to improve.'),
});

export type ImproveResumeSectionInput = z.infer<
  typeof ImproveResumeSectionInputSchema
>;

const ImproveResumeSectionOutputSchema = z.object({
  improvedSection: z
    .string()
    .describe('The improved resume section with suggestions incorporated.'),
  suggestions: z
    .string()
    .describe('Specific suggestions for improving the resume section.'),
});

export type ImproveResumeSectionOutput = z.infer<
  typeof ImproveResumeSectionOutputSchema
>;

/**
 * Improves a given resume section by providing suggestions for clarity,
 * impact, and keyword optimization.
 * @param input - The input containing the resume section to improve.
 * @returns The improved resume section and suggestions.
 */
export async function improveResumeSection(
  input: ImproveResumeSectionInput
): Promise<ImproveResumeSectionOutput> {
  return improveResumeSectionFlow(input);
}

const improveResumeSectionPrompt = ai.definePrompt({
  name: 'improveResumeSectionPrompt',
  input: {schema: ImproveResumeSectionInputSchema},
  output: {schema: ImproveResumeSectionOutputSchema},
  prompt: `You are an expert resume writer. Review the following resume section and provide an improved version, along with specific suggestions for improving its clarity, impact, and keyword optimization.\n\nResume Section:\n{{resumeSection}}\n\nImproved Resume Section:`,
});

const improveResumeSectionFlow = ai.defineFlow(
  {
    name: 'improveResumeSectionFlow',
    inputSchema: ImproveResumeSectionInputSchema,
    outputSchema: ImproveResumeSectionOutputSchema,
  },
  async input => {
    const {output} = await improveResumeSectionPrompt(input);
    return output!;
  }
);
