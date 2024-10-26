import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Card } from "@/components/ui/card";
  import type { Question, QuizState } from "@/app/utils/types";
  
  interface QuizResultsProps {
    results: QuizState;
    questions: Question[];
  }
  
  export function QuizResults({ results, questions }: QuizResultsProps) {
    return (
      <Card className="p-6 w-full lg:w-[1000px] lg:p-8">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-xl mb-6">
          Final Score: {results.score} out of {questions.length}
        </p>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Your Answer</TableHead>
              <TableHead>Correct Answer</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.answers.map((answer) => {
              const question = questions.find(q => q.id === answer.questionId)!;
              return (
                <TableRow key={answer.questionId}>
                  <TableCell className="font-medium">{question.questionText}</TableCell>
                  <TableCell>{question.options[answer.userAnswer]}</TableCell>
                  <TableCell>{question.options[question.correctAnswer]}</TableCell>
                  <TableCell>
                    <span className={answer.correct ? "text-green-600" : "text-red-600"}>
                      {answer.correct ? "Correct" : "Incorrect"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    );
  }