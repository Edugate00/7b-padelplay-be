import { z } from "zod";

export const createGameSchema = z.object({
  salesDoc: z.string().min(1, "Sales Document is required").trim(),
  orderItem: z.string().min(1, "Order Item is required").trim(),
  courtId: z.string().min(1, "Court ID is required").trim(),
  scoringType: z.string().min(1, "Scoring Type is required").trim(),
  location: z.string().min(1, "Location is required").trim(),
  playerA1: z.string().min(1, "Player A1 is required").trim(),
  playerB1: z.string().min(1, "Player B1 is required").trim(),
  playerA2: z.string().min(1, "Player A2 is required").trim(),
  playerB2: z.string().min(1, "Player B2 is required").trim(),
  servingSide: z.string().min(1, "Serving Side is required").trim(),
  servingPosition: z.string().min(1, "Serving Position is required").trim(),
  totalSets: z
    .number()
    .min(1, "Total Sets must be at least 1")
    .max(5, "Total Sets must be at most 5"),
  teamAName: z.string().min(1, "Team A Name is required").trim(),
  teamBName: z.string().min(1, "Team B Name is required").trim(),
  maxPts: z.number().min(1, "Max points is required"),
  endTime: z.string().min(1, "End Time is required")
});

export const createTournamentSchema = z.object({
  salesDoc: z.string().min(1, "Sales Document is required").trim(),
  orderItem: z.string().min(1, "Order Item is required").trim(),
  courtId: z.string().min(1, "Court ID is required").trim(),
  scoringType: z.string().min(1, "Scoring Type is required").trim(),
  soloPlayers: z.array(z.string().min(1, "Player name is required").trim()).min(1),
  servingSide: z.string().min(1, "Serving Side is required").trim(),
  servingPosition: z.string().min(1, "Serving Position is required").trim(),
  totalSets: z
    .number()
    .min(1, "Total Sets must be at least 1")
    .max(5, "Total Sets must be at most 5"),
  teamAName: z.string().min(1, "Team A Name is required").trim(),
  teamBName: z.string().min(1, "Team B Name is required").trim(),
  maxPts: z.number().min(1, "Max points is required"),
  endTime: z.string().min(1, "End Time is required")
});

export const restartGameSchema = z.object({
  matchId: z.string().min(1, "Match Id is required").trim(),
});

export const changeNamesSchema = z.object({
  matchId: z.string().min(1, "Match ID is required").trim(),
  playerA1: z.string().min(1, "Player A1 is required").trim(),
  playerB1: z.string().min(1, "Player B1 is required").trim(),
  playerA2: z.string().min(1, "Player A2 is required").trim(),
  playerB2: z.string().min(1, "Player B2 is required").trim(),
});

export const updateMatchSchema = z.object({
  matchId: z.string().min(1, "Match ID is required").trim(),
  courtId: z.string().min(1, "Court ID is required").trim(),
  isActive: z.string().min(0, "Is Active is required").trim(),
  location: z.string().min(1, "Location is required").trim(),
  endTime: z.string().optional(),
  bookingId: z.string().optional()
});

const userSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  name: z.string().min(1, "Name is required").trim(),
});

// Schema untuk array of users
export const registerSchema = z.object({
  users: z.array(userSchema).min(1, "At least one user is required"),
});

export const updateAccountSchema = z.object({
  matchId: z.string().min(1, "Match ID is required").trim(),
  team: z.string().min(1, "Team is required").trim(),
  totalMatch: z.number().min(0, "Total match is required"),
  totalWins: z.number().min(-1, "Total wins is required"),
  totalLoss: z.number().min(-1, "Total loss is required"),
  totalPoints: z.number().min(-100, "Total points is required")
});
