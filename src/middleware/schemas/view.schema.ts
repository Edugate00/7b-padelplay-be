import { z } from "zod";

export const viewScoreboardSchema = z.object({
  matchId: z.string().min(1, "matchId is required"),
});

export const viewTournamentSchema = z.object({
  tournamentId: z.string().min(1, "matchId is required"),
});

export const viewCourtMatchSchema = z.object({
  distChan: z.string().min(1, "distChan is required"),
});

export const viewPlayerSchema = z.object({
  email: z.string().min(1, "email is required"),
});

export const viewLatestMatchIdSchema = z.object({
  startTime: z.string().min(1, "startTime is required"),
  endTime: z.string().min(1, "endTime is required")
});

export const viewLeaderboardSchema = z.object({
  // Define schema for leaderboard if needed
  distChan: z.string().min(1, "distChan is required")
});

export const viewAdvertisementSchema = z.object({
  // Define schema for leaderboard if needed
  distChan: z.string().min(1, "distChan is required"),
  court: z.string().min(1, "court is required"),
});

export const viewControllerTokenSchema = z.object({
  matchId: z.string().min(1, "matchId is required")
})
