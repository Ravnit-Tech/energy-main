declare module "nigeria-state-lga-data" {
  export function getStates(): string[];
  export function getStatesAndCapitals(): { state: string; capital: string }[];
  export function getLgas(state: string): string[];
}
