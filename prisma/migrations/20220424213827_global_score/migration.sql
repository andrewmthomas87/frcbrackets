-- CreateTable
CREATE TABLE "GlobalScore" (
    "userID" TEXT NOT NULL,
    "carvScore" INTEGER NOT NULL,
    "galScore" INTEGER NOT NULL,
    "hopScore" INTEGER NOT NULL,
    "newScore" INTEGER NOT NULL,
    "roeScore" INTEGER NOT NULL,
    "turScore" INTEGER NOT NULL,
    "einsteinScore" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalScore_userID_key" ON "GlobalScore"("userID");

-- AddForeignKey
ALTER TABLE "GlobalScore" ADD CONSTRAINT "GlobalScore_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
