import sys
import random
import functools

def indexOf(arr,target):
    for i,item in enumerate(arr):
        if item == target:
            return i
    return -1

def mixUp(arr):
    shallow_copy = []
    for item in arr:
        shallow_copy.append(item)
    for i in range(0,len(shallow_copy), -1):
        rand_int = random.randint(0,i)
        shallow_copy[i], shallow_copy[rand_int] = shallow_copy[rand_int], shallow_copy[i]
    return shallow_copy

def describePlayer(elements):
    ELEMENT_LOOKUP = {
    "Glass":["moth swarms highlight nearby glass for ability","use environmental glass as a donkey-kong-cannon","redirect projectiles"],
    "Fire":[ "create fire from nothing and immune to fire", "rebuff wraiths", "shoot a flamethrower that can light ivy and trees on fire (spreads faster than most players can travel)"],
    "Wood":["invisiblity while on ivy canopy (ivy moves to indicate footsteps)","ignore melee attacks", "lay down a canopy of ivy that ensares those who are caught in the attack and those who walk on the canopy later"],
    "Lightning":["walk on walls", "move with increased speed", "shoot a lightning bolt"],
    "Death":["harvest death: gain wraiths from player deaths", "automatically spend one wraith instead of dying from any killing blow", "send out unspent wraiths as homing missiles that cannot be destroyed by physical attacks and pass through all physical barriers"],
    "Bubble":["ignore one hit from an enemy regardless of type and immune to falling damage", "send out a bubble that travels forward and  thenup, capturing / absorbing anything that collides with bubble"],
    "Metal":["parked cars sound off with their car alarms if an enemy player is approaching","ignore melee and ranged attacks", "create indestructible walls that block all attacks (except wraiths) from a single direction"],
    }
    abilties = []
    for i, element in enumerate(elements):
        ability_arr = ELEMENT_LOOKUP[element]
        abilties += ability_arr
    mixed_up = mixUp(abilties)
    description = ""
    for i, desc in enumerate(mixed_up):
        if i != 0: description += ', '
        description += desc
    return description

elements = [
"Glass",
"Fire",
"Wood",
"Lightning",
"Death",
"Bubble",
"Metal",
]

accessory = [
"Unicorn",
"Cool Jacket",
"Metal Bat",
"Winged Nikes", # choose electricity if present.
"Fertilizer", # choose wood if present.
"Cigarette", # choose fire if present.
"Empty Wine Bottle" # choose glass if present.
"Skull Ring",
"Revolver",
]

# NOTE: NEED TO RANDOMIZE WHO CHOOSES FIRST!
player1 = [[],[],[]]
player2 = [[],[],[]]

if __name__ == "__main__":
    rand_int = random.randint(0,len(accessory)-1)
    player1[2].append(accessory[rand_int])
    accessory[rand_int], accessory[len(accessory)-1] = accessory[len(accessory)-1], accessory[rand_int]

    rand_int = random.randint(0,len(accessory)-2)
    player2[2].append(accessory[rand_int])

    count = len(elements) - 1
    while count >= 0:
        rand_int = random.randint(0,count)
        if count % 2:
            if random.choice([True, True, False]) or not len(player1[0]):
                if -1 != indexOf( player1[2], "Winged Nikes") and -1 != indexOf(elements[0:count+1], "Lightning"):
                    rand_int = indexOf(elements[0:count+1], "Lightning")
                if -1 != indexOf( player1[2], "Cigarette") and -1 != indexOf(elements[0:count+1], "Fire"):
                    rand_int = indexOf(elements[0:count+1], "Fire")
                if -1 != indexOf( player1[2], "Magic Beans") and -1 != indexOf(elements[0:count+1], "Wood"):
                    rand_int = indexOf(elements[0:count+1], "Wood")
                if -1 != indexOf( player1[2], "Empty Wine Bottle") and -1 != indexOf(elements[0:count+1], "Glass"):
                    rand_int = indexOf(elements[0:count+1], "Glass")
                player1[0].append(elements[rand_int])
        else:
            if random.choice([True, True, False]) or not len(player2[0]):
                if -1 != indexOf( player2[2], "Winged Nikes") and -1 != indexOf(elements[0:count+1], "Lightning"):
                    rand_int = indexOf(elements[0:count+1], "Lightning")
                if -1 != indexOf( player2[2], "Cigarette") and -1 != indexOf(elements[0:count+1], "Fire"):
                    rand_int = indexOf(elements[0:count+1], "Fire")
                if -1 != indexOf( player2[2], "Magic Beans") and -1 != indexOf(elements[0:count+1], "Wood"):
                    rand_int = indexOf(elements[0:count+1], "Wood")
                if -1 != indexOf( player2[2], "Empty Wine Bottle") and -1 != indexOf(elements[0:count+1], "Glass"):
                    rand_int = indexOf(elements[0:count+1], "Glass")
                player2[0].append(elements[rand_int])
        elements[rand_int], elements[count] = elements[count], elements[rand_int]
        count -= 1

    print("player1",player1[2],player1[0])
    print("player2",player2[2], player2[0])
    print()
    print(describePlayer(player1[0]))
    print()
    print(describePlayer(player2[0]))
