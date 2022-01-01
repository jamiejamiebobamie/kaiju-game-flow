import { shootPower, shootKaijuPower, getCharXAndY } from "./utils";
export const PENINSULA_TILE_LOOKUP = {
  "14 26": { i: 14, j: 26 },
  "3 31": { i: 3, j: 31 },
  "3 30": { i: 3, j: 30 },
  "4 30": { i: 4, j: 30 },
  "3 29": { i: 3, j: 29 },
  "3 28": { i: 3, j: 28 },
  "3 32": { i: 3, j: 32 },
  "4 32": { i: 4, j: 32 },
  "5 32": { i: 5, j: 32 },
  "6 32": { i: 6, j: 32 },
  "7 32": { i: 7, j: 32 },
  "8 32": { i: 8, j: 32 },
  "9 32": { i: 9, j: 32 },
  "10 32": { i: 10, j: 32 },
  "11 32": { i: 11, j: 32 },
  "12 32": { i: 12, j: 32 },
  "13 32": { i: 13, j: 32 },
  "14 32": { i: 14, j: 32 },
  "15 32": { i: 15, j: 32 },
  "16 32": { i: 16, j: 32 },
  "17 32": { i: 17, j: 32 },
  "17 31": { i: 17, j: 31 },
  "4 28": { i: 4, j: 28 },
  "4 27": { i: 4, j: 27 },
  "4 26": { i: 4, j: 26 },
  "4 25": { i: 4, j: 25 },
  "4 24": { i: 4, j: 24 },
  "4 23": { i: 4, j: 23 },
  "4 22": { i: 4, j: 22 },
  "5 21": { i: 5, j: 21 },
  "5 20": { i: 5, j: 20 },
  "5 19": { i: 5, j: 19 },
  "6 19": { i: 6, j: 19 },
  "6 18": { i: 6, j: 18 },
  "5 16": { i: 5, j: 16 },
  "6 17": { i: 6, j: 17 },
  "4 16": { i: 4, j: 16 },
  "3 15": { i: 3, j: 15 },
  "3 14": { i: 3, j: 14 },
  "3 13": { i: 3, j: 13 },
  "2 13": { i: 2, j: 13 },
  "2 12": { i: 2, j: 12 },
  "2 11": { i: 2, j: 11 },
  "3 9": { i: 3, j: 9 },
  "3 10": { i: 3, j: 10 },
  "3 8": { i: 3, j: 8 },
  "3 7": { i: 3, j: 7 },
  "4 7": { i: 4, j: 7 },
  "4 6": { i: 4, j: 6 },
  "5 5": { i: 5, j: 5 },
  "6 5": { i: 6, j: 5 },
  "7 4": { i: 7, j: 4 },
  "8 5": { i: 8, j: 5 },
  "9 4": { i: 9, j: 4 },
  "7 3": { i: 7, j: 3 },
  "6 4": { i: 6, j: 4 },
  "6 3": { i: 6, j: 3 },
  "5 2": { i: 5, j: 2 },
  "8 4": { i: 8, j: 4 },
  "5 1": { i: 5, j: 1 },
  "4 1": { i: 4, j: 1 },
  "10 5": { i: 10, j: 5 },
  "11 5": { i: 11, j: 5 },
  "13 5": { i: 13, j: 5 },
  "14 7": { i: 14, j: 7 },
  "15 7": { i: 15, j: 7 },
  "16 8": { i: 16, j: 8 },
  "17 8": { i: 17, j: 8 },
  "18 8": { i: 18, j: 8 },
  "19 7": { i: 19, j: 7 },
  "20 7": { i: 20, j: 7 },
  "21 6": { i: 21, j: 6 },
  "22 6": { i: 22, j: 6 },
  "16 9": { i: 16, j: 9 },
  "15 9": { i: 15, j: 9 },
  "14 10": { i: 14, j: 10 },
  "13 11": { i: 13, j: 11 },
  "14 11": { i: 14, j: 11 },
  "12 13": { i: 12, j: 13 },
  "12 12": { i: 12, j: 12 },
  "12 14": { i: 12, j: 14 },
  "13 14": { i: 13, j: 14 },
  "13 15": { i: 13, j: 15 },
  "12 16": { i: 12, j: 16 },
  "12 17": { i: 12, j: 17 },
  "11 17": { i: 11, j: 17 },
  "10 19": { i: 10, j: 19 },
  "10 21": { i: 10, j: 21 },
  "11 21": { i: 11, j: 21 },
  "11 22": { i: 11, j: 22 },
  "12 23": { i: 12, j: 23 },
  "12 24": { i: 12, j: 24 },
  "12 25": { i: 12, j: 25 },
  "13 24": { i: 13, j: 24 },
  "13 25": { i: 13, j: 25 },
  "13 26": { i: 13, j: 26 },
  "14 27": { i: 14, j: 27 },
  "15 27": { i: 15, j: 27 },
  "15 28": { i: 15, j: 28 },
  "16 29": { i: 16, j: 29 },
  "16 30": { i: 16, j: 30 },
  "17 30": { i: 17, j: 30 },
  "18 31": { i: 18, j: 31 },
  "19 31": { i: 19, j: 31 },
  "20 32": { i: 20, j: 32 },
  "18 32": { i: 18, j: 32 },
  "19 32": { i: 19, j: 32 },
  "21 32": { i: 21, j: 32 },
  "2 32": { i: 2, j: 32 },
  "12 5": { i: 12, j: 5 },
  "13 6": { i: 13, j: 6 },
  "11 4": { i: 11, j: 4 },
  "14 6": { i: 14, j: 6 },
  "4 29": { i: 4, j: 29 },
  "5 29": { i: 5, j: 29 },
  "5 30": { i: 5, j: 30 },
  "4 31": { i: 4, j: 31 },
  "5 31": { i: 5, j: 31 },
  "6 31": { i: 6, j: 31 },
  "7 31": { i: 7, j: 31 },
  "8 31": { i: 8, j: 31 },
  "9 31": { i: 9, j: 31 },
  "10 31": { i: 10, j: 31 },
  "11 31": { i: 11, j: 31 },
  "12 31": { i: 12, j: 31 },
  "13 31": { i: 13, j: 31 },
  "14 31": { i: 14, j: 31 },
  "15 31": { i: 15, j: 31 },
  "16 31": { i: 16, j: 31 },
  "15 30": { i: 15, j: 30 },
  "6 30": { i: 6, j: 30 },
  "7 30": { i: 7, j: 30 },
  "8 30": { i: 8, j: 30 },
  "9 30": { i: 9, j: 30 },
  "10 30": { i: 10, j: 30 },
  "11 30": { i: 11, j: 30 },
  "12 30": { i: 12, j: 30 },
  "13 30": { i: 13, j: 30 },
  "14 30": { i: 14, j: 30 },
  "15 29": { i: 15, j: 29 },
  "5 28": { i: 5, j: 28 },
  "6 29": { i: 6, j: 29 },
  "7 29": { i: 7, j: 29 },
  "8 29": { i: 8, j: 29 },
  "9 29": { i: 9, j: 29 },
  "10 29": { i: 10, j: 29 },
  "11 28": { i: 11, j: 28 },
  "11 29": { i: 11, j: 29 },
  "12 29": { i: 12, j: 29 },
  "13 29": { i: 13, j: 29 },
  "13 28": { i: 13, j: 28 },
  "14 29": { i: 14, j: 29 },
  "14 28": { i: 14, j: 28 },
  "13 27": { i: 13, j: 27 },
  "12 28": { i: 12, j: 28 },
  "5 27": { i: 5, j: 27 },
  "6 28": { i: 6, j: 28 },
  "7 28": { i: 7, j: 28 },
  "8 28": { i: 8, j: 28 },
  "9 28": { i: 9, j: 28 },
  "10 28": { i: 10, j: 28 },
  "11 27": { i: 11, j: 27 },
  "12 27": { i: 12, j: 27 },
  "5 25": { i: 5, j: 25 },
  "5 26": { i: 5, j: 26 },
  "6 27": { i: 6, j: 27 },
  "7 27": { i: 7, j: 27 },
  "9 27": { i: 9, j: 27 },
  "10 27": { i: 10, j: 27 },
  "11 26": { i: 11, j: 26 },
  "12 26": { i: 12, j: 26 },
  "5 22": { i: 5, j: 22 },
  "5 23": { i: 5, j: 23 },
  "5 24": { i: 5, j: 24 },
  "6 26": { i: 6, j: 26 },
  "7 26": { i: 7, j: 26 },
  "8 27": { i: 8, j: 27 },
  "9 26": { i: 9, j: 26 },
  "10 26": { i: 10, j: 26 },
  "11 25": { i: 11, j: 25 },
  "6 25": { i: 6, j: 25 },
  "7 25": { i: 7, j: 25 },
  "8 26": { i: 8, j: 26 },
  "9 25": { i: 9, j: 25 },
  "10 25": { i: 10, j: 25 },
  "11 24": { i: 11, j: 24 },
  "6 24": { i: 6, j: 24 },
  "7 24": { i: 7, j: 24 },
  "8 25": { i: 8, j: 25 },
  "9 24": { i: 9, j: 24 },
  "10 24": { i: 10, j: 24 },
  "11 23": { i: 11, j: 23 },
  "6 23": { i: 6, j: 23 },
  "8 24": { i: 8, j: 24 },
  "8 21": { i: 8, j: 21 },
  "9 23": { i: 9, j: 23 },
  "10 23": { i: 10, j: 23 },
  "10 22": { i: 10, j: 22 },
  "9 22": { i: 9, j: 22 },
  "8 23": { i: 8, j: 23 },
  "7 22": { i: 7, j: 22 },
  "6 22": { i: 6, j: 22 },
  "7 5": { i: 7, j: 5 },
  "6 6": { i: 6, j: 6 },
  "5 6": { i: 5, j: 6 },
  "4 8": { i: 4, j: 8 },
  "5 7": { i: 5, j: 7 },
  "6 7": { i: 6, j: 7 },
  "7 6": { i: 7, j: 6 },
  "8 6": { i: 8, j: 6 },
  "9 5": { i: 9, j: 5 },
  "4 9": { i: 4, j: 9 },
  "5 8": { i: 5, j: 8 },
  "6 8": { i: 6, j: 8 },
  "7 7": { i: 7, j: 7 },
  "9 6": { i: 9, j: 6 },
  "10 6": { i: 10, j: 6 },
  "8 7": { i: 8, j: 7 },
  "12 6": { i: 12, j: 6 },
  "4 10": { i: 4, j: 10 },
  "5 9": { i: 5, j: 9 },
  "6 9": { i: 6, j: 9 },
  "7 8": { i: 7, j: 8 },
  "8 8": { i: 8, j: 8 },
  "9 7": { i: 9, j: 7 },
  "10 7": { i: 10, j: 7 },
  "11 6": { i: 11, j: 6 },
  "3 11": { i: 3, j: 11 },
  "4 11": { i: 4, j: 11 },
  "5 10": { i: 5, j: 10 },
  "6 10": { i: 6, j: 10 },
  "7 9": { i: 7, j: 9 },
  "8 9": { i: 8, j: 9 },
  "9 8": { i: 9, j: 8 },
  "10 8": { i: 10, j: 8 },
  "11 7": { i: 11, j: 7 },
  "12 7": { i: 12, j: 7 },
  "13 7": { i: 13, j: 7 },
  "3 12": { i: 3, j: 12 },
  "4 12": { i: 4, j: 12 },
  "5 11": { i: 5, j: 11 },
  "6 11": { i: 6, j: 11 },
  "7 10": { i: 7, j: 10 },
  "8 10": { i: 8, j: 10 },
  "9 9": { i: 9, j: 9 },
  "10 9": { i: 10, j: 9 },
  "11 8": { i: 11, j: 8 },
  "12 8": { i: 12, j: 8 },
  "14 8": { i: 14, j: 8 },
  "15 8": { i: 15, j: 8 },
  "4 13": { i: 4, j: 13 },
  "5 12": { i: 5, j: 12 },
  "6 12": { i: 6, j: 12 },
  "7 11": { i: 7, j: 11 },
  "8 11": { i: 8, j: 11 },
  "9 10": { i: 9, j: 10 },
  "10 10": { i: 10, j: 10 },
  "11 9": { i: 11, j: 9 },
  "12 9": { i: 12, j: 9 },
  "13 8": { i: 13, j: 8 },
  "14 9": { i: 14, j: 9 },
  "4 14": { i: 4, j: 14 },
  "5 13": { i: 5, j: 13 },
  "6 13": { i: 6, j: 13 },
  "7 12": { i: 7, j: 12 },
  "8 12": { i: 8, j: 12 },
  "9 11": { i: 9, j: 11 },
  "10 11": { i: 10, j: 11 },
  "11 10": { i: 11, j: 10 },
  "12 10": { i: 12, j: 10 },
  "13 9": { i: 13, j: 9 },
  "4 15": { i: 4, j: 15 },
  "5 14": { i: 5, j: 14 },
  "6 14": { i: 6, j: 14 },
  "8 13": { i: 8, j: 13 },
  "9 12": { i: 9, j: 12 },
  "7 13": { i: 7, j: 13 },
  "10 12": { i: 10, j: 12 },
  "11 11": { i: 11, j: 11 },
  "12 11": { i: 12, j: 11 },
  "13 10": { i: 13, j: 10 },
  "5 15": { i: 5, j: 15 },
  "6 15": { i: 6, j: 15 },
  "7 14": { i: 7, j: 14 },
  "8 14": { i: 8, j: 14 },
  "9 13": { i: 9, j: 13 },
  "10 13": { i: 10, j: 13 },
  "11 12": { i: 11, j: 12 },
  "6 16": { i: 6, j: 16 },
  "7 15": { i: 7, j: 15 },
  "8 15": { i: 8, j: 15 },
  "9 14": { i: 9, j: 14 },
  "10 14": { i: 10, j: 14 },
  "11 13": { i: 11, j: 13 },
  "7 16": { i: 7, j: 16 },
  "8 16": { i: 8, j: 16 },
  "9 15": { i: 9, j: 15 },
  "10 15": { i: 10, j: 15 },
  "11 14": { i: 11, j: 14 },
  "12 15": { i: 12, j: 15 },
  "11 15": { i: 11, j: 15 },
  "10 16": { i: 10, j: 16 },
  "9 16": { i: 9, j: 16 },
  "8 17": { i: 8, j: 17 },
  "7 17": { i: 7, j: 17 },
  "8 18": { i: 8, j: 18 },
  "9 17": { i: 9, j: 17 },
  "7 21": { i: 7, j: 21 },
  "9 20": { i: 9, j: 20 },
  "8 22": { i: 8, j: 22 },
  "9 21": { i: 9, j: 21 },
  "10 20": { i: 10, j: 20 },
  "10 18": { i: 10, j: 18 },
  "11 18": { i: 11, j: 18 },
  "10 17": { i: 10, j: 17 },
  "11 16": { i: 11, j: 16 },
  "5 17": { i: 5, j: 17 },
  "7 18": { i: 7, j: 18 },
  "6 20": { i: 6, j: 20 },
  "6 21": { i: 6, j: 21 },
  "7 20": { i: 7, j: 20 },
  "7 19": { i: 7, j: 19 },
  "8 20": { i: 8, j: 20 },
  "8 19": { i: 8, j: 19 },
  "9 19": { i: 9, j: 19 },
  "9 18": { i: 9, j: 18 },
  "7 23": { i: 7, j: 23 },
  "3 27": { i: 3, j: 27 }
};
export const BRIDGE_TILES = {
  "6 4": { i: 6, j: 4 },
  "6 3": { i: 6, j: 3 },
  "7 3": { i: 7, j: 3 },
  "5 2": { i: 5, j: 2 },
  "5 1": { i: 5, j: 1 },
  "4 1": { i: 4, j: 1 },
  "8 4": { i: 8, j: 4 },
  "7 4": { i: 7, j: 4 },
  "17 8": { i: 17, j: 8 },
  "18 8": { i: 18, j: 8 },
  "19 7": { i: 19, j: 7 },
  "20 7": { i: 20, j: 7 },
  "21 6": { i: 21, j: 6 },
  "22 6": { i: 22, j: 6 },
  "23 5": { i: 23, j: 5 }
};
export const NOT_BRIDGE_TILES = {
  "14 26": { i: 14, j: 26 },
  "3 31": { i: 3, j: 31 },
  "3 30": { i: 3, j: 30 },
  "4 30": { i: 4, j: 30 },
  "3 29": { i: 3, j: 29 },
  "3 28": { i: 3, j: 28 },
  "3 32": { i: 3, j: 32 },
  "4 32": { i: 4, j: 32 },
  "5 32": { i: 5, j: 32 },
  "6 32": { i: 6, j: 32 },
  "7 32": { i: 7, j: 32 },
  "8 32": { i: 8, j: 32 },
  "9 32": { i: 9, j: 32 },
  "10 32": { i: 10, j: 32 },
  "11 32": { i: 11, j: 32 },
  "12 32": { i: 12, j: 32 },
  "13 32": { i: 13, j: 32 },
  "14 32": { i: 14, j: 32 },
  "15 32": { i: 15, j: 32 },
  "16 32": { i: 16, j: 32 },
  "17 32": { i: 17, j: 32 },
  "17 31": { i: 17, j: 31 },
  "4 28": { i: 4, j: 28 },
  "4 27": { i: 4, j: 27 },
  "4 26": { i: 4, j: 26 },
  "4 25": { i: 4, j: 25 },
  "4 24": { i: 4, j: 24 },
  "4 23": { i: 4, j: 23 },
  "4 22": { i: 4, j: 22 },
  "5 21": { i: 5, j: 21 },
  "5 20": { i: 5, j: 20 },
  "5 19": { i: 5, j: 19 },
  "6 19": { i: 6, j: 19 },
  "6 18": { i: 6, j: 18 },
  "5 16": { i: 5, j: 16 },
  "6 17": { i: 6, j: 17 },
  "4 16": { i: 4, j: 16 },
  "3 15": { i: 3, j: 15 },
  "3 14": { i: 3, j: 14 },
  "3 13": { i: 3, j: 13 },
  "2 13": { i: 2, j: 13 },
  "2 12": { i: 2, j: 12 },
  "2 11": { i: 2, j: 11 },
  "3 9": { i: 3, j: 9 },
  "3 10": { i: 3, j: 10 },
  "3 8": { i: 3, j: 8 },
  "3 7": { i: 3, j: 7 },
  "4 7": { i: 4, j: 7 },
  "4 6": { i: 4, j: 6 },
  "5 5": { i: 5, j: 5 },
  "6 5": { i: 6, j: 5 },
  "8 5": { i: 8, j: 5 },
  "9 4": { i: 9, j: 4 },
  "10 5": { i: 10, j: 5 },
  "11 5": { i: 11, j: 5 },
  "13 5": { i: 13, j: 5 },
  "14 7": { i: 14, j: 7 },
  "15 7": { i: 15, j: 7 },
  "16 8": { i: 16, j: 8 },
  "16 9": { i: 16, j: 9 },
  "15 9": { i: 15, j: 9 },
  "14 10": { i: 14, j: 10 },
  "13 11": { i: 13, j: 11 },
  "14 11": { i: 14, j: 11 },
  "12 13": { i: 12, j: 13 },
  "12 12": { i: 12, j: 12 },
  "12 14": { i: 12, j: 14 },
  "13 14": { i: 13, j: 14 },
  "13 15": { i: 13, j: 15 },
  "12 16": { i: 12, j: 16 },
  "12 17": { i: 12, j: 17 },
  "11 17": { i: 11, j: 17 },
  "10 19": { i: 10, j: 19 },
  "10 21": { i: 10, j: 21 },
  "11 21": { i: 11, j: 21 },
  "11 22": { i: 11, j: 22 },
  "12 23": { i: 12, j: 23 },
  "12 24": { i: 12, j: 24 },
  "12 25": { i: 12, j: 25 },
  "13 24": { i: 13, j: 24 },
  "13 25": { i: 13, j: 25 },
  "13 26": { i: 13, j: 26 },
  "14 27": { i: 14, j: 27 },
  "15 27": { i: 15, j: 27 },
  "15 28": { i: 15, j: 28 },
  "16 29": { i: 16, j: 29 },
  "16 30": { i: 16, j: 30 },
  "17 30": { i: 17, j: 30 },
  "18 31": { i: 18, j: 31 },
  "19 31": { i: 19, j: 31 },
  "20 32": { i: 20, j: 32 },
  "18 32": { i: 18, j: 32 },
  "19 32": { i: 19, j: 32 },
  "21 32": { i: 21, j: 32 },
  "2 32": { i: 2, j: 32 },
  "12 5": { i: 12, j: 5 },
  "13 6": { i: 13, j: 6 },
  "11 4": { i: 11, j: 4 },
  "14 6": { i: 14, j: 6 },
  "4 29": { i: 4, j: 29 },
  "5 29": { i: 5, j: 29 },
  "5 30": { i: 5, j: 30 },
  "4 31": { i: 4, j: 31 },
  "5 31": { i: 5, j: 31 },
  "6 31": { i: 6, j: 31 },
  "7 31": { i: 7, j: 31 },
  "8 31": { i: 8, j: 31 },
  "9 31": { i: 9, j: 31 },
  "10 31": { i: 10, j: 31 },
  "11 31": { i: 11, j: 31 },
  "12 31": { i: 12, j: 31 },
  "13 31": { i: 13, j: 31 },
  "14 31": { i: 14, j: 31 },
  "15 31": { i: 15, j: 31 },
  "16 31": { i: 16, j: 31 },
  "15 30": { i: 15, j: 30 },
  "6 30": { i: 6, j: 30 },
  "7 30": { i: 7, j: 30 },
  "8 30": { i: 8, j: 30 },
  "9 30": { i: 9, j: 30 },
  "10 30": { i: 10, j: 30 },
  "11 30": { i: 11, j: 30 },
  "12 30": { i: 12, j: 30 },
  "13 30": { i: 13, j: 30 },
  "14 30": { i: 14, j: 30 },
  "15 29": { i: 15, j: 29 },
  "5 28": { i: 5, j: 28 },
  "6 29": { i: 6, j: 29 },
  "7 29": { i: 7, j: 29 },
  "8 29": { i: 8, j: 29 },
  "9 29": { i: 9, j: 29 },
  "10 29": { i: 10, j: 29 },
  "11 28": { i: 11, j: 28 },
  "11 29": { i: 11, j: 29 },
  "12 29": { i: 12, j: 29 },
  "13 29": { i: 13, j: 29 },
  "13 28": { i: 13, j: 28 },
  "14 29": { i: 14, j: 29 },
  "14 28": { i: 14, j: 28 },
  "13 27": { i: 13, j: 27 },
  "12 28": { i: 12, j: 28 },
  "5 27": { i: 5, j: 27 },
  "6 28": { i: 6, j: 28 },
  "7 28": { i: 7, j: 28 },
  "8 28": { i: 8, j: 28 },
  "9 28": { i: 9, j: 28 },
  "10 28": { i: 10, j: 28 },
  "11 27": { i: 11, j: 27 },
  "12 27": { i: 12, j: 27 },
  "5 25": { i: 5, j: 25 },
  "5 26": { i: 5, j: 26 },
  "6 27": { i: 6, j: 27 },
  "7 27": { i: 7, j: 27 },
  "9 27": { i: 9, j: 27 },
  "10 27": { i: 10, j: 27 },
  "11 26": { i: 11, j: 26 },
  "12 26": { i: 12, j: 26 },
  "5 22": { i: 5, j: 22 },
  "5 23": { i: 5, j: 23 },
  "5 24": { i: 5, j: 24 },
  "6 26": { i: 6, j: 26 },
  "7 26": { i: 7, j: 26 },
  "8 27": { i: 8, j: 27 },
  "9 26": { i: 9, j: 26 },
  "10 26": { i: 10, j: 26 },
  "11 25": { i: 11, j: 25 },
  "6 25": { i: 6, j: 25 },
  "7 25": { i: 7, j: 25 },
  "8 26": { i: 8, j: 26 },
  "9 25": { i: 9, j: 25 },
  "10 25": { i: 10, j: 25 },
  "11 24": { i: 11, j: 24 },
  "6 24": { i: 6, j: 24 },
  "7 24": { i: 7, j: 24 },
  "8 25": { i: 8, j: 25 },
  "9 24": { i: 9, j: 24 },
  "10 24": { i: 10, j: 24 },
  "11 23": { i: 11, j: 23 },
  "6 23": { i: 6, j: 23 },
  "8 24": { i: 8, j: 24 },
  "8 21": { i: 8, j: 21 },
  "9 23": { i: 9, j: 23 },
  "10 23": { i: 10, j: 23 },
  "10 22": { i: 10, j: 22 },
  "9 22": { i: 9, j: 22 },
  "8 23": { i: 8, j: 23 },
  "7 22": { i: 7, j: 22 },
  "6 22": { i: 6, j: 22 },
  "7 5": { i: 7, j: 5 },
  "6 6": { i: 6, j: 6 },
  "5 6": { i: 5, j: 6 },
  "4 8": { i: 4, j: 8 },
  "5 7": { i: 5, j: 7 },
  "6 7": { i: 6, j: 7 },
  "7 6": { i: 7, j: 6 },
  "8 6": { i: 8, j: 6 },
  "9 5": { i: 9, j: 5 },
  "4 9": { i: 4, j: 9 },
  "5 8": { i: 5, j: 8 },
  "6 8": { i: 6, j: 8 },
  "7 7": { i: 7, j: 7 },
  "9 6": { i: 9, j: 6 },
  "10 6": { i: 10, j: 6 },
  "8 7": { i: 8, j: 7 },
  "12 6": { i: 12, j: 6 },
  "4 10": { i: 4, j: 10 },
  "5 9": { i: 5, j: 9 },
  "6 9": { i: 6, j: 9 },
  "7 8": { i: 7, j: 8 },
  "8 8": { i: 8, j: 8 },
  "9 7": { i: 9, j: 7 },
  "10 7": { i: 10, j: 7 },
  "11 6": { i: 11, j: 6 },
  "3 11": { i: 3, j: 11 },
  "4 11": { i: 4, j: 11 },
  "5 10": { i: 5, j: 10 },
  "6 10": { i: 6, j: 10 },
  "7 9": { i: 7, j: 9 },
  "8 9": { i: 8, j: 9 },
  "9 8": { i: 9, j: 8 },
  "10 8": { i: 10, j: 8 },
  "11 7": { i: 11, j: 7 },
  "12 7": { i: 12, j: 7 },
  "13 7": { i: 13, j: 7 },
  "3 12": { i: 3, j: 12 },
  "4 12": { i: 4, j: 12 },
  "5 11": { i: 5, j: 11 },
  "6 11": { i: 6, j: 11 },
  "7 10": { i: 7, j: 10 },
  "8 10": { i: 8, j: 10 },
  "9 9": { i: 9, j: 9 },
  "10 9": { i: 10, j: 9 },
  "11 8": { i: 11, j: 8 },
  "12 8": { i: 12, j: 8 },
  "14 8": { i: 14, j: 8 },
  "15 8": { i: 15, j: 8 },
  "4 13": { i: 4, j: 13 },
  "5 12": { i: 5, j: 12 },
  "6 12": { i: 6, j: 12 },
  "7 11": { i: 7, j: 11 },
  "8 11": { i: 8, j: 11 },
  "9 10": { i: 9, j: 10 },
  "10 10": { i: 10, j: 10 },
  "11 9": { i: 11, j: 9 },
  "12 9": { i: 12, j: 9 },
  "13 8": { i: 13, j: 8 },
  "14 9": { i: 14, j: 9 },
  "4 14": { i: 4, j: 14 },
  "5 13": { i: 5, j: 13 },
  "6 13": { i: 6, j: 13 },
  "7 12": { i: 7, j: 12 },
  "8 12": { i: 8, j: 12 },
  "9 11": { i: 9, j: 11 },
  "10 11": { i: 10, j: 11 },
  "11 10": { i: 11, j: 10 },
  "12 10": { i: 12, j: 10 },
  "13 9": { i: 13, j: 9 },
  "4 15": { i: 4, j: 15 },
  "5 14": { i: 5, j: 14 },
  "6 14": { i: 6, j: 14 },
  "8 13": { i: 8, j: 13 },
  "9 12": { i: 9, j: 12 },
  "7 13": { i: 7, j: 13 },
  "10 12": { i: 10, j: 12 },
  "11 11": { i: 11, j: 11 },
  "12 11": { i: 12, j: 11 },
  "13 10": { i: 13, j: 10 },
  "5 15": { i: 5, j: 15 },
  "6 15": { i: 6, j: 15 },
  "7 14": { i: 7, j: 14 },
  "8 14": { i: 8, j: 14 },
  "9 13": { i: 9, j: 13 },
  "10 13": { i: 10, j: 13 },
  "11 12": { i: 11, j: 12 },
  "6 16": { i: 6, j: 16 },
  "7 15": { i: 7, j: 15 },
  "8 15": { i: 8, j: 15 },
  "9 14": { i: 9, j: 14 },
  "10 14": { i: 10, j: 14 },
  "11 13": { i: 11, j: 13 },
  "7 16": { i: 7, j: 16 },
  "8 16": { i: 8, j: 16 },
  "9 15": { i: 9, j: 15 },
  "10 15": { i: 10, j: 15 },
  "11 14": { i: 11, j: 14 },
  "12 15": { i: 12, j: 15 },
  "11 15": { i: 11, j: 15 },
  "10 16": { i: 10, j: 16 },
  "9 16": { i: 9, j: 16 },
  "8 17": { i: 8, j: 17 },
  "7 17": { i: 7, j: 17 },
  "8 18": { i: 8, j: 18 },
  "9 17": { i: 9, j: 17 },
  "7 21": { i: 7, j: 21 },
  "9 20": { i: 9, j: 20 },
  "8 22": { i: 8, j: 22 },
  "9 21": { i: 9, j: 21 },
  "10 20": { i: 10, j: 20 },
  "10 18": { i: 10, j: 18 },
  "11 18": { i: 11, j: 18 },
  "10 17": { i: 10, j: 17 },
  "11 16": { i: 11, j: 16 },
  "5 17": { i: 5, j: 17 },
  "7 18": { i: 7, j: 18 },
  "6 20": { i: 6, j: 20 },
  "6 21": { i: 6, j: 21 },
  "7 20": { i: 7, j: 20 },
  "7 19": { i: 7, j: 19 },
  "8 20": { i: 8, j: 20 },
  "8 19": { i: 8, j: 19 },
  "9 19": { i: 9, j: 19 },
  "9 18": { i: 9, j: 18 },
  "7 23": { i: 7, j: 23 },
  "3 27": { i: 3, j: 27 }
};
export const PERIMETER_TILES = {
  "2 11": { i: 2, j: 11 },
  "2 12": { i: 2, j: 12 },
  "2 13": { i: 2, j: 13 },
  "2 32": { i: 2, j: 32 },
  "3 7": { i: 3, j: 7 },
  "3 8": { i: 3, j: 8 },
  "3 9": { i: 3, j: 9 },
  "3 10": { i: 3, j: 10 },
  "3 13": { i: 3, j: 13 },
  "3 14": { i: 3, j: 14 },
  "3 15": { i: 3, j: 15 },
  "3 27": { i: 3, j: 27 },
  "3 28": { i: 3, j: 28 },
  "3 29": { i: 3, j: 29 },
  "3 30": { i: 3, j: 30 },
  "3 31": { i: 3, j: 31 },
  "3 32": { i: 3, j: 32 },
  "4 1": { i: 4, j: 1 },
  "4 6": { i: 4, j: 6 },
  "4 7": { i: 4, j: 7 },
  "4 16": { i: 4, j: 16 },
  "4 22": { i: 4, j: 22 },
  "4 23": { i: 4, j: 23 },
  "4 24": { i: 4, j: 24 },
  "4 25": { i: 4, j: 25 },
  "4 26": { i: 4, j: 26 },
  "4 27": { i: 4, j: 27 },
  "4 32": { i: 4, j: 32 },
  "5 5": { i: 5, j: 5 },
  "5 16": { i: 5, j: 16 },
  "5 17": { i: 5, j: 17 },
  "5 19": { i: 5, j: 19 },
  "5 20": { i: 5, j: 20 },
  "5 21": { i: 5, j: 21 },
  "5 32": { i: 5, j: 32 },
  "6 5": { i: 6, j: 5 },
  "6 18": { i: 6, j: 18 },
  "6 19": { i: 6, j: 19 },
  "6 32": { i: 6, j: 32 },
  "7 31": { i: 7, j: 31 },
  "7 32": { i: 7, j: 32 },
  "8 4": { i: 8, j: 4 },
  "8 32": { i: 8, j: 32 },
  "9 4": { i: 9, j: 4 },
  "9 32": { i: 9, j: 32 },
  "10 5": { i: 10, j: 5 },
  "10 19": { i: 10, j: 19 },
  "10 20": { i: 10, j: 20 },
  "10 21": { i: 10, j: 21 },
  "10 32": { i: 10, j: 32 },
  "11 4": { i: 11, j: 4 },
  "11 17": { i: 11, j: 17 },
  "11 18": { i: 11, j: 18 },
  "11 21": { i: 11, j: 21 },
  "11 22": { i: 11, j: 22 },
  "11 31": { i: 11, j: 31 },
  "11 32": { i: 11, j: 32 },
  "12 5": { i: 12, j: 5 },
  "12 12": { i: 12, j: 12 },
  "12 13": { i: 12, j: 13 },
  "12 14": { i: 12, j: 14 },
  "12 16": { i: 12, j: 16 },
  "12 17": { i: 12, j: 17 },
  "12 23": { i: 12, j: 23 },
  "12 24": { i: 12, j: 24 },
  "12 32": { i: 12, j: 32 },
  "13 5": { i: 13, j: 5 },
  "13 11": { i: 13, j: 11 },
  "13 14": { i: 13, j: 14 },
  "13 15": { i: 13, j: 15 },
  "13 24": { i: 13, j: 24 },
  "13 25": { i: 13, j: 25 },
  "13 32": { i: 13, j: 32 },
  "14 6": { i: 14, j: 6 },
  "14 7": { i: 14, j: 7 },
  "14 10": { i: 14, j: 10 },
  "14 11": { i: 14, j: 11 },
  "14 26": { i: 14, j: 26 },
  "14 27": { i: 14, j: 27 },
  "14 32": { i: 14, j: 32 },
  "15 7": { i: 15, j: 7 },
  "15 9": { i: 15, j: 9 },
  "15 27": { i: 15, j: 27 },
  "15 28": { i: 15, j: 28 },
  "15 32": { i: 15, j: 32 },
  "16 8": { i: 16, j: 8 },
  "16 29": { i: 16, j: 29 },
  "16 30": { i: 16, j: 30 },
  "16 32": { i: 16, j: 32 },
  "17 30": { i: 17, j: 30 },
  "17 32": { i: 17, j: 32 },
  "18 31": { i: 18, j: 31 },
  "18 32": { i: 18, j: 32 },
  "19 31": { i: 19, j: 31 },
  "19 32": { i: 19, j: 32 },
  "20 32": { i: 20, j: 32 },
  "21 32": { i: 21, j: 32 },
  "22 6": { i: 22, j: 6 }
};
export const PLAYER_ABILITIES = {
  ice: {
    passiveName: "Cold Shoulder",
    activeName: "Ice Slice",
    range: 3,
    type: "offensive",
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) =>
      shootPower({
        data,
        dataIndex: k,
        targetData,
        scale,
        count: 35,
        statusKey: "isCold",
        numTiles: 6,
        setTileStatuses
      }),
    displayLookup: "abilityIce",
    Element: "Ice",
    element: "ice",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 4000
  },
  glass: {
    passiveName: "TBD",
    activeName: "Teleport",
    range: 30,
    type: "escape",
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) => setTeleportData(_teleportData => [..._teleportData, k]),
    getPlayerIndex: k => k,
    displayLookup: "abilityGlass",
    Element: "Glass",
    element: "glass",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 12000
  },
  fire: {
    passiveName: "Campfire",
    activeName: "Brush Fire",
    range: 10,
    type: "offensive",
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) =>
      shootPower({
        data,
        dataIndex: k,
        targetData,
        scale,
        count: 10,
        statusKey: "isOnFire",
        numTiles: 3,
        setTileStatuses
      }),
    displayLookup: "abilityFire",
    Element: "Fire",
    element: "fire",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 4000
  },
  wood: {
    passiveName: "Crunchy Granola",
    activeName: "Overgrowth",
    type: "offensive",
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) =>
      shootPower({
        data,
        dataIndex: k,
        targetData,
        scale,
        count: 10,
        statusKey: "isWooded",
        numTiles: 3,
        setTileStatuses
      }),
    range: 10,
    displayLookup: "abilityWood",
    Element: "Wood",
    element: "wood",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 6000
  },
  lightning: {
    passiveName: "Charged Step",
    activeName: "Discharge",
    type: "offensive",
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) =>
      shootPower({
        data,
        dataIndex: k,
        targetData,
        scale,
        count: 30,
        statusKey: "isElectrified",
        numTiles: 3,
        setTileStatuses
      }),
    range: 10,
    displayLookup: "abilityLightning",
    Element: "Lightning",
    element: "lightning",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 2000
  },
  death: {
    passiveName: "Reaper",
    activeName: "Haunt",
    range: 10,
    type: "offensive",
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) =>
      shootPower({
        data,
        dataIndex: k,
        targetData,
        scale,
        count: 30,
        statusKey: "isGhosted",
        numTiles: 1,
        setTileStatuses
      }),
    displayLookup: "abilityDeath",
    Element: "Death",
    element: "death",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 15000
  },
  bubble: {
    passiveName: "Shelter",
    activeName: "Dispel",
    type: "defensive",
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) =>
      shootPower({
        data,
        dataIndex: k,
        targetData,
        scale,
        count: 7,
        statusKey: "isBubble",
        numTiles: 6,
        setTileStatuses
      }),
    range: 4,
    displayLookup: "abilityBubble",
    Element: "Bubble",
    element: "bubble",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 8000
  },
  metal: {
    passiveName: "Aegis Armor",
    activeName: "Aegis",
    type: "defensive",
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) =>
      shootPower({
        data,
        dataIndex: k,
        targetData,
        scale,
        count: 2,
        statusKey: "isShielded",
        numTiles: 6,
        setTileStatuses
      }),
    range: 2,
    displayLookup: "abilityMetal",
    Element: "Metal",
    element: "metal",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 10000
  },
  heart: {
    passiveName: "Good Vibes",
    activeName: "Heal",
    type: "heal", // change this.
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) =>
      shootPower({
        data,
        dataIndex: k,
        targetData,
        scale,
        count: 20,
        statusKey: "isHealing",
        numTiles: 1,
        setTileStatuses
      }),
    range: 10,
    displayLookup: "abilityHeart",
    Element: "Heart",
    element: "heart",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 10000
  },
  kaijuFire: {
    passiveName: "",
    activeName: "",
    range: 30,
    type: "offensive",
    activateActive: (
      k,
      data,
      setTeleportData,
      targetData,
      setTileStatuses,
      scale
    ) => {
      shootPower({
        data,
        dataIndex: k,
        targetData,
        scale,
        count: 10,
        statusKey: "isOnKaijuFire",
        numTiles: 3,
        setTileStatuses
      });
    },
    displayLookup: "",
    Element: "",
    element: "",
    isPassive: false,
    isActive: false,
    accTime: 0,
    cooldownTime: 8000
  }
};
export const DEATH_TILE_STATUSES = [
  "isElectrified",
  "isOnFire",
  "isOnKaijuFire",
  "isGhosted",
  "isWooded",
  "isCold"
];
export const PLAYER_CLASSES = [
  { elems: "Bubble,Death,Fire", class_name: "Dark Wizard" },
  { elems: "Bubble,Death,Glass", class_name: "Dark Fairy" },
  { elems: "Bubble,Death,Heart", class_name: "Wild Mage" },
  { elems: "Bubble,Death,Ice", class_name: "Sorcerer" },
  { elems: "Bubble,Death,Lightning", class_name: "Dark Wizard" },
  { elems: "Bubble,Death,Metal", class_name: "Undead Provisioner" },
  { elems: "Bubble,Death,Wood", class_name: "Undead Fairy" },
  { elems: "Bubble,Fire,Glass", class_name: "High wizard" },
  { elems: "Bubble,Fire,Heart", class_name: "Sorcerer" },
  { elems: "Bubble,Fire,Ice", class_name: "Sorcerer" },
  { elems: "Bubble,Fire,Lightning", class_name: "High Wizard" },
  { elems: "Bubble,Fire,Metal", class_name: "General" },
  { elems: "Bubble,Fire,Wood", class_name: "Charred Fairy" },
  { elems: "Bubble,Glass,Heart", class_name: "Light Fairy" },
  { elems: "Bubble,Glass,Ice", class_name: "Escapist" },
  { elems: "Bubble,Glass,Lightning", class_name: "High Wizard" },
  { elems: "Bubble,Glass,Metal", class_name: "Dispeller" },
  { elems: "Bubble,Glass,Wood", class_name: "Fairy" },
  { elems: "Bubble,Heart,Ice", class_name: "Alchemist" },
  { elems: "Bubble,Heart,Lightning", class_name: "Genie" },
  { elems: "Bubble,Heart,Metal", class_name: "Healer" },
  { elems: "Bubble,Heart,Wood", class_name: "Druid" },
  { elems: "Bubble,Ice,Lightning", class_name: "Fury" },
  { elems: "Bubble,Ice,Metal", class_name: "Cold King" },
  { elems: "Bubble,Ice,Wood", class_name: "Trapper" },
  { elems: "Bubble,Lightning,Metal", class_name: "Elemental Archer" },
  { elems: "Bubble,Lightning,Wood", class_name: "Stormcaller" },
  { elems: "Bubble,Metal,Wood", class_name: "Scientist" },
  { elems: "Death,Fire,Glass", class_name: "Infernalist" },
  { elems: "Death,Fire,Heart", class_name: "Sorcerer" },
  { elems: "Death,Fire,Ice", class_name: "Horseman" },
  { elems: "Death,Fire,Lightning", class_name: "Warlock" },
  { elems: "Death,Fire,Metal", class_name: "Death Knight" },
  { elems: "Death,Fire,Wood", class_name: "Unkempt Druid" },
  { elems: "Death,Glass,Heart", class_name: "Psychopomp" },
  { elems: "Death,Glass,Ice", class_name: "Necromancer" },
  { elems: "Death,Glass,Lightning", class_name: "Duelist" },
  { elems: "Death,Glass,Metal", class_name: "Death Knight" },
  { elems: "Death,Glass,Wood", class_name: "Grim Reaper" },
  { elems: "Death,Heart,Ice", class_name: "Ferryman" },
  { elems: "Death,Heart,Lightning", class_name: "Sorcerer" },
  { elems: "Death,Heart,Metal", class_name: "Forsaken Paladin" },
  { elems: "Death,Heart,Wood", class_name: "Shaman" },
  { elems: "Death,Ice,Lightning", class_name: "Undead Pirate" },
  { elems: "Death,Ice,Metal", class_name: "Draugr" },
  { elems: "Death,Ice,Wood", class_name: "Undertaker" },
  { elems: "Death,Lightning,Metal", class_name: "Undead Archer" },
  { elems: "Death,Lightning,Wood", class_name: "Shaman" },
  { elems: "Death,Metal,Wood", class_name: "Vale Knight" },
  { elems: "Fire,Glass,Heart", class_name: "Bard" },
  { elems: "Fire,Glass,Ice", class_name: "Wizard" },
  { elems: "Fire,Glass,Lightning", class_name: "Wizard" },
  { elems: "Fire,Glass,Metal", class_name: "Archon" },
  { elems: "Fire,Glass,Wood", class_name: "Charred Fairy" },
  { elems: "Fire,Heart,Ice", class_name: "Sorcerer" },
  { elems: "Fire,Heart,Lightning", class_name: "Shaman" },
  { elems: "Fire,Heart,Metal", class_name: "Crusader" },
  { elems: "Fire,Heart,Wood", class_name: "Bard" },
  { elems: "Fire,Ice,Lightning", class_name: "Elementalist" },
  { elems: "Fire,Ice,Metal", class_name: "Enchanter" },
  { elems: "Fire,Ice,Wood", class_name: "Hag" },
  { elems: "Fire,Lightning,Metal", class_name: "Battlemage" },
  { elems: "Fire,Lightning,Wood", class_name: "Naturalist" },
  { elems: "Fire,Metal,Wood", class_name: "Blacksmith" },
  { elems: "Glass,Heart,Ice", class_name: "Interloper" },
  { elems: "Glass,Heart,Lightning", class_name: "Valkyrie" },
  { elems: "Glass,Heart,Metal", class_name: "Cleric" },
  { elems: "Glass,Heart,Wood", class_name: "Sprite" },
  { elems: "Glass,Ice,Lightning", class_name: "Weather Witch" },
  { elems: "Glass,Ice,Metal", class_name: "Sherpa" },
  { elems: "Glass,Ice,Wood", class_name: "Trapper" },
  { elems: "Glass,Lightning,Metal", class_name: "Phalanx" },
  { elems: "Glass,Lightning,Wood", class_name: "Druid" },
  { elems: "Glass,Metal,Wood", class_name: "Gardener" },
  { elems: "Heart,Ice,Lightning", class_name: "Soothsayer" },
  { elems: "Heart,Ice,Metal", class_name: "Icy Architect" },
  { elems: "Heart,Ice,Wood ", class_name: "edge Witch" },
  { elems: "Heart,Lightning,Metal", class_name: "Enchanted Archer" },
  { elems: "Heart,Lightning,Wood", class_name: "Druid" },
  { elems: "Heart,Metal,Wood", class_name: "Ranger" },
  { elems: "Ice,Lightning,Metal", class_name: "Stormcaller" },
  { elems: "Ice,Lightning,Wood", class_name: "Druid" },
  { elems: "Ice,Metal,Wood", class_name: "Ranger" },
  { elems: "Lightning,Metal,Wood", class_name: "Ranger" }
];
// bubble, death, fire, glass, heart, ice, lightning, metal, wood
// export const PLAYER_CLASSES = [
//   "Glass,Fire,Wood Charred Fairy",
//   "Glass,Fire,Lightning Wizard",
//   "Glass,Fire,Death Infernalist",
//   "Glass,Fire,Bubble High wizard",
//   "Glass,Fire,Metal Archon",
//   "Glass,Fire,Ice Wizard",
//   "Glass,Fire,Heart Bard",
//   "Glass,Wood,Lightning Druid",
//   "Glass,Wood,Death Grim Reaper",
//   "Glass,Wood,Bubble Fairy",
//   "Glass,Wood,Metal Gardener",
//   "Glass,Wood,Ice Trapper",
//   "Glass,Wood,Heart Sprite",
//   "Glass,Lightning,Death Duelist",
//   "Glass,Lightning,Bubble High Wizard",
//   "Glass,Lightning,Metal Phalanx",
//   "Glass,Lightning,Ice Weather Witch",
//   "Glass,Lightning,Heart Valkyrie",
//   "Glass,Death,Bubble Dark Fairy",
//   "Glass,Death,Metal Death Knight",
//   "Glass,Death,Ice Necromancer",
//   "Glass,Death,Heart Psychopomp",
//   "Glass,Bubble,Metal Dispeller",
//   "Glass,Bubble,Ice Escapist",
//   "Glass,Bubble,Heart Light Fairy",
//   "Glass,Metal,Ice Sherpa",
//   "Glass,Metal,Heart Cleric",
//   "Glass,Ice,Heart Interloper",
//   "Fire,Wood,Lightning Naturalist",
//   "Fire,Wood,Death Unkempt Druid",
//   "Fire,Wood,Bubble Charred Fairy",
//   "Fire,Wood,Metal Blacksmith",
//   "Fire,Wood,Ice Hag",
//   "Fire,Wood,Heart Bard",
//   "Fire,Lightning,Death Warlock",
//   "Fire,Lightning,Bubble High Wizard",
//   "Fire,Lightning,Metal Battlemage",
//   "Fire,Lightning,Ice Elementalist",
//   "Fire,Lightning,Heart Shaman",
//   "Fire,Death,Bubble Dark Wizard",
//   "Fire,Death,Metal Death Knight",
//   "Fire,Death,Ice Horseman",
//   "Fire,Death,Heart Sorcerer",
//   "Fire,Bubble,Metal General",
//   "Fire,Bubble,Ice Sorcerer",
//   "Fire,Bubble,Heart Sorcerer",
//   "Fire,Metal,Ice Enchanter",
//   "Fire,Metal,Heart Crusader",
//   "Fire,Ice,Heart Sorcerer",
//   "Wood,Lightning,Death Shaman",
//   "Wood,Lightning,Bubble Stormcaller",
//   "Wood,Lightning,Metal Ranger",
//   "Wood,Lightning,Ice Druid",
//   "Wood,Lightning,Heart Druid",
//   "Wood,Death,Bubble Undead Fairy",
//   "Wood,Death,Metal Vale Knight",
//   "Wood,Death,Ice Undertaker",
//   "Wood,Death,Heart Shaman",
//   "Wood,Bubble,Metal Scientist",
//   "Wood,Bubble,Ice Trapper",
//   "Wood,Bubble,Heart Druid",
//   "Wood,Metal,Ice Ranger",
//   "Wood,Metal,Heart Ranger",
//   "Wood,Ice,Heart Hedge Witch",
//   "Lightning,Death,Bubble Dark Wizard",
//   "Lightning,Death,Metal Undead Archer",
//   "Lightning,Death,Ice Undead Pirate",
//   "Lightning,Death,Heart Sorcerer",
//   "Lightning,Bubble,Metal Elemental Archer",
//   "Lightning,Bubble,Ice Fury",
//   "Lightning,Bubble,Heart Genie",
//   "Lightning,Metal,Ice Stormcaller",
//   "Lightning,Metal,Heart Enchanted Archer",
//   "Lightning,Ice,Heart Soothsayer",
//   "Death,Bubble,Metal Undead Provisioner",
//   "Death,Bubble,Ice Sorcerer",
//   "Death,Bubble,Heart Wild Mage",
//   "Death,Metal,Ice Draugr",
//   "Death,Metal,Heart Forsaken Paladin",
//   "Death,Ice,Heart Ferryman",
//   "Bubble,Metal,Ice Cold King",
//   "Bubble,Metal,Heart Healer",
//   "Bubble,Ice,Heart Alchemist",
//   "Metal,Ice,Heart Icy Architect"
// ];

/*
stats that can be increased / decreased:
moveSpeed,
tilecount,
numTiles,
lives,
inManaPool status

PASSIVES:
glass -> random teleport away instead of [ dmg / lives-- ]
fire -> "fuel", all power count++
wood -> lives++
lightning -> moveSpeed
death -> lives++ (upon enemy death?)
bubble -> "eightball" random chance of triggering "inManaPool" status on loss of life.
metal ->
ice -> "cold shoulder" chance of ignoring a successful kaiju's attack (do not take dmg).
*/
