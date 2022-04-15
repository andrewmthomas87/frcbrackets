-- CreateTable
CREATE TABLE "Team" (
    "key" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "stateProv" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "website" TEXT,
    "rookieYear" INTEGER NOT NULL,
    "divisionKey" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Division" (
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventCode" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamNumber_key" ON "Team"("teamNumber");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_divisionKey_fkey" FOREIGN KEY ("divisionKey") REFERENCES "Division"("key") ON DELETE SET NULL ON UPDATE CASCADE;
