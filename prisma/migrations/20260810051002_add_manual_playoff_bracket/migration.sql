-- CreateTable
CREATE TABLE "playoff_brackets" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL DEFAULT 'Playoffs',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playoff_brackets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playoff_bracket_slots" (
    "id" TEXT NOT NULL,
    "bracketId" TEXT NOT NULL,
    "matchId" TEXT,
    "teamARegistrationId" TEXT,
    "teamBRegistrationId" TEXT,
    "slotKey" VARCHAR(50) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "bracketSide" VARCHAR(20) NOT NULL,
    "roundOrder" INTEGER NOT NULL,
    "slotOrder" INTEGER NOT NULL,
    "positionX" DOUBLE PRECISION,
    "positionY" DOUBLE PRECISION,

    CONSTRAINT "playoff_bracket_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "playoff_brackets_tournamentId_key" ON "playoff_brackets"("tournamentId");

-- CreateIndex
CREATE INDEX "playoff_bracket_slots_bracketId_idx" ON "playoff_bracket_slots"("bracketId");

-- CreateIndex
CREATE INDEX "playoff_bracket_slots_matchId_idx" ON "playoff_bracket_slots"("matchId");

-- CreateIndex
CREATE INDEX "playoff_bracket_slots_teamARegistrationId_idx" ON "playoff_bracket_slots"("teamARegistrationId");

-- CreateIndex
CREATE INDEX "playoff_bracket_slots_teamBRegistrationId_idx" ON "playoff_bracket_slots"("teamBRegistrationId");

-- CreateIndex
CREATE UNIQUE INDEX "playoff_bracket_slots_bracketId_slotKey_key" ON "playoff_bracket_slots"("bracketId", "slotKey");

-- AddForeignKey
ALTER TABLE "playoff_brackets" ADD CONSTRAINT "playoff_brackets_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_bracket_slots" ADD CONSTRAINT "playoff_bracket_slots_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "playoff_brackets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_bracket_slots" ADD CONSTRAINT "playoff_bracket_slots_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_bracket_slots" ADD CONSTRAINT "playoff_bracket_slots_teamARegistrationId_fkey" FOREIGN KEY ("teamARegistrationId") REFERENCES "tournament_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playoff_bracket_slots" ADD CONSTRAINT "playoff_bracket_slots_teamBRegistrationId_fkey" FOREIGN KEY ("teamBRegistrationId") REFERENCES "tournament_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
