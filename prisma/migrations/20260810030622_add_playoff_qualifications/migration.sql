-- CreateTable
CREATE TABLE "playoff_qualifications" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "tournamentRegistrationId" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playoff_qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "playoff_qualifications_tournamentRegistrationId_key" ON "playoff_qualifications"("tournamentRegistrationId");

-- CreateIndex
CREATE INDEX "playoff_qualifications_tournamentId_idx" ON "playoff_qualifications"("tournamentId");

-- CreateIndex
CREATE INDEX "playoff_qualifications_tournamentRegistrationId_idx" ON "playoff_qualifications"("tournamentRegistrationId");

-- CreateIndex
CREATE INDEX "playoff_qualifications_seed_idx" ON "playoff_qualifications"("seed");

-- CreateIndex
CREATE UNIQUE INDEX "playoff_qualifications_tournamentId_seed_key" ON "playoff_qualifications"("tournamentId", "seed");

-- AddForeignKey
ALTER TABLE "playoff_qualifications" ADD CONSTRAINT "playoff_qualifications_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_qualifications" ADD CONSTRAINT "playoff_qualifications_tournamentRegistrationId_fkey" FOREIGN KEY ("tournamentRegistrationId") REFERENCES "tournament_registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
