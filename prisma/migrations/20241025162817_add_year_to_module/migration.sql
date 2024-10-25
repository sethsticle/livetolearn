/*
  Warnings:

  - Added the required column `year` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "year" INTEGER DEFAULT 0 NOT NULL;
