import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre completo."),
  email: z.string().trim().email("Ingresa un correo válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
  phone: z.string().trim().optional(),
  interest: z.string().trim().optional(),
  role: z.enum(["student", "teacher", "coordinator", "company"], {
    message: "Selecciona un tipo de perfil.",
  }),
  details: z.record(z.string(), z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export const createUserSchema = registerSchema;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre completo."),
  phone: z.string().trim().optional(),
  interest: z.string().trim().optional(),
  details: z.record(z.string(), z.string()).optional(),
});
