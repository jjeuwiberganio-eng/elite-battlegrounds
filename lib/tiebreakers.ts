import { prisma } from "@/lib/prisma";
import { TIEBREAKER_ROUND_NAME } from "@/lib/tiebreaker-constants";

export interface TiebreakerRecord {
  wins: number;
  losses: number;
}

/*
 * How many completed tiebreaker matches each registration has won and
 * lost. Used to rank tied teams and to show the Tiebreaker Win / Loss
 * tags on the standings.
 */
export async function getTiebreakerRecords(
  tournamentId: string,
): Promise<Map<string, TiebreakerRecord>> {
  const matches = await prisma.match.findMany({
    where: {
      roundName: TIEBREAKER_ROUND_NAME,
      status: "COMPLETED",
      tournamentStage: {
        tournamentId,
      },
    },
    select: {
      participants: {
        select: {
          tournamentRegistrationId: true,
          isWinner: true,
        },
      },
    },
  });

  const records = new Map<string, TiebreakerRecord>();

  for (const match of matches) {
    for (const participant of match.participants) {
      const record = records.get(
        participant.tournamentRegistrationId,
      ) ?? { wins: 0, losses: 0 };

      if (participant.isWinner) {
        record.wins += 1;
      } else {
        record.losses += 1;
      }

      records.set(participant.tournamentRegistrationId, record);
    }
  }

  return records;
}
