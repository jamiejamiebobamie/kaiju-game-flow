export const STARTING_KAIJU_CHOICES = [
  { element: "Glass", name: "Moth", lvl: 1 },
  { element: "Fire", name: "Salamander", lvl: 1 },
  { element: "Wood", name: "Garden Snake", lvl: 1 },
  { element: "Lightning", name: "Tarantula", lvl: 1 },
  { element: "Death", name: "Albino Mantis", lvl: 1 },
  { element: "Bubble", name: "Balloon Animal", lvl: 1 },
  { element: "Metal", name: "RC Car", lvl: 1 }
];

/*
EFFECT CALLBACKS:
    onAttack
    onManaWellGain
    onManaWellLose
    onStart
    onDeath
*/
export const ACCESSORIES = {
  Compass: {
    key: "Compass",
    name: "Compass",
    onStart: () => {},
    description: `All players start with this. The compass will point in the
                    direction of the closest mana well.`
  },
  Cigarette: {
    key: "Cigarette",
    name: "Cigarette",
    onStart: ({ kaiju, setStats }) => {
      let modifier = kaiju.find(k => k.element === "Fire") ? 4 : 0;
      setStats(stats => {
        return stats.Cigarette && modifier === 4
          ? stats
          : {
              ...stats,
              Cigarette: !stats.Cigarette && modifier === 4,
              dmg: stats.dmg + modifier
            };
      });
    },
    onManaWellGain: ({ kaiju, setStats }) => {
      let modifier = kaiju.find(k => k.element === "Fire") ? 4 : 0;
      setStats(stats => {
        return stats.Cigarette && modifier === 4
          ? stats
          : {
              ...stats,
              Cigarette: !stats.Cigarette && modifier === 4,
              dmg: stats.dmg + modifier
            };
      });
    },
    onManaWellLose: ({ kaiju, setStats }) => {
      let modifier = kaiju.find(k => k.element === "Fire") ? 4 : 0;
      setStats(stats => {
        return stats.Cigarette && modifier === 4
          ? stats
          : {
              ...stats,
              Cigarette: !(stats.Cigarette && modifier === 0),
              dmg: stats.dmg + modifier
            };
      });
    },
    description: `Increased fire damage.`
  },
  Unicorn: {
    key: "Unicorn",
    name: "Unicorn",
    onStart: ({ setStats }) => {
      setStats(stats => {
        return { ...stats, moveSpeed: stats.moveSpeed + 7 };
      });
    },
    onAttack: ({ setAccessory }) => {
      setAccessory(accessories => {
        if (accessories.includes(accessory => accessory.key === "Unicorn")) {
          const _accessories = [...accessories];
          const i = accessories.indexOf(
            accessory => accessory.key === "Unicorn"
          );
          _accessories.splice(i, 0); // need to test.
          return _accessories;
        } else {
          return accessories;
        }
      });
    },
    description: `Player starts with a ridable Pegasus mount that confers a
                  large speed increase, but a speed increase that goes away
                  after the first encounter with another player. In game, the
                  unicorn will throw the player off of it and run away.`
  },
  CoolJacket: {
    key: "CoolJacket",
    name: "Cool Jacket",
    onStart: () => {},
    description: `Just a really cool jacket.`
  },
  MetalBat: {
    key: "MetalBat",
    name: "Metal Bat",
    onAttack: ({ setStats, kaiju }) => {
      setStats(stats => {
        // set stats to what they were originally after attack is over.
        setTimeout(() => setStats(stats), 2000); // needs to be tested.
        let modifier =
          kaiju.filter(
            k =>
              k.element === "Lightning" ||
              k.element === "Fire" ||
              k.element === "Wood"
          ).length *
            2 +
          5;
        return { ...stats, dmg: stats.dmg + modifier };
      });
    },
    description: `A metal baseball bat. In game: a melee weapon. Headshots
                  with it are lethal, but here it just confers a damage modifer.
                  The bat is further modified (in game and here) with the
                  addition of the Wood, Fire, and/or Lightning Kaiju.
                  Wood: The bat becomes "Shillelagh" and casts Wood's active on
                        hit. The bat is covered in ivy.
                  Fire: The bat becomes "Firebrand" and casts Fire's active on
                        hit. The bat is glowing, orange metal.
                  Lightning: The bat becomes "Lightning Rod" and casts
                        Lightning's active on hit. The bat is electrified,
                        crackling with live electricity.
                  These modifiers allow the bat to hit wraiths.`
  },
  WingedNikes: {
    key: "WingedNikes",
    name: "Winged Nikes",
    onStart: ({ kaiju, setStats }) => {
      let modifier = kaiju.find(k => k.element === "Lightning") ? 5 : 0;
      console.log("modifier", modifier, kaiju);
      setStats(stats => {
        return stats.WingedNikes && modifier === 5
          ? stats
          : {
              ...stats,
              WingedNikes: !stats.WingedNikes && modifier === 5,
              moveSpeed: stats.moveSpeed + modifier
            };
      });
    },
    onManaWellGain: ({ kaiju, setStats }) => {
      let modifier = kaiju.find(k => k.element === "Lightning") ? 5 : 0;
      setStats(stats => {
        return stats.WingedNikes && modifier === 5
          ? stats
          : {
              ...stats,
              WingedNikes: !stats.WingedNikes && modifier === 5,
              moveSpeed: stats.moveSpeed + modifier
            };
      });
    },
    onManaWellLose: ({ kaiju, setStats }) => {
      let modifier = kaiju.find(k => k.element === "Lightning") ? 5 : 0;
      setStats(stats => {
        return stats.WingedNikes && modifier === 5
          ? stats
          : {
              ...stats,
              WingedNikes: !(stats.WingedNikes && modifier === 0),
              moveSpeed: stats.moveSpeed + modifier
            };
      });
    },
    description: `If player has Lightning Kaiju, his moveSpeed increases a
                  a moderate amount. In "real" game, the speed increase will
                  only be applied with Lightning passive enabled.`
  },
  MagicBeans: {
    key: "MagicBeans",
    name: "5 Magic Beans",
    onStart: ({ kaiju, setStats }) => {
      let modifier = kaiju.find(k => k.element === "Wood") ? 4 : 0;
      setStats(stats => {
        return stats.MagicBeans && modifier === 4
          ? stats
          : {
              ...stats,
              MagicBeans: !stats.MagicBeans && modifier === 4,
              dmg: stats.dmg + modifier
            };
      });
    },
    onManaWellGain: ({ kaiju, setStats }) => {
      let modifier = kaiju.find(k => k.element === "Wood") ? 4 : 0;
      setStats(stats => {
        return stats.MagicBeans && modifier === 4
          ? stats
          : {
              ...stats,
              MagicBeans: !stats.MagicBeans && modifier === 4,
              dmg: stats.dmg + modifier
            };
      });
    },
    onManaWellLose: ({ kaiju, setStats }) => {
      let modifier = kaiju.find(k => k.element === "Wood") ? 4 : 0;
      setStats(stats => {
        return stats.MagicBeans && modifier === 4
          ? stats
          : {
              ...stats,
              MagicBeans: !(stats.MagicBeans && modifier === 0),
              dmg: stats.dmg + modifier
            };
      });
    },
    description: `Plant one of these to create an ivy-tree. Enemies around an
                  ivy-tree have their movement slowed considerably. Here for
                  simplicity it will confer a damage modifier if the player has
                  the Wood Kaiju.`
  },
  SkullRing: {
    key: "SkullRing",
    name: "Skull Ring",
    onDeath: ({ setStats }) => {
      setStats(stats => {
        const modifier = Math.random() > 0.8 ? 1 : 0;
        return { ...stats, lives: stats.lives + modifier };
      });
    },
    description: `Small chance of conferring one wraith on respawn.`
  },
  Revolver: {
    key: "Revolver",
    name: "Revolver",
    onAttack: ({ setStats }) => {
      setStats(stats => {
        setTimeout(() => setStats(stats), 2000); // needs to be tested.
        const modifier = Math.random() > 0.5 ? 5 : 0;
        return { ...stats, dmg: stats.dmg + modifier };
      });
    },
    description: `In game, player starts with a revolver with six bullets. Ammo
                  is found on ocassion. Here, a damage modifier is randomly
                  applied.`
  }
  // SemiAutomatic: {
  //   key: "SemiAutomatic",
  //   name: "Semi-automatic",
  //   onAttack: ({ setStats }) => {
  //     setStats(stats => {
  //       setTimeout(() => setStats(stats), 2000); // needs to be tested.
  //       const modifier = Math.random() > 0.7 ? 7 : 0;
  //       return { ...stats, dmg: stats.dmg + modifier };
  //     });
  //   },
  //   description: `In game, player starts with a one-handed Semi Automatic
  //                 weapon with 50 bullets. Ammo is found rarely. Here, a damage
  //                 modifier is randomly applied.`
  // }
};

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
