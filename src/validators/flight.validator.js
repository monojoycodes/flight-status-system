import { z } from "zod";

export const flightSchema = z.object({
  flightNumber: z.string()
    .min(5).max(10)
    .regex(/^[A-Z]{2}\d{3,4}$/, "Flight number must be 2 letters + 3-4 digits (e.g., AI202)"),
  destination: z.string()
    .length(3)
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "Destination must be 3-letter IATA code (e.g., DEL, BOM)"),
  departureTime: z.string().datetime(),
  gate: z.number().int().min(1).max(200).optional()
});

export const updateFlightSchema = z.object({
  destination: z.string()
    .length(3)
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "Destination must be 3-letter IATA code")
    .optional(),
  departureTime: z.string().datetime().optional(),
  actualTime: z.string().datetime().nullable().optional(),
  status: z.enum(["scheduled", "boarding", "check-in", "delayed", "cancelled", "security"]).optional(),
  gate: z.number().int().min(1).max(200).optional()
});


export const flightQuerySchema = z.object({
  airline: z.string().max(3).toUpperCase().optional(),
  status: z.enum(["scheduled", "boarding", "check-in", "delayed", "cancelled", "security"]).optional(),
  destination: z.string().max(3).toUpperCase().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1 && n <= 100, "Limit must be between 1 and 100").optional(),
  page: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1, "Page must be at least 1").optional()
});
