-- CreateTable
CREATE TABLE "DivisionPredictionScore" (
    "divisionPredictionUserID" TEXT NOT NULL,
    "divisionPredictionDivisionKey" TEXT NOT NULL,
    "sum" INTEGER NOT NULL,
    "averageQualificationMatchScore" INTEGER NOT NULL,
    "averagePlayoffMatchScore" INTEGER NOT NULL,
    "alliances" INTEGER NOT NULL,
    "bracket" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DivisionPredictionScore_divisionPredictionUserID_divisionPr_key" ON "DivisionPredictionScore"("divisionPredictionUserID", "divisionPredictionDivisionKey");

-- AddForeignKey
ALTER TABLE "DivisionPredictionScore" ADD CONSTRAINT "DivisionPredictionScore_divisionPredictionUserID_divisionP_fkey" FOREIGN KEY ("divisionPredictionUserID", "divisionPredictionDivisionKey") REFERENCES "DivisionPrediction"("userID", "divisionKey") ON DELETE RESTRICT ON UPDATE CASCADE;
