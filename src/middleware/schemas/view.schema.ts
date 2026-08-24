import { z } from "zod";


export const viewAdvertisementSchema = z.object({
  // Define schema for leaderboard if needed
  distChan: z.string().min(1, "distChan is required"),
  court: z.string().min(1, "court is required"),
});

export const viewControllerTokenSchema = z.object({
  matchId: z.string().min(1, "matchId is required")
})
