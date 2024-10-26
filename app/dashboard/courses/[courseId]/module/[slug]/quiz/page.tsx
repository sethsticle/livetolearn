// app/components/dashboard/module/Quiz/QuizPage.tsx
"use client";

import { useState, useEffect } from "react";
import { QuizCard } from "@/app/components/dashboard/module/Quiz/QuizCard";
import { QuizResults } from "@/app/components/dashboard/module/Quiz/QuizResults";
import { fetchQuizData } from "@/app/actions";
import type { Question, Quiz, QuizState } from "@/app/utils/types";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/app/components/LoadingScreen";
import { BackButton } from "@/app/components/BackButton";
import Link from "next/link";

export default function QuizPage({ params }: { params: { slug: string, courseId: string } }) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [quizState, setQuizState] = useState<QuizState>({
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
    });
    const [hasStarted, setHasStarted] = useState(false); // New state to control animation start

    useEffect(() => {
        async function loadQuiz() {
            const data = await fetchQuizData(params.slug);
            if (data) setQuiz({ ...data, questions: shuffleArray(data.questions) });
        }
        loadQuiz();
    }, [params.slug]);

    const handleAnswer = (isCorrect: boolean, userAnswer: number) => {
        setQuizState((prev) => ({
            ...prev,
            score: isCorrect ? prev.score + 1 : prev.score,
            answers: [
                ...prev.answers,
                {
                    questionId: quiz!.questions[prev.currentQuestionIndex].id,
                    correct: isCorrect,
                    userAnswer,
                },
            ],
        }));
    };

    const handleNext = () => {
        setHasStarted(true); // Start the animation only after "Next" is clicked
        setTimeout(() => {
            setQuizState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
            }));
        }, 300);
    };

    const handleFinish = () => {
        setQuizState((prev) => ({
            ...prev,
            currentQuestionIndex: quiz!.questions.length, // End quiz
        }));
    };

    const isQuizComplete = quiz?.questions && quizState.currentQuestionIndex >= quiz.questions.length;

    if (!quiz) {
        return <LoadingScreen />;
    }


    if (quiz.questions.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-lg mb-4">No questions available for this quiz just yet. Please feel free to add some</p>
                <Button asChild>
                    <Link href={`/dashboard/courses/${params.courseId}/module/${params.slug}/quiz/newquiz`}>
                        Add Questions
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <header>
                <div className="flex flex-row align-middle items-center w-full justify-between">
                    <BackButton path={`/dashboard/courses/${params.courseId}/module/${params.slug}`} />
                    <Button variant="secondary" asChild>
                        <Link href={`/dashboard/courses/${params.courseId}/module/${params.slug}/quiz/newquiz`}>Edit the Questions</Link>
                    </Button>
                </div>
            </header>
            <main className="min-h-screen flex items-center justify-center">
                <div className="transition-opacity duration-500">
                    {!isQuizComplete ? (
                        <QuizCard
                            key={quizState.currentQuestionIndex}
                            question={quiz.questions[quizState.currentQuestionIndex]}
                            onAnswer={handleAnswer}
                            onNext={handleNext}
                            onFinish={handleFinish}
                            isFlipping={hasStarted}
                        />
                    ) : (
                        <QuizResults results={quizState} questions={quiz.questions} />
                    )}
                </div>
            </main>
        </>
    );
}

// Helper function to shuffle the questions array
function shuffleArray(array: Question[]) {
    return array.sort(() => Math.random() - 0.5);
}
