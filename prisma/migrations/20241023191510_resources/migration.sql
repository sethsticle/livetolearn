/*
  Warnings:

  - Added the required column `type` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Resource` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('TEXTBOOK', 'TUTORIAL_LETTER', 'ADDITIONAL_RESOURCE', 'YOUTUBE_LINK');

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_userId_fkey";

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "downVotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" "ResourceType" NOT NULL,
ADD COLUMN     "upVotes" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
