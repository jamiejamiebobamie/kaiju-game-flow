// TESTING import/export for ".ts" file...

// 1. A TypeScript-exclusive feature: An Enum
export enum GameDifficulty {
  Easy = "EASY",
  Normal = "NORMAL",
  KaijuMode = "KAIJU_MODE"
}

// 2. A TypeScript Type Definition
export type WeatherCondition = "晴れ" | "Rainy" | "AcidStorm";

// 3. A TypeScript Interface to enforce your data structure
export interface KaijuState {
  id: string;
  name: string;
  health: number;
  isEnraged: boolean;
  difficultySetting: GameDifficulty; // Using the enum above
  currentWeather: WeatherCondition;  // Using the type above
}

// 4. Test Data applying the interface
export const initialBossState: KaijuState = {
  id: "kj-09",
  name: "Gojira",
  health: 5000,
  isEnraged: false,
  difficultySetting: GameDifficulty.KaijuMode,
  currentWeather: "AcidStorm"
};

// 5. A TypeScript Typed Function to test compilation of explicit arguments
export function damageKaiju(state: KaijuState, damageAmount: number): KaijuState {
  return {
    ...state,
    health: Math.max(0, state.health - damageAmount),
    isEnraged: state.health - damageAmount < 1500
  };
}
