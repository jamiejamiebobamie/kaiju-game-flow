export const Kaiju = [
  "Glass",
  "Fire",
  "Wood",
  "Lightning",
  "Death",
  "Bubble",
  "Metal"
];
export const Accessories = [
  {
    name: "Cigarette",
    effect: ({ setStats, setKaiju }) => {
      setKaiju([{ name: "Fire", i: 1, lvl: 1 }]);
      setStats(stats => {
        return { ...stats, dmg: stats.dmg + 1 };
      });
    },
    description: `Overrides the random starting Kaiju and sets the starting
                Kaiju to Fire. In real game, Kaiju will set fires randomly and
                cigarette will act as a fire starter for power, but here it
                will just give an attack modifier.`
  },
  {
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
  {
    name: "Cool Jacket",
    effect: () => {},
    description: `Just a really cool jacket.`
  },
  {
    name: "Metal Bat",
    effect: ({ setStats }) => {
      setStats(stats => {
        return { ...stats, dmg: stats.dmg + 5 };
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
                  These modifiers allow the bat to attack wraiths.`
  }
];
