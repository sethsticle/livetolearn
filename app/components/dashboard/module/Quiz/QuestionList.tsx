//app/components/dashboard/module/Quiz/QuestionList.tsx
"use client"
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Question } from "@/app/utils/types";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface QuestionListProps {
  questions: Question[];
  onDelete: (id: string) => void;
}

export function QuestionList({ questions, onDelete }: QuestionListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setQuestionToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      onDelete(questionToDelete);
      setQuestionToDelete(null);
    }
    setIsDialogOpen(false);
  };

  const cancelDelete = () => {
    setQuestionToDelete(null);
    setIsDialogOpen(false);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No questions added yet. Create your first question in the &quot;Create Question&quot; tab.
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] border border-red-400">Question</TableHead>
            <TableHead className="w-[200px] border border-red-400">Options</TableHead>
            <TableHead>Correct Answer</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell className="font-medium">{question.questionText}</TableCell>
              <TableCell>
                <ol className="list-decimal list-inside">
                  {question.options.map((option, index) => (
                    <li key={index} className="text-sm">
                      {option}
                    </li>
                  ))}
                </ol>
              </TableCell>
              <TableCell>Option {question.correctAnswer + 1}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(question.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <p>Are you sure you want to delete this question? This action cannot be undone and will affect all students.</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={cancelDelete}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
