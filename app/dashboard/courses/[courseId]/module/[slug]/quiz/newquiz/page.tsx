// app/dashboard/courses/[courseId]/module/[slug]/quiz/newquiz/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchQuestionsForQuiz, createQuestion, deleteQuestion } from "@/app/actions";
import type { Question } from "@/app/utils/types";
import { QuestionForm } from "@/app/components/dashboard/module/Quiz/QuestionForm";
import { QuestionList } from "@/app/components/dashboard/module/Quiz/QuestionList";
import { BackButton } from "@/app/components/BackButton";

export default function NewQuiz({ params }: { params: { slug: string; courseId: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);

  // Load questions on mount
  useEffect(() => {
    async function loadQuestions() {
      const questionsFromDB = await fetchQuestionsForQuiz(params.slug);
      setQuestions(questionsFromDB);
    }
    loadQuestions();
  }, [params.slug]);

  const handleAddQuestion = async (question: Omit<Question, "id">) => {
    const newQuestion = await createQuestion(params.slug, question);
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleDeleteQuestion = async (id: string) => {
    await deleteQuestion(id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <>
    <header>
      <div className="flex flex-row align-middle items-center w-full justify-between">
        <BackButton path={`/dashboard/courses/${params.courseId}/module/${params.slug}`} />
      </div>
    </header>
    <main className="min-h-screen p-8 bg-gradient-to-br">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Quiz Management</h1>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="create">Create Question</TabsTrigger>
            <TabsTrigger value="list">Question List</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <Card className="p-6">
              <QuestionForm onSubmit={handleAddQuestion} />
            </Card>
          </TabsContent>
          <TabsContent value="list">
            <Card className="p-6">
              <QuestionList questions={questions} onDelete={handleDeleteQuestion} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
    </>
  );
}
