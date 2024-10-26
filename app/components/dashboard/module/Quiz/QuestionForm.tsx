"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from "@/app/utils/types";

// Zod schema to validate the form inputs
const questionSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .length(4, "Must provide exactly 4 options"),
  correctAnswer: z.string().regex(/^[0-3]$/, "Must select a correct answer"),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  onSubmit: (question: Omit<Question, "id">) => void;
}

export function QuestionForm({ onSubmit }: QuestionFormProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  });

  const handleSubmit = (values: QuestionFormValues) => {
    onSubmit({
      questionText: values.question,
      options: values.options,
      correctAnswer: parseInt(values.correctAnswer),
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your question" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {[0, 1, 2, 3].map((index) => (
          <FormField
            key={index}
            control={form.control}
            name={`options.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option {index + 1}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={`Enter option ${index + 1}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="correctAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correct Answer</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  {[0, 1, 2, 3].map((index) => (
                    <FormItem key={index} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={index.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Option {index + 1}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Question
        </Button>
      </form>
    </Form>
  );
}
