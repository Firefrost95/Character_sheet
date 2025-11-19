const RACE_DATA = {
  "Arachnoid": [
    {
      name: "Armed and Dangerous",
      description: "Arachnoids have another set of arms, reducing the t of dual-wielding checks by 2 if they stay with two weapons, or can hold up to four at normal dual-wielding penalties."
    },
    {
      name: "Chitin Armor",
      description: "Arachnoids possess a shell of chitin with Middling Physical Resistance that has Res of Mid (Their Agility Tier) and -2t to Soak checks. They may also wear standard armor above this, thanks to its relative thinness."
    },
    {
      name: "Wrist Stingers OR Spinnerets",
      description: "STINGERS: Start High Mortal Health. DV 1 Middling Slashing/Piercing natural weapon that also deals DV 1 Lesser Toxic damage. Only Toxic scales with Health.\n\nSPINNERETS: High Mortal Agility. Create web armor (Middling Physical Resistance, Partial +2t, Mid Uncanny Res, -2t Soak). Can spin [Health Tiers] times per day, takes 1 minute/6 Full Round Actions."
    }
  ],
  "Arachnoid (Tarantula)": [
    {
      name: "Armed and Dangerous",
      description: "Extra set of arms, reducing the t of dual-wielding checks by 2 if they stay with two weapons, or can hold up to four at normal dual-wielding penalties."
    },
    {
      name: "Chitin Armor",
      description: "Shell of chitin with Middling Physical Resistance, Res of Mid (Agility Tier), -2t to Soak checks. Can wear standard armor above this."
    },
    {
      name: "A Little Less Skinny And A Bit More Fuzzy",
      description: "High Mortal Strength and Health. Can expel body hair as Innate Attack: DV1 Middling Piercing, MMD 16/16, DV 4, Splash (10 feet per Health Level) centered on user. Uses [Health/Strength]. Nullified while wearing full armor, single-target with Partial. Free Action in grapple. Twice per Mortal Health Level per Reset (doubles per Health Tier). Single-target version: DV1 Middling Piercing, MMD 10/14, Range = Splash distance."
    }
  ],
  "Chitterling": [
    {
      name: "Rodents of Unusual Size",
      description: "Choose Small or Medium size at CC. Small: High Mortal Agility (Uncanny cap). Medium: High Mortal Agility + High Mortal Health. +2t to Serenity checks for emotions. Fear status accrues as if Willpower is a Tier lower."
    },
    {
      name: "Gnashing Teeth and Expansive Cheeks",
      description: "Powerful bite: DV2 Piercing, scales with Strength like Unarmed. Can wield single melee weapon in mouth at dual-wielding penalty. Cheek pouches: store 3 items freely, 4 at +1t to speaking, 5 at +3t speaking and halved movement."
    },
    {
      name: "Sneaking and Scuttling",
      description: "Can scuttle (treat Agility as sublevel higher for AD and movement, or Low of next tier if at High). Both hands must be free. When on 2+ Injuries, ignore move speed penalties for running away."
    }
  ],
  "Dryad": [
    {
      name: "Tree Folk",
      description: "Plant-flesh grants Lesser Physical Immunity, Middling Fire Toughness, immunity to Lethal strikes. Count Health as a tier higher for injury t reduction."
    },
    {
      name: "Unified Heart",
      description: "Low Uncanny Charisma OR Willpower (Capped). Talk to plants for info freely. If Charisma: halved SP/GP cost for first two Social skill ranks. If Willpower: halved cost for first two Serenity and Investigation ranks. At CC, no Combat skill above Novice unless related to Awakening."
    },
    {
      name: "The Great Cycle's Observer",
      description: "No Injury can take longer than days to recover with consistent Light and Water access (after all reduction effects). Does not apply to Chemical damage. Functionally immortal in damp, sunny places."
    }
  ],
  "Einherjar": [
    {
      name: "Eternal Warrior",
      description: "If you have at least one combat skill a Tier higher, SP cost to learn/grow combat skills is halved until it reaches parity with highest combat skill (caps at Adept)."
    },
    {
      name: "Divine Determination",
      description: "Subtract 1 from t of all Injuries from Injury Boxes. Roll twice and take highest for all Soak checks."
    },
    {
      name: "Unliving Ideal",
      description: "Start with 3 Low, 2 Mid, 2 High Mortal stats (instead of standard array). Immune to all effects targeting/requiring living creatures (positive or negative). Can heal naturally despite being unliving."
    },
    {
      name: "Fragmented Psyche",
      description: "+5t to all Social checks when interacting with non-Einherjar or unfamiliar individuals."
    },
    {
      name: "Second Chances",
      description: "Can come back from destruction once (if killed by less than Divine). Only regained through significant martial accomplishment analogous to Awakening."
    }
  ],
  "Halfling": [
    {
      name: "Small & Flexible",
      description: "Small size. Can count as size smaller for hiding/tight spaces. Strong Blunt Toughness. Base injury recovery time +1 (doesn't count against medical checks)."
    },
    {
      name: "Spry",
      description: "-2t to all Agility checks. After using movement Action, next consecutive movement Action has speed increase as if a category larger in size."
    },
    {
      name: "Friendly Neighbor",
      description: "-2t to Lie, Convince, Serenity, and Insight checks against most sapients. Can roll Lie instead of Sleight of Hand for Feint combat stunt."
    }
  ],
  "Haos": [
    {
      name: "Steel-Skinned and Iron-Hearted",
      description: "5 Levels to add to Standard Array Tiers (cap Uncanny, any physical stat including Perception). Use Object rules for Soak. Can expend full round action to increase 3 skills to Journeyman (rearrange once per day). Mass of Mid Solid. CANNOT AWAKEN to dreams that modify physical stats/form (exceptions: magical/Ki transformations, certain robotic physiologies, physical/energy mimics)."
    },
    {
      name: "Unbroken, Undaunted, Unstoppable",
      description: "Strong Physical Resistance, Middling Heat/Cold Immunity. Can only have PA based on Mental stats. +3 extra injury boxes but can't heal naturally - require (Craft) Robotics check as broken armor, Repair (+6t), each Injury +t counts as Prot. Roll Soak as Large size."
    },
    {
      name: "Juggernaut",
      description: "Cannot wear armor smaller than Personal Mech. If killed, can be rebuilt as Marathon (DC 20) Difficult (Crafting) Robotics check if head intact."
    }
  ],
  "Helborn": [
    {
      name: "Consummate Trickster",
      description: "Only 5 SP to raise any non-combat skill to Novice AND Journeyman. Can add Multi-Disciplinary Genius to skills one additional time."
    },
    {
      name: "Only Mostly Dead",
      description: "Can ignore Injuries or Incapacitation for one round per Charisma Tier (consecutive or chunks). Can be done even if unconscious."
    },
    {
      name: "Roguish Charm",
      description: "High Mortal Agility and Charisma. Any mono-stat skill using one automatically becomes multi-stat with the other. Can use Agility in place of Charisma and vice versa as Reaction."
    },
    {
      name: "Cheat Fate",
      description: "Once per character life, auto-succeed any single check. Restored by significant accomplishment analogous to Awakening or experience wild enough that Loki and Hel personally notice."
    }
  ],
  "Human": [
    {
      name: "Defy Fate",
      description: "Once per day, reduce ie of a single roll by 2. Can refresh same day if performing feat of great luck and determination."
    },
    {
      name: "Capture Hope",
      description: "When using Final Stand, don't fall unconscious upon conclusion. Instead, choose a single injury to ignore as if under Scars rule."
    },
    {
      name: "Inherited Will",
      description: "1.5x Levels per stat Tier for Status effects. -1t to all Serenity and Soak checks for each unique Status Effect suffering under."
    }
  ],
  "Incarnate (Earth)": [
    {
      name: "Earth Incarnate",
      description: "High Mortal Strength (Uncanny cap). Mass of Low Solid."
    },
    {
      name: "Unyielding Landslide",
      description: "Ignore knockback while on solid ground (not fall damage from flying into surface). Charge damage calculated as if traveled double distance for target (not self)."
    }
  ],
  "Incarnate (Air)": [
    {
      name: "Air Incarnate",
      description: "High Mortal Perception (Uncanny cap). Mass of Low Light."
    },
    {
      name: "All Around You",
      description: "Can replace Agility with Perception for AD. -1t to all Perception checks (doesn't apply when using Perception for Agility)."
    }
  ],
  "Incarnate (Light)": [
    {
      name: "Light Incarnate",
      description: "High Mortal Agility (Uncanny cap)."
    },
    {
      name: "In A Flash",
      description: "Can teleport anywhere visible within normal movement range as action (both start and end must be well lit)."
    }
  ],
  "Incarnate (Force)": [
    {
      name: "Force Incarnate",
      description: "High Mortal Charisma (Uncanny cap)."
    },
    {
      name: "HYAAA",
      description: "Roll Charisma instead of Agility once per round as force pulse. If used with melee weapon Skill Specific Defense, can Parry ranged attacks."
    }
  ],
  "Incarnate (Fire)": [
    {
      name: "Fire Incarnate",
      description: "High Mortal Willpower (Uncanny cap)."
    },
    {
      name: "Light The Fires Of Your Soul",
      description: "Replace a stat in multi-stat skill with Willpower once per round in combat (non-attack). Functions as Flare using Willpower for Cooldown. Puts actual PA Flare on cooldown."
    }
  ],
  "Incarnate (Water)": [
    {
      name: "Water Incarnate",
      description: "High Mortal Health (Uncanny cap)."
    },
    {
      name: "Ripple and Converge",
      description: "Once per reset, heal two injury boxes of +4t or lower as Reaction (body shifts to liquid then reforms)."
    }
  ],
  "Incarnate (Lightning)": [
    {
      name: "Lightning Incarnate",
      description: "High Mortal Strength and Agility."
    },
    {
      name: "Split Second",
      description: "Reroll any own check as Reaction, [Willpower Tiers] times per reset."
    }
  ],
  "Mahntral": [
    {
      name: "A Lion's Pride",
      description: "High Mortal Charisma (Uncanny cap). Can use Charisma for Soak and Serenity checks."
    },
    {
      name: "Sheathed Claws",
      description: "Clawed nails (retracted normally). Free Action to unsheathe, turning unarmed from Blunt to Slashing. Can be used as tools (lockpicking, carving, skinning)."
    },
    {
      name: "Shared Braincell",
      description: "-1t to Serenity checks and +1t to Knowledge-based Intellect checks per additional friendly nearby Lion (max 5 for +/-6t)."
    }
  ],
  "Menehune": [
    {
      name: "Tiny Geniuses",
      description: "High Uncanny Intellect (Low Supernatural cap). Double normal Crafting/Research actions from Intellect. Baseline Novice in all mundane Crafting and Knowledge skills within setting's tech level."
    },
    {
      name: "Tiny People In General, Really",
      description: "Size category Tiny. -1t per Agility Tier to all checks using Agility."
    }
  ],
  "Minotaur": [
    {
      name: "Bloodbath",
      description: "All physical stats increase by one Level when Injury Box filled by receiving damage (cap Uncanny Tier). Bonuses don't fade until Box emptied."
    },
    {
      name: "Seeing Red",
      description: "Go berserk after [Willpower Levels] rounds in combat, attack anyone in sight. -3t to combat-related Serenity, Insight, Investigation while raging. Only clears when Taken Out or hostilities cease. Directing rage from allies: DC 5 Tricky Serenity (no -3t bonus), DC +1 at end of turn."
    }
  ],
  "Mitra": [
    {
      name: "Brave Heart, Frail Body",
      description: "Focus attached to Willpower. High Mortal Willpower & Charisma, Low Mortal Health. Latent Psions: can body block for someone within 20ft as Reaction using psychic barrier (Middling Everything Resistance including mental, Prot [Willpower Levels]). Can buy minor telekinetic/telepathic D-Rank abilities for utility and support."
    },
    {
      name: "There's No Such Thing As A Bad Dog",
      description: "Exceedingly loyal to pack. Cannot take disloyal actions without Difficult Serenity check DC [Willpower Levels x2]. Persuading disloyalty is actually loyalty: base Delicate before all modifiers."
    },
    {
      name: "Unconditional Love Is A Terrible Thing",
      description: "If betrayed by pack member, rage focused on traitor. Add Willpower to all rolls (Multi-Stat), ignore up to 4 t maluses from Injuries for [Willpower Levels] rounds."
    }
  ],
  "Kitsune": [
    {
      name: "Heart Of A Warrior, Body Of A Rogue",
      description: "Focus attached to Willpower. High Mortal Willpower & Charisma, Low Mortal Health. Illusion power: Flare as Free Action to increase t of attacks and Perception checks against them by [Focus Tiers] for one round (white smoke obscures). Can purchase minor D-Rank illusion/trickery abilities."
    },
    {
      name: "The Wise Fox Escapes",
      description: "If suffering Injury from fear-based mental attack, automatically flee encounter."
    },
    {
      name: "Deft Hands",
      description: "Can add Willpower to, or use in place of Agility, for all Sleight of Hand checks."
    }
  ],
  "Ork": [
    {
      name: "Children of Ghaz",
      description: "Wired for combat. +2t to Craft and Knowledge checks not related to combat/high-octane situations. Struggle with ranged weapons that aren't big/explode-y: lower Perception by one Level when using ranged weapon with HR that isn't at lift limit."
    },
    {
      name: "Barely Tickled",
      description: "Middling Everything Resistance. Maintain PA stat passive even after Flaring. Can Flare second time while original on cooldown (removes passive until second cooldown ends). 'Echoes of Ghaz'. Immune to Vital and Lethal Strikes. Cannot wear mundane armor."
    },
    {
      name: "It Juzt Workz",
      description: "Can purchase (not upgrade) D-Rank Narrative abilities related to combat enjoyment and Orkish Color Theory."
    }
  ],
  "Saurian": [
    {
      name: "Lizard Folk",
      description: "Natural protective scales: Middling Physical Resistance, 2 Prot. Scales regenerate only at Reset (retain Durability if broken). Res of non-specialized armor lowers by one Level (chafing)."
    },
    {
      name: "Hunt The Weak",
      description: "+1 base DV to all attacks vs Mooks (affects AD, can't break DV limit). -1 PA Flare Cooldown when defeating Mook (min 1 round). +1t malus to AD while blindsided, +2t to Serenity vs fear effects."
    },
    {
      name: "More Beast Than Man",
      description: "Free Action until combat ends: grow Claws (+1 DV to Unarmed, convert to Slashing, Middling DL by default, follows Unarmed scaling). Instantly regenerate scales' Prot, then 1 Prot per round. Lose ability to use equipment not from Power until combat ends."
    }
  ],
  "Squat": [
    {
      name: "Built like Bricks",
      description: "High Mortal Strength & Health. Middling Physical/Energy Resistance. -1t to all Injuries taken. +2t to AD (never goes away)."
    },
    {
      name: "Hard Work Pays Off",
      description: "Can use Health instead of Intellect for daily crafting actions."
    },
    {
      name: "Small but Mighty",
      description: "Count as Small for AD, but normal size for all other aspects."
    }
  ],
  "Titan": [
    {
      name: "Beefcake",
      description: "Large size. High Mortal Strength (Uncanny cap). High Vermin Agility. Mass of Mid Solid."
    },
    {
      name: "Ungainly",
      description: "+4t to dual-wielding due to rock-like physiology inflexibility. Effects boosting Agility drop by one Tier in effectiveness (Supernatural→Uncanny, Uncanny→Mortal)."
    },
    {
      name: "Tis A Flesh Wound",
      description: "Natural Prot 4 (recovers with PA at Reset). Count all Injuries as one step lower in Severity for recovery time."
    },
    {
      name: "Natural Champions",
      description: "Can purchase minor D-Rank abilities related to strength and toughness."
    }
  ],
  "Void Elf": [
    {
      name: "Voidborn",
      description: "Natural access to Mana stat at High Cantrip. Cannot learn Modern Magic without power. Can only use Mana on natural abilities. +2t to all friendly Social checks not towards other Void Elves."
    },
    {
      name: "Voidborne",
      description: "Can skim along Void surface: 5 Mana per round + special action. Resistance to mundane physical below Heroic (gibs normally then halved). Melee attacks can deal Mental instead of Physical for +5 Mana per attack. Cannot phase through objects."
    },
    {
      name: "Unnatural Healing",
      description: "Can expend 5 Mana per +t of filled Injury Box to empty it (min 5). Mana doesn't regenerate until natural heal or willingly refill. While emptied this way, Social check malus increases to +4t."
    },
    {
      name: "Frail Flesh",
      description: "Minor Physical Vulnerability. Cannot benefit from Made of Iron against any physical damage."
    },
    {
      name: "Void Bolt",
      description: "Costs entire max Mana Pool as action. Make t7, 5-dice-per-Mana attack with Short Range and DV 4 Middling Void damage. Cannot break dice cap."
    }
  ],
  "True Incarnate": [
    {
      name: "Pseudo Awakened",
      description: "Forswear using actual power roller - roll elemental mod to choose Element. Cannot Awaken to true power except under extreme/unusual circumstances."
    },
    {
      name: "Elemental Form (D-Rank)",
      description: "Composed partially of element or display properties. Grants passive or active effects to flesh and body. Can be upgraded with SP."
    },
    {
      name: "Elemental Expression (D-Rank)",
      description: "Proper Elementalist. Generally possess Conditional Stat. Can directly manipulate element outside body. Can be upgraded with SP."
    },
    {
      name: "Elemental Consumption (D-Rank)",
      description: "Can devour element or linked substance for temporary/permanent benefits. Can be upgraded with SP."
    },
    {
      name: "Elemental Destruction (C-Rank)",
      description: "Turn element control into opposition/destruction. Exceptionally powerful but draining. Can be upgraded with SP."
    }
  ],
  "Unblooded Eternal": [
    {
      name: "Superior Bodies",
      description: "High Uncanny Strength, Mid Uncanny Health, High Mortal Agility (Mid Uncanny Cap), High Mortal Perception. Strong Physical Resistance, Middling Energy Resistance. Can live forever if not killed."
    },
    {
      name: "Warriors' Minds",
      description: "Flat -1t to all weapon and unarmed combat skills. +2t to all Social or Scholarly skills."
    },
    {
      name: "Aerial Dominion",
      description: "Flight at double normal movement speed. Fly rolls scale off Strength (not Agility). If Charge, DL can shift to Fall Damage (e.g., DV 1 Middling Blunt punch after 40ft becomes DV 2 Strong Blunt, self takes DV 1 Strong Blunt)."
    },
    {
      name: "Conqueror's Arrogance",
      description: "Cannot Awaken without extremely specific circumstances. Cannot convert SP to GP despite lacking power."
    },
    {
      name: "Hamstrung Growth",
      description: "Gain or update an ability every 50 SP expended (on anything). No control over what gain/upgrade is."
    }
  ]
};

export default RACE_DATA;
