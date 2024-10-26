-- DropForeignKey
ALTER TABLE "ResourceVote" DROP CONSTRAINT "ResourceVote_resourceId_fkey";

-- AddForeignKey
ALTER TABLE "ResourceVote" ADD CONSTRAINT "ResourceVote_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
