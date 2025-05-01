"use client";

import type {FC} from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  medicalHistory: z.string().min(5, {
    message: "Medical history must be at least 5 characters.",
  }).max(1000, {
    message: "Medical history must not exceed 1000 characters.",
  }),
  currentSymptoms: z.string().min(5, {
    message: "Current symptoms must be at least 5 characters.",
  }).max(1000, {
     message: "Current symptoms must not exceed 1000 characters.",
  }),
});

export type HealthInputFormData = z.infer<typeof formSchema>;

interface HealthInputFormProps {
  onSubmit: (data: HealthInputFormData) => void;
  isLoading: boolean;
}

const HealthInputForm: FC<HealthInputFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<HealthInputFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalHistory: "",
      currentSymptoms: "",
    },
  });

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Health Data Input</CardTitle>
        <CardDescription>Please provide your medical history and current symptoms for analysis.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe relevant past conditions, surgeries, allergies, etc."
                      className="resize-none"
                      rows={5}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief summary of your medical background.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentSymptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the symptoms you are currently experiencing."
                      className="resize-none"
                      rows={5}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Be as detailed as possible about how you are feeling.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Analyzing..." : "Predict Risk"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default HealthInputForm;