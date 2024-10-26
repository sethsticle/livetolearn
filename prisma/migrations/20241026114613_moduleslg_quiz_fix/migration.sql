/*
  Warnings:

  - You are about to drop the column `moduleId` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `moduleSlug` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_moduleId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "moduleId",
ADD COLUMN     "moduleSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_moduleSlug_fkey" FOREIGN KEY ("moduleSlug") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
