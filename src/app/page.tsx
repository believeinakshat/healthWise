"use client";

import React, { useState, useCallback, useEffect } from 'react';
import HealthInputForm, { type HealthInputFormData } from "@/components/health-input-form";
import PredictionResults from "@/components/prediction-results";
import { interpretSymptoms } from "@/ai/flows/interpret-symptoms";
import { generateRecommendations } from "@/ai/flows/generate-recommendations";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define the structure for prediction results state
interface PredictionState {
  predictionResult: string;
  riskFactors: string;
  interpretedSymptoms?: string;
  recommendations?: string;
}

export default function Home() {
  const [predictionData, setPredictionData] = useState<PredictionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // State to manage hydration avoidance for initial render
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFormSubmit = useCallback(async (data: HealthInputFormData) => {
    setIsLoading(true);
    setPredictionData(null); // Clear previous results

    try {
      // Step 1: Interpret Symptoms using GenAI
      const interpretationResult = await interpretSymptoms({
        medicalHistory: data.medicalHistory,
        currentSymptoms: data.currentSymptoms,
      });
      const interpretedSymptoms = interpretationResult.interpretedSymptoms;

      // Step 2: Simulate ML Prediction (Replace with actual ML model call)
      // This is a placeholder. In a real app, you'd call your Python backend
      // which hosts the sklearn/TensorFlow model.
      // The model would take processed input (potentially guided by interpretation)
      // and return a prediction and contributing factors.
      const mockPrediction = () => {
        // Simulate varying results based on input length or keywords
        const combinedLength = data.medicalHistory.length + data.currentSymptoms.length;
        const hasRiskKeywords = /diabetes|heart|pressure|sugar|chest pain/i.test(data.currentSymptoms);

        if (hasRiskKeywords && combinedLength > 100) {
          return { result: "High Risk (78%)", factors: "Based on reported symptoms like chest pain and medical history length suggesting complexity." };
        } else if (combinedLength > 50 || hasRiskKeywords) {
          return { result: "Medium Risk (45%)", factors: "Potential risk factors detected in symptoms or history." };
        } else {
          return { result: "Low Risk (15%)", factors: "No significant immediate risk factors identified." };
        }
      };
      const { result: predictionResult, factors: riskFactors } = mockPrediction();


      // Step 3: Generate Recommendations using GenAI
      const recommendationResult = await generateRecommendations({
        predictionResult: predictionResult,
        riskFactors: riskFactors,
        patientId: 'user_001', // Replace with actual user ID if available
      });
      const recommendations = recommendationResult.recommendations;


      // Update state with all results
      setPredictionData({
          predictionResult,
          riskFactors,
          interpretedSymptoms,
          recommendations,
       });


    } catch (error) {
      console.error("Error during prediction process:", error);
      toast({
        title: "Error",
        description: "Failed to get prediction. Please try again.",
        variant: "destructive",
      });
      setPredictionData(null); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [toast]);


 // Avoid rendering the form until the client has hydrated
  if (!isClient) {
    return (
       <div className="flex flex-col items-center space-y-8 w-full max-w-2xl">
          <Card className="w-full animate-pulse">
             <CardHeader>
                 <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mt-2"></div>
             </CardHeader>
             <CardContent className="space-y-4">
                 <div className="h-20 bg-muted rounded"></div>
                 <div className="h-20 bg-muted rounded"></div>
                 <div className="h-10 bg-primary/50 rounded mt-6"></div>
             </CardContent>
          </Card>
       </div>
    );
  }


  return (
    <div className="flex flex-col items-center space-y-8 w-full">
       {/* Hero/Title Section */}
       <div className="text-center mb-8">
           <h1 className="text-4xl font-bold text-primary mb-2">HealthWise</h1>
           <p className="text-lg text-muted-foreground">Your personal AI health risk predictor.</p>
       </div>

      <HealthInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      <PredictionResults results={predictionData} isLoading={isLoading} />
    </div>
  );
}
