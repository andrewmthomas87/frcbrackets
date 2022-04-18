import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

type Row = {
  teamNumber: number;
  nickname: string;
  country: string;
  stateProvince: string;
  city: string;
  district: string;
  seedOrigin: string;
  qualificationMatchesPlayed: number;
  qualWins: number;
  qualLosses: number;
  qualTies: number;
  cargoBonusRPs: number;
  hangarBonusRPs: number;
  totalMatchesPlayed: number;
  dQMatches: number;
  surrogateMatches: number;
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  winningMarginElo: number;
  totalPoints: number;
  unpenalizedTotalPoints: number;
  winningMargin: number;
  win: number;
  rankingPoints: number;
  autoPoints: number;
  teleopExcludingEndgamePoints: number;
  endgamePoints: number;
  totalScoredCargo: number;
  cargoBonusRPILS: number;
  hangarBonusRPILS: number;
  autoTaxiPoints: number;
  autoTaxiRate: number;
  autoCargoPoints: number;
  autoCargoLower: number;
  autoCargoUpper: number;
  autoCargoTotal: number;
  quintetAchieved: number;
  quintetAchievedRate: number;
  teleopCargoPoints: number;
  teleopCargoLower: number;
  teleopCargoUpper: number;
  teleopCargoTotal: number;
  endgameLowPoints: number;
  atLeastLowEndgameRate: number;
  endgameMidPoints: number;
  atLeastMidEndgameRate: number;
  endgameHighPoints: number;
  atLeastEndgameHighRate: number;
  endgameTraversalPoints: number;
  endgameTraversalRate: number;
  cargoBonus: number;
  cargoBonusCompletionPercentage: number;
  cargoBonusContributingCargo: number;
  hangarBonus: number;
  hangarBonusCompletionPercentage: number;
  foulCount: number;
  techFoulCount: number;
  foulPoints: number;
  foulsDrawn: number;
  techFoulsDrawn: number;
  foulPointsDrawn: number;
};

function parseRow(record: any): Row {
  return {
    teamNumber: parseFloat(record["team Number"]),
    nickname: record["Nickname"],
    country: record["Country"],
    stateProvince: record["State/Province"],
    city: record["City"],
    district: record["District"],
    seedOrigin: record["seed Origin"],
    qualificationMatchesPlayed: parseFloat(
      record["qualification Matches Played"]
    ),
    qualWins: parseFloat(record["qual Wins"]),
    qualLosses: parseFloat(record["qual Losses"]),
    qualTies: parseFloat(record["qual Ties"]),
    cargoBonusRPs: parseFloat(record["cargo Bonus RPs"]),
    hangarBonusRPs: parseFloat(record["hangar Bonus RPs"]),
    totalMatchesPlayed: parseFloat(record["total Matches Played"]),
    dQMatches: parseFloat(record["DQ matches"]),
    surrogateMatches: parseFloat(record["surrogate Matches"]),
    totalWins: parseFloat(record["total Wins"]),
    totalLosses: parseFloat(record["total Losses"]),
    totalTies: parseFloat(record["total Ties"]),
    winningMarginElo: parseFloat(record["winning Margin Elo"]),
    totalPoints: parseFloat(record["total Points"]),
    unpenalizedTotalPoints: parseFloat(record["unpenalized Total Points"]),
    winningMargin: parseFloat(record["winning Margin"]),
    win: parseFloat(record["win"]),
    rankingPoints: parseFloat(record["ranking Points"]),
    autoPoints: parseFloat(record["auto Points"]),
    teleopExcludingEndgamePoints: parseFloat(
      record["teleop Excluding Endgame Points"]
    ),
    endgamePoints: parseFloat(record["endgame Points"]),
    totalScoredCargo: parseFloat(record["total Scored Cargo"]),
    cargoBonusRPILS: parseFloat(record["cargo Bonus RP ILS"]),
    hangarBonusRPILS: parseFloat(record["hangar Bonus RP ILS"]),
    autoTaxiPoints: parseFloat(record["auto Taxi Points"]),
    autoTaxiRate: parseFloat(record["auto Taxi Rate"]),
    autoCargoPoints: parseFloat(record["auto Cargo Points"]),
    autoCargoLower: parseFloat(record["auto Cargo Lower"]),
    autoCargoUpper: parseFloat(record["auto Cargo Upper"]),
    autoCargoTotal: parseFloat(record["auto Cargo Total"]),
    quintetAchieved: parseFloat(record["quintet Achieved"]),
    quintetAchievedRate: parseFloat(record["quintet Achieved Rate"]),
    teleopCargoPoints: parseFloat(record["teleop Cargo Points"]),
    teleopCargoLower: parseFloat(record["teleop Cargo Lower"]),
    teleopCargoUpper: parseFloat(record["teleop Cargo Upper"]),
    teleopCargoTotal: parseFloat(record["teleop Cargo Total"]),
    endgameLowPoints: parseFloat(record["endgame Low Points"]),
    atLeastLowEndgameRate: parseFloat(record["at Least Low Endgame Rate"]),
    endgameMidPoints: parseFloat(record["endgame Mid Points"]),
    atLeastMidEndgameRate: parseFloat(record["at Least Mid Endgame Rate"]),
    endgameHighPoints: parseFloat(record["endgame High Points"]),
    atLeastEndgameHighRate: parseFloat(record["at Least Endgame High Rate"]),
    endgameTraversalPoints: parseFloat(record["endgame Traversal Points"]),
    endgameTraversalRate: parseFloat(record["endgame Traversal Rate"]),
    cargoBonus: parseFloat(record["cargo Bonus"]),
    cargoBonusCompletionPercentage: parseFloat(
      record["cargo Bonus Completion Percentage"]
    ),
    cargoBonusContributingCargo: parseFloat(
      record["cargo Bonus Contributing Cargo"]
    ),
    hangarBonus: parseFloat(record["hangar Bonus"]),
    hangarBonusCompletionPercentage: parseFloat(
      record["hangar Bonus Completion Percentage"]
    ),
    foulCount: parseFloat(record["foul Count"]),
    techFoulCount: parseFloat(record["tech Foul Count"]),
    foulPoints: parseFloat(record["foul Points"]),
    foulsDrawn: parseFloat(record["fouls Drawn"]),
    techFoulsDrawn: parseFloat(record["tech Fouls Drawn"]),
    foulPointsDrawn: parseFloat(record["foul Points Drawn"]),
  };
}

async function main() {
  try {
    const path = process.argv[2];
    if (typeof path !== "string") {
      console.log("Usage: npm run data:import -- [path]");
      return;
    }

    const data = await readFile(path);
    const parser = parse(data, {
      bom: true,
      columns: true,
      trim: true,
    });

    let rows: Row[] = [];
    for await (const record of parser) {
      rows.push(parseRow(record));
    }

    console.log("Parsed data...");

    console.log("Inserted batch");

    let i = 0;
    while (rows.length > 0) {
      console.log(++i);

      const batch = rows.slice(0, 10);
      await Promise.all(
        batch.map((row) =>
          prisma.teamStats.create({
            data: {
              ...row,
              teamNumber: undefined,
              team: {
                connect: {
                  teamNumber: row.teamNumber,
                },
              },
            },
          })
        )
      );

      rows = rows.slice(10);
    }

    console.log(`Team stats have been imported into the database. 🌱`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
