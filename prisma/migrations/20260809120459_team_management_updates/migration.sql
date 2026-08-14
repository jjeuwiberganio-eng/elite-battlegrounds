/*
  Warnings:

  - You are about to drop the column `realName` on the `players` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "players" DROP COLUMN "realName";

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "posterMediaId" TEXT;

-- AlterTable
ALTER TABLE "tournament_registrations" ADD COLUMN     "tournamentGroupId" TEXT;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_posterMediaId_fkey" FOREIGN KEY ("posterMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_tournamentGroupId_fkey" FOREIGN KEY ("tournamentGroupId") REFERENCES "tournament_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
