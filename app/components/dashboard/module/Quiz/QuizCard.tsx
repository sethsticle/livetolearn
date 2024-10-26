"use client";

import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Question } from "@/app/utils/types";

interface QuizCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean, userAnswer: number) => void;
  onNext: () => void;
  onFinish: () => void;
  isFlipping: boolean;
}

export function QuizCard({ question, onAnswer, onNext, onFinish, isFlipping }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isFlipping) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300); // Smooth animation timing
    }
  }, [question, isFlipping]);

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setHasAnswered(true);
    onAnswer(selectedAnswer === question.correctAnswer, selectedAnswer);
  };

  return (
    <div className={cn(
      "transition-transform duration-500 perspective-1000",
      isAnimating ? "rotate-y-90" : "rotate-y-0"
    )}>
      <Card className="p-6 w-[500px] min-h-[400px] flex flex-col">
        <h3 className="text-xl font-semibold mb-6">{question.questionText}</h3>
        
        <RadioGroup
          className="space-y-4 flex-grow hover:cursor-pointer"
          value={selectedAnswer?.toString()}
          onValueChange={(value) => setSelectedAnswer(parseInt(value))}
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-2 p-4 rounded-lg border transition-colors duration-200",
                hasAnswered && index === question.correctAnswer && " border-green-500",
                hasAnswered && selectedAnswer === index && index !== question.correctAnswer && " border-red-500"
              )}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-grow">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 flex justify-end">
        {!hasAnswered ? (
          <Button onClick={handleCheck} disabled={selectedAnswer === null}>
            Check Answer
          </Button>
        ) : (
          <>
          <div className=" w-full flex justify-between align-middle">
            <Button onClick={onFinish} color="red">
              Finish Quiz
            </Button>
            <Button onClick={onNext}>Next</Button>
            </div>
          </>
        )}
        </div>
      </Card>
    </div>
  );
}