-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "scheduleDayId" TEXT;

-- CreateTable
CREATE TABLE "tournament_schedule_days" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "scheduledDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_schedule_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tournament_schedule_days_tournamentId_idx" ON "tournament_schedule_days"("tournamentId");

-- CreateIndex
CREATE INDEX "tournament_schedule_days_stageId_idx" ON "tournament_schedule_days"("stageId");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_schedule_days_stageId_dayNumber_key" ON "tournament_schedule_days"("stageId", "dayNumber");

-- CreateIndex
CREATE INDEX "matches_scheduleDayId_idx" ON "matches"("scheduleDayId");

-- AddForeignKey
ALTER TABLE "tournament_schedule_days" ADD CONSTRAINT "tournament_schedule_days_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_schedule_days" ADD CONSTRAINT "tournament_schedule_days_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "tournament_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_scheduleDayId_fkey" FOREIGN KEY ("scheduleDayId") REFERENCES "tournament_schedule_days"("id") ON DELETE SET NULL ON UPDATE CASCADE;
