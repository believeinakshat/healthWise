'use server';

/**
 * @fileOverview A Genkit flow for generating personalized health recommendations based on prediction results.
 *
 * - generateRecommendations - A function that generates personalized health recommendations.
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecommendationsInputSchema = z.object({
  predictionResult: z
    .string()
    .describe('The result of the health prediction, e.g., risk percentage.'),
  riskFactors: z.string().describe('The risk factors contributing to the prediction.'),
  patientId: z.string().describe('The ID of the patient.'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

const GenerateRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('Personalized health recommendations based on the prediction.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;

export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: {
    schema: z.object({
      predictionResult: z
        .string()
        .describe('The result of the health prediction, e.g., risk percentage.'),
      riskFactors: z.string().describe('The risk factors contributing to the prediction.'),
      patientId: z.string().describe('The ID of the patient.'),
    }),
  },
  output: {
    schema: z.object({
      recommendations: z
        .string()
        .describe('Personalized health recommendations based on the prediction.'),
    }),
  },
  prompt: `You are a health expert providing personalized recommendations based on a health prediction.

  Prediction Result: {{{predictionResult}}}
  Risk Factors: {{{riskFactors}}}

  Based on the prediction result and risk factors for patient ID {{{patientId}}}, generate personalized recommendations, explaining the risk factors in an easy to understand way and suggesting lifestyle adjustments.`,
});

const generateRecommendationsFlow = ai.defineFlow<
  typeof GenerateRecommendationsInputSchema,
  typeof GenerateRecommendationsOutputSchema
>(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
