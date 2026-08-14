-- AlterTable
ALTER TABLE "playoff_bracket_slots" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scoreA" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "scoreB" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winnerRegistrationId" TEXT;

-- CreateIndex
CREATE INDEX "playoff_bracket_slots_winnerRegistrationId_idx" ON "playoff_bracket_slots"("winnerRegistrationId");

-- AddForeignKey
ALTER TABLE "playoff_bracket_slots" ADD CONSTRAINT "playoff_bracket_slots_winnerRegistrationId_fkey" FOREIGN KEY ("winnerRegistrationId") REFERENCES "tournament_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
