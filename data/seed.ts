import "dotenv/config";
import { prisma } from "~/db.server";
import { TBA } from "./api";

async function seedTeams() {
  let teams: TBA.Team[] = [];
  for (let pageNum = 0; ; pageNum++) {
    const pageTeams = await TBA.teams(pageNum);
    if (pageTeams.length === 0) {
      break;
    }

    teams = teams.concat(
      pageTeams.filter(
        (team) =>
          !(
            team.city === null ||
            team.state_prov === null ||
            team.country === null ||
            team.rookie_year === null
          )
      )
    );
  }

  console.log("Fetched teams...");

  console.log("Inserted batch");

  let i = 0;
  while (teams.length > 0) {
    console.log(++i);

    const batch = teams.slice(0, 10);
    await Promise.all(
      batch.map(
        ({
          key,
          city,
          country,
          name,
          nickname,
          rookie_year: rookieYear,
          state_prov: stateProv,
          team_number: teamNumber,
          website,
        }) =>
          prisma.team.upsert({
            where: { key },
            update: {
              city,
              country,
              name: nickname || name,
              rookieYear,
              stateProv,
              website,
            },
            create: {
              city,
              country,
              key,
              name: nickname || name,
              rookieYear,
              stateProv,
              teamNumber,
              website,
            },
            select: { key: true },
          })
      )
    );
    teams = teams.slice(10);
  }

  console.log(`Database has been seeded with teams. 🌱`);
}

async function seedDivisions() {
  const events = await TBA.eventsSimple(parseInt(process.env.TBA_YEAR!));
  const divisions = events.filter((event) => event.event_type === 3);

  console.log("Fetched divisions...");

  await prisma.$transaction(
    divisions.map((division) =>
      prisma.division.create({
        data: {
          key: division.key,
          name: division.name,
          eventCode: division.event_code,
          startDate: division.start_date,
          endDate: division.end_date,
          year: division.year,
        },
      })
    )
  );

  console.log(`Database has been seeded with divisions. 🌱`);
}

async function seedDivisionTeams() {
  const divisions = await prisma.division.findMany();
  const teamKeys = await Promise.all(
    divisions.map((division) => TBA.eventTeamKeys(division.key))
  );

  console.log("Fetched division teams...");

  await prisma.$transaction(
    divisions.flatMap((division, i) =>
      teamKeys[i].map((teamKey) =>
        prisma.team.update({
          where: {
            key: teamKey,
          },
          data: {
            division: {
              connect: {
                key: division.key,
              },
            },
          },
        })
      )
    )
  );

  console.log(`Database has been seeded with division teams. 🌱`);
}

async function main() {
  try {
    switch (process.argv[2]) {
      case "all":
        await seedTeams();
        await seedDivisions();
        await seedDivisionTeams();
        break;
      case "teams":
        await seedTeams();
        break;
      case "divisions":
        await seedDivisions();
        break;
      case "division-teams":
        await seedDivisionTeams();
        break;
      default:
        console.log(
          "Usage: npm run data:seed -- [all | teams | divisions | division-teams]"
        );
        break;
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
