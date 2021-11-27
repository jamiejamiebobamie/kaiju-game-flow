export const STARTING_KAIJU_CHOICES = [
  { element: "Glass", name: "Moth", i: 0, lvl: 1 },
  { element: "Fire", name: "Salamander", i: 1, lvl: 1 },
  { element: "Wood", name: "Garden Snake", i: 2, lvl: 1 },
  { element: "Lightning", name: "Tarantula", i: 3, lvl: 1 },
  { element: "Death", name: "Albino Mantis", i: 4, lvl: 1 },
  { element: "Bubble", name: "Balloon Animal", i: 5, lvl: 1 },
  { element: "Metal", name: "RC Car", i: 6, lvl: 1 }
];
export const ACCESSORIES = {
  Compass: {
    key: "Compass",
    name: "Compass",
    effect: () => {},
    description: `All players start with this. The compass will point in the
                    direction of the closest mana well.`
  },
  Cigarette: {
    key: "Cigarette",
    name: "Cigarette",
    effect: ({ setStats, setKaiju }) => {
      setKaiju([{ element: "Fire", name: "Salamander", i: 1, lvl: 1 }]);
      setStats(stats => {
        return { ...stats, dmg: stats.dmg + 1 };
      });
    },
    description: `Overrides the random starting Kaiju and sets the starting
                Kaiju to Fire. In real game, Kaiju will set fires randomly and
                cigarette will act as a fire starter for power, but here it
                will just give an attack modifier.`
  },
  Unicorn: {
    key: "Unicorn",
    name: "Unicorn",
    effect: ({ setStats }) => {
      setStats(stats => {
        return { ...stats, moveSpeed: stats.moveSpeed + 15 };
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
    effect: () => {},
    description: `Just a really cool jacket.`
  },
  MetalBat: {
    key: "MetalBat",
    name: "Metal Bat",
    effect: ({ setStats, Kaiju }) => {
      setStats(stats => {
        let modifier =
          Kaiju.filter(
            k =>
              k.element == "Lightning" ||
              k.element == "Fire" ||
              k.element == "Wood"
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
    effect: ({ setStats }) => {
      setStats(stats => {
        return { ...stats, moveSpeed: stats.moveSpeed + 7 };
      });
    },
    description: `If player has Lightning Kaiju, his moveSpeed increases a
                  a moderate amount (and permanently). In game, the speed
                  increase will only be applied with Lightning passive enabled.`
  },
  MagicBeans: {
    key: "MagicBeans",
    name: "5 Magic Beans",
    effect: ({ setStats, Kaiju }) => {
      setStats(stats => {
        let modifier = Kaiju.find(k => k.element == "Wood") ? 4 : 0;
        return { ...stats, dmg: stats.dmg + modifier };
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
    effect: ({ setStats }) => {
      setStats(stats => {
        const modifier = Math.random() > 0.8 ? 1 : 0;
        return { ...stats, lives: stats.lives + modifier };
      });
    }, // needs to be called everytime on player respawn
    description: `Small chance of conferring one wraith on respawn.`
  },
  Revolver: {
    key: "Revolver",
    name: "Revolver",
    effect: ({ setStats }) => {
      setStats(stats => {
        const modifier = Math.random() > 0.5 ? 5 : 0;
        return { ...stats, dmg: stats.dmg + modifier };
      });
    },
    description: `In game, player starts with a revolver with six bullets. Ammo
                  is found on ocassion. Here, a damage modifier is randomly
                  applied.`
  },
  SemiAutomatic: {
    key: "SemiAutomatic",
    name: "Semi-automatic",
    effect: ({ setStats }) => {
      setStats(stats => {
        const modifier = Math.random() > 0.7 ? 7 : 0;
        return { ...stats, dmg: stats.dmg + modifier };
      });
    },
    description: `In game, player starts with a one-handed Semi Automatic
                  weapon with 50 bullets. Ammo is found rarely. Here, a damage
                  modifier is randomly applied.`
  }
};
