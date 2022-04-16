import { Link } from "@mui/material";
import type { ReactNode } from "react";

export const metrics: Record<
  string,
  { description: ReactNode; includes: string }
> = {
  winningMarginElo: {
    description: (
      <>
        The given team's winning margin Elo rating at the end of the event. My
        metric of choice for a general estimate of a team's performance. Elo
        includes both Quals and Playoffs, but weights Playoffs less heavily. For
        more info on Elo, look at my Elo book here:{" "}
        <Link href="https://github.com/inkling16/FRCElo">
          https://github.com/inkling16/FRCElo
        </Link>
      </>
    ),
    includes: "Quals & playoffs",
  },
  totalPoints: {
    description:
      "The total points the given team contributes. Equivalent to OPR. For a general strength metric, I find this value to have around the same amount of predictive power as Elo.",
    includes: "Quals",
  },
  unpenalizedTotalPoints: {
    description:
      "The unpenalized total points the given team contributes. Equivalent to unpenalized OPR. In some years, unpenalized total points is a better predictor of success than raw total points, and sometimes it is not.",
    includes: "Quals",
  },
  winningMargin: {
    description:
      "The given team's contribution to the match winning margin. Equivalent to CCWM. Note that for general strength metrics I believe CCWM to be inferior to calculated contribution to total points (OPR) and Elo.",
    includes: "Quals",
  },
  win: {
    description:
      "The given team's contribution to match wins. This is much worse as a general strength metric than any of the above values. Can be used as a very crude approximation for schedule strength.",
    includes: "Quals",
  },
  rankingPoints: {
    description:
      "The given team's contribution to total ranking points (WLT + bonus RPs).",
    includes: "Quals",
  },
  autoPoints: {
    description: "The given team's contribution to total auto points.",
    includes: "Quals",
  },
  teleopExcludingEndgamePoints: {
    description:
      "The given team's contribution to total teleop points minus the team's contribution to endgame points. Subtracting endgame points is necessary since endgame points do technically fall under the category of teleop points.",
    includes: "Quals",
  },
  endgamePoints: {
    description: "The given team's contribution to endgame points.",
    includes: "Quals",
  },
  totalScoredCargo: {
    description:
      "The given team's contribution to the total count of cargo scored at any time in the match in the upper or lower hubs.",
    includes: "Quals",
  },
  cargoBonusRPILS: {
    description: (
      <>
        The cargo bonus ranking point iterative logistic strength. This is a
        value calculated similarly to Elo. The units are related to
        probabilities, a 0.5 ILS very roughly means the team is expected to get
        the RP 50% of the time with neutral (0.0 ILS) partners. 3 robots that
        all have an ILS of 0.0 will get the RP about 11% of the time. See here
        for more information on ILSs:{" "}
        <Link href="https://blog.thebluealliance.com/2019/08/04/making-better-rp-predictions/">
          https://blog.thebluealliance.com/2019/08/04/making-better-rp-predictions/
        </Link>
      </>
    ),
    includes: "Quals",
  },
  hangarBonusRPILS: {
    description: (
      <>
        The hangar bonus ranking point iterative logistic strength. This is a
        value calculated similarly to Elo. The units are related to
        probabilities, a 0.5 ILS very roughly means the team is expected to get
        the RP 50% of the time with neutral (0.0 ILS) partners. 3 robots that
        all have an ILS of 0.0 will get the RP about 11% of the time. See here
        for more information on ILSs:{" "}
        <Link href="https://blog.thebluealliance.com/2019/08/04/making-better-rp-predictions/">
          https://blog.thebluealliance.com/2019/08/04/making-better-rp-predictions
        </Link>
        /
      </>
    ),
    includes: "Quals",
  },
  autoTaxiPoints: {
    description:
      "The given team's contribution to the total autonomous taxi points.",
    includes: "Quals",
  },
  autoTaxiRate: {
    description:
      "The frequency at which the given team achieves the taxi points in auto. Teams that are no-shows will have 0 entered for that match.",
    includes: "Quals & playoffs",
  },
  autoCargoPoints: {
    description:
      "The given team's contribution to the total cargo points scored in both hubs in autonomous.",
    includes: "Quals",
  },
  autoCargoLower: {
    description:
      "The given team's contribution to the count of cargo scored in the lower hub in autonomous.",
    includes: "Quals",
  },
  autoCargoUpper: {
    description:
      "The given team's contribution to the count of cargo scored in the upper hub in autonomous.",
    includes: "Quals",
  },
  autoCargoTotal: {
    description:
      "The given team's contribution to the count of cargo scored in both hubs in autonomous.",
    includes: "Quals",
  },
  quintetAchieved: {
    description:
      "The given team's contribution to the quintet achieved status.",
    includes: "Quals",
  },
  quintetAchievedRate: {
    description:
      "The frequency at which the given team achieves the quintet. Teams that are no-shows will have 0 entered for that match.",
    includes: "Quals",
  },
  teleopCargoPoints: {
    description:
      "The given team's contribution to the total cargo points scored in both hubs in teleop.",
    includes: "Quals",
  },
  teleopCargoLower: {
    description:
      "The given team's contribution to the count of cargo scored in the lower hub in teleop.",
    includes: "Quals",
  },
  teleopCargoUpper: {
    description:
      "The given team's contribution to the count of cargo scored in the upper hub in teleop.",
    includes: "Quals",
  },
  teleopCargoTotal: {
    description:
      "The given team's contribution to the count of cargo scored in both hubs in teleop.",
    includes: "Quals",
  },
  endgameLowPoints: {
    description:
      "The given team's contribution to the low rung points in the endgame.",
    includes: "Quals",
  },
  atLeastLowEndgameRate: {
    description:
      "The frequency at which the given team achieves a hang up to at least the low rung. Teams that are no-shows will have 0 entered for that match.",
    includes: "Quals & playoffs",
  },
  endgameMidPoints: {
    description:
      "The given team's contribution to the mid rung points in the endgame.",
    includes: "Quals",
  },
  atLeastMidEndgameRate: {
    description:
      "The frequency at which the given team achieves a hang up to at least the mid rung. Teams that are no-shows will have 0 entered for that match.",
    includes: "Quals & playoffs",
  },
  endgameHighPoints: {
    description:
      "The given team's contribution to the high rung points in the endgame.",
    includes: "Quals",
  },
  atLeastHighEndgameRate: {
    description:
      "The frequency at which the given team achieves a hang up to at least the high rung. Teams that are no-shows will have 0 entered for that match.",
    includes: "Quals & playoffs",
  },
  endgameTraversalPoints: {
    description:
      "The given team's contribution to the traversal rung points in the endgame.",
    includes: "Quals",
  },
  endgameTraversalRate: {
    description:
      "The frequency at which the given team achieves a hang on the traversal rung. Teams that are no-shows will have 0 entered for that match.",
    includes: "Quals & playoffs",
  },
  cargoBonus: {
    description:
      "The given team's contribution to the cargo bonus ranking point.",
    includes: "Quals",
  },
  cargoBonusCompletionPercentage: {
    description:
      "The given team's contribution to the cargo bonus ranking point completion percentage. The cargo bonus ranking point completion percentage is defined as 1 if the ranking point is achieved. Otherwise it will be the total cargo scored plus an additional 2 if the team achieved a quintet, all divided by 20.",
    includes: "Quals",
  },
  cargoBonusContributingCargo: {
    description:
      "The given team's contribution to cargo which contributed to the cargo bonus. Cargo that contribute to the cargo bonus are defined as any cargo scored before the 20 (if no quintet is achieved) or 18 (if the quintet is achieved).",
    includes: "Quals",
  },
  hangarBonus: {
    description:
      "The given team's contribution to the hangar bonus ranking point.",
    includes: "Quals",
  },
  hangarBonusCompletionPercentage: {
    description:
      "The given team's contribution to the hangar bonus ranking point completion percentage. The hangar bonus ranking point completion percentage is defined as 1 if the ranking point is achieved. Otherwise it will be the total endgame points divided by 16.",
    includes: "Quals",
  },
  foulCount: {
    description:
      "The given team's contribution to fouls the team's own alliance committed.",
    includes: "Quals",
  },
  techFoulCount: {
    description:
      "The given team's contribution to tech fouls the team's own alliance committed.",
    includes: "Quals",
  },
  foulPoints: {
    description:
      "The given team's contribution to foul points awarded to the opposing alliance.",
    includes: "Quals",
  },
  foulsDrawn: {
    description:
      "The given team's contribution to fouls drawn, that is, fouls the opposing alliance committed.",
    includes: "Quals",
  },
  techFoulsDrawn: {
    description:
      "The given team's contribution to tech fouls drawn, that is, tech fouls the opposing alliance committed.",
    includes: "Quals",
  },
  foulPointsDrawn: {
    description:
      "The given team's contribution to total foul points drawn, that is, foul points awarded to the team's own alliance.",
    includes: "Quals",
  },
};
