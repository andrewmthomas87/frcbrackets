-- CreateTable
CREATE TABLE "EinsteinPrediction" (
    "userID" TEXT NOT NULL,
    "averageRRAllianceHangarPoints" INTEGER NOT NULL,
    "averageFinalsMatchScore" INTEGER NOT NULL,
    "results" TEXT[],
    "firstSeedDivisionKey" TEXT NOT NULL,
    "secondSeedDivisionKey" TEXT NOT NULL,
    "winnerDivisionKey" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EinsteinPrediction_userID_key" ON "EinsteinPrediction"("userID");

-- AddForeignKey
ALTER TABLE "EinsteinPrediction" ADD CONSTRAINT "EinsteinPrediction_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EinsteinPrediction" ADD CONSTRAINT "EinsteinPrediction_firstSeedDivisionKey_fkey" FOREIGN KEY ("firstSeedDivisionKey") REFERENCES "Division"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EinsteinPrediction" ADD CONSTRAINT "EinsteinPrediction_secondSeedDivisionKey_fkey" FOREIGN KEY ("secondSeedDivisionKey") REFERENCES "Division"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EinsteinPrediction" ADD CONSTRAINT "EinsteinPrediction_winnerDivisionKey_fkey" FOREIGN KEY ("winnerDivisionKey") REFERENCES "Division"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
