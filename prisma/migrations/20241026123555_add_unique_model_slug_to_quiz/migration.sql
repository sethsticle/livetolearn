/*
  Warnings:

  - A unique constraint covering the columns `[moduleSlug]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quiz_moduleSlug_key" ON "Quiz"("moduleSlug");
