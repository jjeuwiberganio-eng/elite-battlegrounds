-- CreateEnum
CREATE TYPE "HighlightType" AS ENUM ('POSTER', 'VIDEO');

-- CreateTable
CREATE TABLE "highlights" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "type" "HighlightType" NOT NULL,
    "mediaId" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "highlights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "highlights_type_idx" ON "highlights"("type");

-- CreateIndex
CREATE INDEX "highlights_displayOrder_idx" ON "highlights"("displayOrder");

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
