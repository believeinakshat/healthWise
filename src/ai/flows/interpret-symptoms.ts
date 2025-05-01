'use server';
/**
 * @fileOverview Interprets user-provided symptoms and medical history using GenAI to enhance ML model adaptation.
 *
 * - interpretSymptoms - A function to interpret symptoms and medical history.
 * - InterpretSymptomsInput - The input type for the interpretSymptoms function.
 * - InterpretSymptomsOutput - The return type for the interpretSymptoms function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const InterpretSymptomsInputSchema = z.object({
  medicalHistory: z.string().describe('The patient\'s medical history.'),
  currentSymptoms: z.string().describe('The patient\'s current symptoms.'),
});
export type InterpretSymptomsInput = z.infer<typeof InterpretSymptomsInputSchema>;

const InterpretSymptomsOutputSchema = z.object({
  interpretedSymptoms: z
    .string()
    .describe(
      'A detailed interpretation of the current symptoms in the context of the medical history.'
    ),
});
export type InterpretSymptomsOutput = z.infer<typeof InterpretSymptomsOutputSchema>;

export async function interpretSymptoms(
  input: InterpretSymptomsInput
): Promise<InterpretSymptomsOutput> {
  return interpretSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretSymptomsPrompt',
  input: {
    schema: z.object({
      medicalHistory: z.string().describe('The patient\'s medical history.'),
      currentSymptoms: z.string().describe('The patient\'s current symptoms.'),
    }),
  },
  output: {
    schema: z.object({
      interpretedSymptoms:
        z.string().describe('A detailed interpretation of the current symptoms.'),
    }),
  },
  prompt: `You are a medical expert. Please interpret the patient's current symptoms in the context of their medical history to provide a detailed understanding of their condition. This interpretation will be used to adapt a machine learning model.

Medical History: {{{medicalHistory}}}
Current Symptoms: {{{currentSymptoms}}}

Interpretation:`,
});

const interpretSymptomsFlow = ai.defineFlow<
  typeof InterpretSymptomsInputSchema,
  typeof InterpretSymptomsOutputSchema
>(
  {
    name: 'interpretSymptomsFlow',
    inputSchema: InterpretSymptomsInputSchema,
    outputSchema: InterpretSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
