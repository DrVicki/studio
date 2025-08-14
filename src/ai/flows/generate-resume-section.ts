'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a resume section based on user input.
 *
 * It includes:
 * - `generateResumeSection`: An async function that takes user input and returns a generated resume section.
 * - `GenerateResumeSectionInput`: The input type for the `generateResumeSection` function.
 * - `GenerateResumeSectionOutput`: The output type for the `generateResumeSection` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeSectionInputSchema = z.object({
  sectionType: z
    .string()
    .describe("The type of resume section to generate (e.g., 'Work Experience', 'Education')."),
  userDetails: z
    .string()
    .describe('The details provided by the user for this section.'),
});

export type GenerateResumeSectionInput = z.infer<typeof GenerateResumeSectionInputSchema>;

const GenerateResumeSectionOutputSchema = z.object({
  generatedSectionContent: z
    .string()
    .describe('The AI-generated content for the resume section.'),
});

export type GenerateResumeSectionOutput = z.infer<typeof GenerateResumeSectionOutputSchema>;

export async function generateResumeSection(
  input: GenerateResumeSectionInput
): Promise<GenerateResumeSectionOutput> {
  return generateResumeSectionFlow(input);
}

const generateResumeSectionPrompt = ai.definePrompt({
  name: 'generateResumeSectionPrompt',
  input: {schema: GenerateResumeSectionInputSchema},
  output: {schema: GenerateResumeSectionOutputSchema},
  prompt: `You are an expert resume writer. Generate a draft for the {{{sectionType}}} section of a resume based on the following details provided by the user: {{{userDetails}}}. Format it according to industry best practices.`,
});

const generateResumeSectionFlow = ai.defineFlow(
  {
    name: 'generateResumeSectionFlow',
    inputSchema: GenerateResumeSectionInputSchema,
    outputSchema: GenerateResumeSectionOutputSchema,
  },
  async input => {
    const {output} = await generateResumeSectionPrompt(input);
    return output!;
  }
);
