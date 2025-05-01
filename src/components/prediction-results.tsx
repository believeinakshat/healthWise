"use client";

import type {FC} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, HeartPulse, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock Prediction Data Structure - Replace with actual data structure later
interface PredictionData {
  predictionResult: string; // e.g., "High Risk", "Low Risk", "75% Risk"
  riskFactors: string; // A summary or list of identified risk factors
  interpretedSymptoms?: string; // Optional: AI interpretation of symptoms
  recommendations?: string; // Optional: AI-generated recommendations
}

interface PredictionResultsProps {
  results: PredictionData | null;
  isLoading: boolean;
}

const PredictionResults: FC<PredictionResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl shadow-lg mt-8 animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <Separator className="my-4" />
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
           <div className="h-4 bg-muted rounded w-4/6"></div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null; // Don't render anything if there are no results yet and not loading
  }

  const getRiskLevel = (prediction: string): 'low' | 'medium' | 'high' => {
    const lowerCasePrediction = prediction.toLowerCase();
    if (lowerCasePrediction.includes('low')) return 'low';
    if (lowerCasePrediction.includes('high') || lowerCasePrediction.includes('elevated')) return 'high';
    // Attempt to parse percentage
    const percentageMatch = lowerCasePrediction.match(/(\d+)%/);
    if (percentageMatch) {
      const percentage = parseInt(percentageMatch[1], 10);
      if (percentage < 30) return 'low';
      if (percentage >= 30 && percentage < 70) return 'medium';
      return 'high';
    }
    return 'medium'; // Default if cannot determine
  };

  const riskLevel = getRiskLevel(results.predictionResult);
  const riskColor = riskLevel === 'high' ? 'destructive' : riskLevel === 'medium' ? 'default' : 'secondary';
  const RiskIcon = riskLevel === 'high' ? AlertCircle : riskLevel === 'medium' ? HeartPulse : CheckCircle2;


  return (
    <Card className="w-full max-w-2xl shadow-lg mt-8 transition-opacity duration-500 ease-in-out opacity-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
           <Activity className="h-6 w-6 text-primary" />
           Prediction Results
        </CardTitle>
        <CardDescription>Analysis based on the provided health data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
         <div>
           <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
             <RiskIcon className={`h-5 w-5 ${riskLevel === 'high' ? 'text-destructive' : riskLevel === 'medium' ? 'text-accent' : 'text-primary' }`} />
             Risk Assessment
           </h3>
           <Badge variant={riskColor} className="text-lg px-4 py-1">
             {results.predictionResult}
           </Badge>
         </div>

         {results.interpretedSymptoms && (
            <div>
                <h3 className="text-lg font-semibold mb-2">Symptom Interpretation</h3>
                <p className="text-muted-foreground">{results.interpretedSymptoms}</p>
            </div>
         )}

         <div>
           <h3 className="text-lg font-semibold mb-2">Identified Risk Factors</h3>
           <p className="text-muted-foreground">{results.riskFactors || "No specific risk factors identified."}</p>
         </div>

         {results.recommendations && (
           <>
             <Separator className="my-4" />
             <div>
               <h3 className="text-lg font-semibold mb-2">Personalized Recommendations</h3>
               <p className="text-muted-foreground whitespace-pre-wrap">{results.recommendations}</p>
             </div>
           </>
         )}
      </CardContent>
    </Card>
  );
}

export default PredictionResults;