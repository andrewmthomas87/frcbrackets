-- CreateTable
CREATE TABLE "DivisionPredictionAlliance" (
    "id" TEXT NOT NULL,
    "captainTeamKey" TEXT NOT NULL,
    "firstPickTeamKey" TEXT NOT NULL,
    "divisionPredictionUserID" TEXT NOT NULL,
    "divisionPredictionDivisionKey" TEXT NOT NULL,

    CONSTRAINT "DivisionPredictionAlliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DivisionPrediction" (
    "userID" TEXT NOT NULL,
    "divisionKey" TEXT NOT NULL,
    "averageQualificationMatchScore" INTEGER NOT NULL,
    "averagePlayoffMatchScore" INTEGER NOT NULL,
    "results" INTEGER[],

    CONSTRAINT "DivisionPrediction_pkey" PRIMARY KEY ("userID","divisionKey")
);

-- AddForeignKey
ALTER TABLE "DivisionPredictionAlliance" ADD CONSTRAINT "DivisionPredictionAlliance_captainTeamKey_fkey" FOREIGN KEY ("captainTeamKey") REFERENCES "Team"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionPredictionAlliance" ADD CONSTRAINT "DivisionPredictionAlliance_firstPickTeamKey_fkey" FOREIGN KEY ("firstPickTeamKey") REFERENCES "Team"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionPredictionAlliance" ADD CONSTRAINT "DivisionPredictionAlliance_divisionPredictionUserID_divisi_fkey" FOREIGN KEY ("divisionPredictionUserID", "divisionPredictionDivisionKey") REFERENCES "DivisionPrediction"("userID", "divisionKey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionPrediction" ADD CONSTRAINT "DivisionPrediction_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionPrediction" ADD CONSTRAINT "DivisionPrediction_divisionKey_fkey" FOREIGN KEY ("divisionKey") REFERENCES "Division"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
