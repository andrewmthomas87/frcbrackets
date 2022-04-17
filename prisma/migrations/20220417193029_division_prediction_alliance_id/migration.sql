/*
  Warnings:

  - The primary key for the `DivisionPredictionAlliance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DivisionPredictionAlliance` table. All the data in the column will be lost.
  - Added the required column `number` to the `DivisionPredictionAlliance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DivisionPredictionAlliance" DROP CONSTRAINT "DivisionPredictionAlliance_pkey",
DROP COLUMN "id",
ADD COLUMN     "number" INTEGER NOT NULL,
ADD CONSTRAINT "DivisionPredictionAlliance_pkey" PRIMARY KEY ("divisionPredictionUserID", "divisionPredictionDivisionKey", "number");
