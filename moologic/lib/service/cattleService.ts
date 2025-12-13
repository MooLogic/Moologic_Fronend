// This file existed alongside `cattleService.tsx` and was being
// resolved first by TypeScript. Keep it as a thin forwarder so all
// imports point at the fully featured implementation.
export * from "./cattleService.tsx"