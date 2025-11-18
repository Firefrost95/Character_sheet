
// Torchdice 1E Game Constants

// Stat Tiers
export const STAT_TIERS = ["Vermin", "Mortal", "Uncanny", "Supernatural", "Epic", "Heroic", "Divine", "Cosmic"];
export const CONDITIONAL_TIERS = ["Cantrip", "Initiate", "Uncanny", "Supernatural", "Epic", "Heroic", "Divine", "Cosmic"];

// Mana/Magic Tiers
export const MANA_TIERS = ["Cantrip", "Initiate", "Uncanny", "Supernatural", "Epic", "Heroic", "Divine", "Cosmic"];

// Stat Levels
export const STAT_LEVELS = ["Low", "Mid", "High"];

// Skill Ranks
export const SKILL_RANKS = ["Untrained", "Novice", "Journeyman", "Adept", "Expert", "Master", "Legend", "Mythological"];

// Rank Modifiers for Skills
export const RANK_MODIFIERS = {
  "Untrained": 0,
  "Novice": 10,
  "Journeyman": 20,
  "Adept": 30,
  "Expert": 40,
  "Master": 50,
  "Legend": 60,
  "Mythological": 70
};

// Character Sizes
export const SIZES = ["Miniscule", "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Titanic"];

// Mass Tiers
export const MASS_TIERS = ["Feather", "Airy", "Light", "Solid", "Heavy", "Dramatic", "Absurd"];

// Tier Value Map (for calculations)
export const TIER_VALUES = {
  "Vermin": 1,
  "Cantrip": 1,
  "Mortal": 1,
  "Initiate": 1,
  "Uncanny": 2,
  "Supernatural": 3,
  "Epic": 4,
  "Heroic": 5,
  "Divine": 6,
  "Cosmic": 7
};

// Ability Ranks
export const ABILITY_RANKS = ["D", "C", "B", "A", "S"];

// Ability Rank Costs (SP)
export const ABILITY_RANK_COSTS = {
  "D": 10,
  "C": 20,
  "B": 40,
  "A": 80,
  "S": 160
};

// Modern Magic Schools
export const MODERN_SCHOOLS = [
  "Elementalism",
  "Force",
  "Clairvoyance",
  "Necromancy",
  "Transmutation",
  "Biomancy",
  "Dimensionalism",
  "Psychic",
  "Conjuration"
];

// Ancient Magic Schools
export const ANCIENT_SCHOOLS = ["Holy Magic", "Dark Magic", "Nature Magic"];

// Magic Types
export const MAGIC_TYPES = [
  "None",
  "Modern Magic",
  "Ancient Magic",
  "Meta Magic",
  "Ki/Monk",
  "Psionics",
  "Shamanism"
];

// School Keywords
export const SCHOOL_KEYWORDS = {
  "Elementalism": ["Fire", "Earth", "Lightning", "Air", "Water", "Ice", "Darkness", "Light"],
  "Force": ["Kinesis", "Magnetism", "Gravity"],
  "Clairvoyance": ["Sight", "Sound", "Smell", "Taste", "Touch", "Instinct"],
  "Dimensionalism": ["Time", "Space", "Gravity"],
  "Necromancy": ["Soul", "Death", "Harvest", "Bone", "Shadow", "Blood", "Life"],
  "Biomancy": ["Blood", "Flesh", "Bone", "Life"],
  "Transmutation": ["Earth", "Metal", "Crystal", "Liquid", "Dismantle"],
  "Conjuration": ["Spirit", "Demon", "Angel", "Crab", "Equipment/Inanimate"],
  "Psychic": ["Mind", "Emotion", "Illusion", "Instinct", "Knowledge"]
};

