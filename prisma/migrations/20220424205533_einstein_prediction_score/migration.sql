-- CreateTable
CREATE TABLE "EinsteinPredictionScore" (
    "einsteinPredictionUserID" TEXT NOT NULL,
    "sum" INTEGER NOT NULL,
    "averageRRAllianceHangarPoints" INTEGER NOT NULL,
    "averageFinalsMatchScore" INTEGER NOT NULL,
    "results" INTEGER NOT NULL,
    "firstSeed" INTEGER NOT NULL,
    "secondSeed" INTEGER NOT NULL,
    "winner" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EinsteinPredictionScore_einsteinPredictionUserID_key" ON "EinsteinPredictionScore"("einsteinPredictionUserID");

-- AddForeignKey
ALTER TABLE "EinsteinPredictionScore" ADD CONSTRAINT "EinsteinPredictionScore_einsteinPredictionUserID_fkey" FOREIGN KEY ("einsteinPredictionUserID") REFERENCES "EinsteinPrediction"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
