-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_moduleSlug_fkey";

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_moduleSlug_fkey" FOREIGN KEY ("moduleSlug") REFERENCES "Module"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
