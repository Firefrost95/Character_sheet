import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Sparkles, Flame, Zap, BookOpen, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAGIC_TYPES, MODERN_SCHOOLS, ANCIENT_SCHOOLS, SKILL_RANKS, SCHOOL_KEYWORDS, RANK_MODIFIERS } from "@/components/gameConstants";
import { Dices, Copy, Check } from "lucide-react";

export default function MagicSection({ character, setCharacter }) {
  const magic = character.magic || { type: "None" };
  const [copiedPool, setCopiedPool] = React.useState(null);

  const updateMagic = (field, value) => {
    setCharacter({
      ...character,
      magic: { ...magic, [field]: value }
    });
  };

  const calculateSchoolDicePool = (school) => {
    if (!school.rank) return null;

    const rankTModifiers = {
      "Untrained": 1,
      "Novice": 0,
      "Journeyman": -1,
      "Adept": -3,
      "Expert": -4,
      "Master": -6,
      "Legend": -9,
      "Mythological": -13
    };

    // Dice pool is purely based on skill rank - 10 dice per rank above Untrained
    const rankIndex = SKILL_RANKS.findIndex(r => r === school.rank);
    let baseDice = rankIndex > 0 ? rankIndex * 10 : 0;
    let sides = 12; // Always d12 for magic schools
    
    // Start with base t7 and add rank modifier
    let tModifier = 7 + (rankTModifiers[school.rank] || 1);
    const baseT = tModifier;

    // Apply universal dice cap rules
    let wasBuffed = false;
    let displayDice = baseDice;
    
    if (baseDice < 10 && rankIndex > 0) {
      tModifier += 1;
      wasBuffed = true;
      if (baseDice <= 5) tModifier += 1;
      displayDice = 10;
    }

    let cappedDice = displayDice;
    let wasCapped = false;
    let autoSuccesses = 0;
    if (displayDice > 25) {
      const excess = Math.floor((displayDice - 25) / 5);
      tModifier -= excess;
      cappedDice = 25;
      wasCapped = true;

      if (tModifier < 3) {
        autoSuccesses = 3 - tModifier;
        tModifier = 3;
      }
    }

    return { 
      baseDice, 
      cappedDice, 
      sides, 
      tModifier,
      baseT,
      wasCapped,
      wasBuffed,
      autoSuccesses
    };
  };

  const copyDicePool = (poolString) => {
    navigator.clipboard.writeText(poolString);
    setCopiedPool(poolString);
    setTimeout(() => setCopiedPool(null), 2000);
  };

  const addSchool = () => {
    updateMagic('schools', [...(magic.schools || []), {
      name: "",
      rank: "Novice",
      keywords: [],
      modifiers: [],
      custom_keywords: [],
      custom_modifiers: [],
      keyword_notes: {},
      modifier_notes: {}
    }]);
  };

  const updateSchool = (index, field, value) => {
    const newSchools = [...(magic.schools || [])];
    newSchools[index] = { ...newSchools[index], [field]: value };
    updateMagic('schools', newSchools);
  };

  const removeSchool = (index) => {
    updateMagic('schools', (magic.schools || []).filter((_, i) => i !== index));
  };

  const updateKeywordNote = (schoolIndex, keywordName, note) => {
    const newSchools = [...(magic.schools || [])];
    newSchools[schoolIndex].keyword_notes = {
      ...(newSchools[schoolIndex].keyword_notes || {}),
      [keywordName]: note
    };
    updateMagic('schools', newSchools);
  };

  const updateModifierNote = (schoolIndex, modifierName, note) => {
    const newSchools = [...(magic.schools || [])];
    newSchools[schoolIndex].modifier_notes = {
      ...(newSchools[schoolIndex].modifier_notes || {}),
      [modifierName]: note
    };
    updateMagic('schools', newSchools);
  };

  const addCustomKeyword = (schoolIndex) => {
    const newSchools = [...(magic.schools || [])];
    newSchools[schoolIndex].custom_keywords = [
      ...(newSchools[schoolIndex].custom_keywords || []),
      { name: "", description: "" }
    ];
    updateMagic('schools', newSchools);
  };

  const updateCustomKeyword = (schoolIndex, keywordIndex, field, value) => {
    const newSchools = [...(magic.schools || [])];
    newSchools[schoolIndex].custom_keywords[keywordIndex] = {
      ...newSchools[schoolIndex].custom_keywords[keywordIndex],
      [field]: value
    };
    updateMagic('schools', newSchools);
  };

  const removeCustomKeyword = (schoolIndex, keywordIndex) => {
    const newSchools = [...(magic.schools || [])];
    newSchools[schoolIndex].custom_keywords = newSchools[schoolIndex].custom_keywords.filter((_, i) => i !== keywordIndex);
    updateMagic('schools', newSchools);
  };

  const addCustomModifier = (schoolIndex) => {
    const newSchools = [...(magic.schools || [])];
    newSchools[schoolIndex].custom_modifiers = [
      ...(newSchools[schoolIndex].custom_modifiers || []),
      { name: "", description: "" }
    ];
    updateMagic('schools', newSchools);
  };

  const updateCustomModifier = (schoolIndex, modifierIndex, field, value) => {
    const newSchools = [...(magic.schools || [])];
    newSchools[schoolIndex].custom_modifiers[modifierIndex] = {
      ...newSchools[schoolIndex].custom_modifiers[modifierIndex],
      [field]: value
    };
    updateMagic('schools', newSchools);
  };

  const removeCustomModifier = (schoolIndex, modifierIndex) => {
    const newSchools = [...(magic.schools || [])];
    newSchools[schoolIndex].custom_modifiers = newSchools[schoolIndex].custom_modifiers.filter((_, i) => i !== modifierIndex);
    updateMagic('schools', newSchools);
  };

  const addSpell = () => {
    updateMagic('spells', [...(magic.spells || []), {
      name: "",
      school: "",
      mana_cost: 0,
      keywords: [],
      modifiers: [],
      description: "",
      notes: ""
    }]);
  };

  const updateSpell = (index, field, value) => {
    const newSpells = [...(magic.spells || [])];
    newSpells[index] = { ...newSpells[index], [field]: value };
    updateMagic('spells', newSpells);
  };

  const removeSpell = (index) => {
    updateMagic('spells', (magic.spells || []).filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Magic, Ki & Supernatural Powers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Magic Type</Label>
            <Select
              value={magic.type || "None"}
              onValueChange={(value) => updateMagic('type', value)}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAGIC_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">
              Modern Magic (9 schools), Ancient Magic (Holy/Dark/Nature), Meta Magic (Archetypal), Ki (Monks), Psionics (Lies), Shamanism (Void Spirits)
            </p>
          </div>
        </CardContent>
      </Card>

      {magic.type === "Modern Magic" && (
        <Tabs defaultValue="schools" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="schools">Schools & Mana</TabsTrigger>
            <TabsTrigger value="spells">Spells</TabsTrigger>
            <TabsTrigger value="tools">Tools & Contract</TabsTrigger>
          </TabsList>

          <TabsContent value="schools" className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-2 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-100">Mana Stat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Stat Name</Label>
                    <Input
                      value={magic.mana_stat?.name || "Mana"}
                      onChange={(e) => updateMagic('mana_stat', { ...magic.mana_stat, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Mana"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Tier</Label>
                    <Select
                      value={magic.mana_stat?.tier || "Cantrip"}
                      onValueChange={(value) => updateMagic('mana_stat', { ...magic.mana_stat, tier: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cantrip">Cantrip</SelectItem>
                        <SelectItem value="Initiate">Initiate</SelectItem>
                        <SelectItem value="Uncanny">Uncanny</SelectItem>
                        <SelectItem value="Supernatural">Supernatural</SelectItem>
                        <SelectItem value="Epic">Epic</SelectItem>
                        <SelectItem value="Heroic">Heroic</SelectItem>
                        <SelectItem value="Divine">Divine</SelectItem>
                        <SelectItem value="Cosmic">Cosmic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Level</Label>
                    <Select
                      value={magic.mana_stat?.level || "Low"}
                      onValueChange={(value) => updateMagic('mana_stat', { ...magic.mana_stat, level: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Mid">Mid</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Dice Pool</Label>
                    <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 border border-purple-700/50 rounded-md px-3 py-2 h-10 flex items-center">
                      <span className="font-mono text-purple-100 font-semibold text-sm">
                        {(() => {
                          const tier = magic.mana_stat?.tier || "Cantrip";
                          const level = magic.mana_stat?.level || "Low";

                          const diceMap = {
                            "Cantrip": { "Low": 2, "Mid": 4, "High": 6 },
                            "Initiate": { "Low": 4, "Mid": 8, "High": 12 },
                            "Uncanny": { "Low": 16, "Mid": 20, "High": 24 },
                            "Supernatural": { "Low": 30, "Mid": 35, "High": 40 },
                            "Epic": { "Low": 50, "Mid": 60, "High": 70 },
                            "Heroic": { "Low": 80, "Mid": 90, "High": 100 },
                            "Divine": { "Low": 110, "Mid": 120, "High": 130 },
                            "Cosmic": { "Low": 140, "Mid": 150, "High": 160 }
                          };

                          const sidesMap = {
                            "Cantrip": 12,
                            "Initiate": 12,
                            "Uncanny": 12,
                            "Supernatural": 13,
                            "Epic": 14,
                            "Heroic": 15,
                            "Divine": 16,
                            "Cosmic": 17
                          };

                          const dice = diceMap[tier]?.[level] || 4;
                          const sides = sidesMap[tier] || 12;
                          const cappedDice = Math.min(dice, 25);
                          let t = 7;

                          if (dice < 10) {
                            t += 1;
                            if (dice <= 5) t += 1;
                          }

                          if (dice > 25) {
                            t -= Math.floor((dice - 25) / 5);
                          }

                          return `${cappedDice}d${sides} ie12 t${t}`;
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Pool Size</Label>
                    <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border border-blue-700/50 rounded-md px-3 py-2 h-10 flex items-center">
                      <span className="font-mono text-blue-100 font-semibold">
                        {(() => {
                          const tier = magic.mana_stat?.tier || "Cantrip";
                          const level = magic.mana_stat?.level || "Low";

                          const manaPoolMap = {
                            "Cantrip": { "Low": 5, "Mid": 10, "High": 15 },
                            "Initiate": { "Low": 25, "Mid": 35, "High": 45 },
                            "Uncanny": { "Low": 65, "Mid": 85, "High": 105 },
                            "Supernatural": { "Low": 145, "Mid": 185, "High": 225 },
                            "Epic": { "Low": 305, "Mid": 385, "High": 465 },
                            "Heroic": { "Low": 625, "Mid": 785, "High": 945 },
                            "Divine": { "Low": 1265, "Mid": 1585, "High": 1905 },
                            "Cosmic": { "Low": 2545, "Mid": 3185, "High": 3825 }
                          };

                          return manaPoolMap[tier]?.[level] || 0;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Current Mana</Label>
                  <Input
                    type="number"
                    value={magic.mana_stat?.current || magic.mana_stat?.pool_size || 0}
                    onChange={(e) => updateMagic('mana_stat', { ...magic.mana_stat, current: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600 text-xs text-slate-400">
                  <p>5 per Level, doubles per Tier. Modern Magic cap: Supernatural. Ancient Magic cap: Epic.</p>
                  <p className="mt-1"><span className="text-purple-400">Thinning the Veil:</span> Every 50 Mana in area = +1t to checks. +1t lasts 1 min, +2t=1hr, +4t=1day, +6t=1week, +8t=permanent.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex items-center justify-between p-6">
                <CardTitle className="text-amber-100">Magic Schools</CardTitle>
                <Button onClick={addSchool} className="bg-amber-600 hover:bg-amber-700" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add School
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {(magic.schools || []).map((school, schoolIndex) => (
                  <div key={schoolIndex} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-4 space-y-2">
                          <Label className="text-slate-300">School Name</Label>
                          <Select
                            value={school.name}
                            onValueChange={(value) => updateSchool(schoolIndex, 'name', value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select school" />
                            </SelectTrigger>
                            <SelectContent>
                              {MODERN_SCHOOLS.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-3 space-y-2">
                          <Label className="text-slate-300">Skill Rank</Label>
                          <Select
                            value={school.rank}
                            onValueChange={(value) => updateSchool(schoolIndex, 'rank', value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SKILL_RANKS.map(rank => (
                                <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-5 space-y-2">
                          <Label className="text-slate-300">Dice Pool</Label>
                          {calculateSchoolDicePool(school) ? (
                            <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-700/50 rounded-md px-2 py-1.5 flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1 flex-1 min-w-0">
                                <Dices className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                <div className="flex flex-col">
                                  {(() => {
                                    const pool = calculateSchoolDicePool(school);
                                    return (
                                      <>
                                        {pool.wasCapped || pool.wasBuffed || pool.autoSuccesses > 0 ? (
                                          <>
                                            <span className="font-mono text-purple-100 font-semibold text-xs leading-tight">
                                              {pool.cappedDice}d{pool.sides} t{pool.tModifier}
                                              {pool.autoSuccesses > 0 && <span className="text-green-400"> +{pool.autoSuccesses}s</span>}
                                            </span>
                                            <span className="font-mono text-purple-400/60 text-[10px] leading-tight">
                                              (Base: {pool.baseDice}d{pool.sides} t{pool.baseT})
                                            </span>
                                          </>
                                        ) : (
                                          <span className="font-mono text-purple-100 font-semibold text-sm">
                                            {pool.cappedDice}d{pool.sides} t{pool.tModifier}
                                          </span>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const pool = calculateSchoolDicePool(school);
                                  copyDicePool(`${pool.cappedDice}d${pool.sides} ie12 t${pool.tModifier}`);
                                }}
                                className="h-6 w-6 hover:bg-purple-700/30 flex-shrink-0"
                              >
                                {copiedPool === `${calculateSchoolDicePool(school).cappedDice}d${calculateSchoolDicePool(school).sides} ie12 t${calculateSchoolDicePool(school).tModifier}` ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-purple-400" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 h-10 flex items-center">
                              <span className="text-xs text-slate-400">Set Mana stat first</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSchool(schoolIndex)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-xs text-slate-400">
                      +10 dice per rank above Untrained. Novice = 1 Keyword, +1 per rank
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Keywords</Label>
                        <Button
                          onClick={() => {
                            const newSchools = [...(magic.schools || [])];
                            newSchools[schoolIndex].keywords = [
                              ...(newSchools[schoolIndex].keywords || []),
                              ""
                            ];
                            updateMagic('schools', newSchools);
                          }}
                          className="bg-amber-600 hover:bg-amber-700"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Keyword
                        </Button>
                      </div>
                      {school.name && SCHOOL_KEYWORDS[school.name] && (
                        <p className="text-xs text-slate-400">
                          Available: {SCHOOL_KEYWORDS[school.name].join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Keyword Details */}
                    {(school.keywords || []).length > 0 && (
                      <div className="space-y-2">
                        {(school.keywords || []).map((keyword, kIndex) => (
                          <div key={kIndex} className="space-y-2 bg-slate-700/50 p-3 rounded border border-slate-600">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1 space-y-2">
                                <div className="space-y-1">
                                  <Label className="text-xs text-slate-400">Keyword Title</Label>
                                  <Input
                                    value={keyword}
                                    onChange={(e) => {
                                      const newSchools = [...(magic.schools || [])];
                                      newSchools[schoolIndex].keywords[kIndex] = e.target.value;
                                      updateMagic('schools', newSchools);
                                    }}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="e.g., Fire, Water"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-slate-400">Description / Notes</Label>
                                  <Textarea
                                    value={school.keyword_notes?.[keyword] || ""}
                                    onChange={(e) => updateKeywordNote(schoolIndex, keyword, e.target.value)}
                                    className="bg-slate-700 border-slate-600 text-white text-sm"
                                    placeholder="Personal notes and mechanics..."
                                    rows={2}
                                  />
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newSchools = [...(magic.schools || [])];
                                  newSchools[schoolIndex].keywords = newSchools[schoolIndex].keywords.filter((_, i) => i !== kIndex);
                                  updateMagic('schools', newSchools);
                                }}
                                className="text-red-400 h-8 w-8"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}



                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Modifiers</Label>
                        <Button
                          onClick={() => {
                            const newSchools = [...(magic.schools || [])];
                            newSchools[schoolIndex].modifiers = [
                              ...(newSchools[schoolIndex].modifiers || []),
                              ""
                            ];
                            updateMagic('schools', newSchools);
                          }}
                          className="bg-amber-600 hover:bg-amber-700"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Modifier
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400">
                        Limit: [Intellect Levels] total, x3 with Grimoire
                      </p>
                    </div>

                    {/* Modifier Details */}
                    {(school.modifiers || []).length > 0 && (
                      <div className="space-y-2">
                        {(school.modifiers || []).map((modifier, mIndex) => (
                          <div key={mIndex} className="space-y-2 bg-slate-700/50 p-3 rounded border border-slate-600">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1 space-y-2">
                                <div className="space-y-1">
                                  <Label className="text-xs text-slate-400">Modifier Title</Label>
                                  <Input
                                    value={modifier}
                                    onChange={(e) => {
                                      const newSchools = [...(magic.schools || [])];
                                      newSchools[schoolIndex].modifiers[mIndex] = e.target.value;
                                      updateMagic('schools', newSchools);
                                    }}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="e.g., Bolt, Sword, Shield"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-slate-400">Description / Notes</Label>
                                  <Textarea
                                    value={school.modifier_notes?.[modifier] || ""}
                                    onChange={(e) => updateModifierNote(schoolIndex, modifier, e.target.value)}
                                    className="bg-slate-700 border-slate-600 text-white text-sm"
                                    placeholder="Personal notes and mechanics..."
                                    rows={2}
                                  />
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newSchools = [...(magic.schools || [])];
                                  newSchools[schoolIndex].modifiers = newSchools[schoolIndex].modifiers.filter((_, i) => i !== mIndex);
                                  updateMagic('schools', newSchools);
                                }}
                                className="text-red-400 h-8 w-8"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}


                  </div>
                ))}

                {(magic.schools || []).length === 0 && (
                  <p className="text-center py-8 text-slate-400">No magic schools yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spells" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex items-center justify-between p-6">
                <CardTitle className="text-amber-100">Spell List</CardTitle>
                <Button onClick={addSpell} className="bg-amber-600 hover:bg-amber-700" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Spell
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {(magic.spells || []).map((spell, index) => (
                  <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label className="text-slate-300">Spell Name</Label>
                            <Input
                              value={spell.name}
                              onChange={(e) => updateSpell(index, 'name', e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white font-semibold"
                              placeholder="e.g., Fireball, Ice Shield"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-300">School</Label>
                            <Select
                              value={spell.school}
                              onValueChange={(value) => updateSpell(index, 'school', value)}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Select school" />
                              </SelectTrigger>
                              <SelectContent>
                                {(magic.schools || []).map(s => (
                                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-300">Base Mana Cost</Label>
                            <Input
                              type="number"
                              value={spell.mana_cost}
                              onChange={(e) => updateSpell(index, 'mana_cost', parseInt(e.target.value) || 0)}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-slate-300">Keywords (comma-separated)</Label>
                            <Input
                              value={(spell.keywords || []).join(", ")}
                              onChange={(e) => updateSpell(index, 'keywords', e.target.value.split(",").map(k => k.trim()))}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="e.g., Fire, Bolt"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-300">Modifiers (comma-separated)</Label>
                            <Input
                              value={(spell.modifiers || []).join(", ")}
                              onChange={(e) => updateSpell(index, 'modifiers', e.target.value.split(",").map(m => m.trim()))}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="e.g., Bolt, Splash"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Description</Label>
                          <Textarea
                            value={spell.description}
                            onChange={(e) => updateSpell(index, 'description', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="DV, DL, range, effects, MMD..."
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Notes</Label>
                          <Textarea
                            value={spell.notes}
                            onChange={(e) => updateSpell(index, 'notes', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Special conditions, upcasting effects, casting time..."
                            rows={2}
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpell(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {(magic.spells || []).length === 0 && (
                  <p className="text-center py-8 text-slate-400">No spells created yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100">Spell Creation Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-400">
                <p><span className="text-purple-400">Formula:</span> Keyword(s) + Modifier(s) = Spell</p>
                <p><span className="text-purple-400">Mana Cost:</span> Sum of Innate Costs, reduced by casting check successes</p>
                <p><span className="text-purple-400">Upcasting:</span> Increase DL or add effects, costs more Mana</p>
                <p><span className="text-purple-400">Example:</span> Fire + Bolt = Fire Bolt (10 + 5 = 15 base Mana)</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Grimoire / Magical Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-grimoire"
                    checked={magic.grimoire?.has_tool || false}
                    onCheckedChange={(checked) => updateMagic('grimoire', { ...magic.grimoire, has_tool: checked })}
                  />
                  <label htmlFor="has-grimoire" className="text-slate-300">
                    Has Grimoire/Tool (x3 Keywords/Modifiers)
                  </label>
                </div>

                {magic.grimoire?.has_tool && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Tool Type</Label>
                      <Select
                        value={magic.grimoire?.type || ""}
                        onValueChange={(value) => updateMagic('grimoire', { ...magic.grimoire, type: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Grimoire/Spellbook">Grimoire/Spellbook</SelectItem>
                          <SelectItem value="Wand">Wand (low MMD, rapid casting)</SelectItem>
                          <SelectItem value="Staff">Staff (high MMD, powerful casting)</SelectItem>
                          <SelectItem value="Focus/Bling">Focus/Bling (specific magic)</SelectItem>
                          <SelectItem value="Tattoos">Tattoos</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Description</Label>
                      <Textarea
                        value={magic.grimoire?.description || ""}
                        onChange={(e) => updateMagic('grimoire', { ...magic.grimoire, description: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Appearance, properties, MMD bonuses..."
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-amber-100">Void Spirit Contract</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-contract"
                    checked={magic.void_spirit_contract?.has_contract || false}
                    onCheckedChange={(checked) => updateMagic('void_spirit_contract', { ...magic.void_spirit_contract, has_contract: checked })}
                  />
                  <label htmlFor="has-contract" className="text-slate-300">
                    Has Void Spirit Contract (grants Mana)
                  </label>
                </div>

                {magic.void_spirit_contract?.has_contract && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Spirit Name</Label>
                      <Input
                        value={magic.void_spirit_contract?.spirit_name || ""}
                        onChange={(e) => updateMagic('void_spirit_contract', { ...magic.void_spirit_contract, spirit_name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Grade</Label>
                      <Select
                        value={magic.void_spirit_contract?.spirit_grade || ""}
                        onValueChange={(value) => updateMagic('void_spirit_contract', { ...magic.void_spirit_contract, spirit_grade: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="D">D-Grade</SelectItem>
                          <SelectItem value="C">C-Grade</SelectItem>
                          <SelectItem value="B">B-Grade</SelectItem>
                          <SelectItem value="A">A-Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Element</Label>
                      <Input
                        value={magic.void_spirit_contract?.spirit_element || ""}
                        onChange={(e) => updateMagic('void_spirit_contract', { ...magic.void_spirit_contract, spirit_element: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., Fire, Shadow, Time"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-slate-300">Contract Details</Label>
                      <Textarea
                        value={magic.void_spirit_contract?.contract_details || ""}
                        onChange={(e) => updateMagic('void_spirit_contract', { ...magic.void_spirit_contract, contract_details: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Terms, obligations, benefits..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {magic.type === "Ancient Magic" && (
        <Card className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-2 border-yellow-700/50">
          <CardHeader>
            <CardTitle className="text-yellow-100">Ancient Magic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">School</Label>
              <Select
                value={magic.schools?.[0]?.name || ""}
                onValueChange={(value) => updateMagic('schools', [{ name: value, rank: "Novice", keywords: [], modifiers: [] }])}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select ancient school" />
                </SelectTrigger>
                <SelectContent>
                  {ANCIENT_SCHOOLS.map(school => (
                    <SelectItem key={school} value={school}>{school}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-slate-700/30 p-4 rounded border border-slate-600 text-xs text-slate-400 space-y-2">
              <p><span className="font-semibold text-yellow-400">Mana Cap:</span> Epic (instead of Supernatural)</p>
              <p><span className="font-semibold text-yellow-400">Holy:</span> Blessings - smites, healing, consecration, divine judgment</p>
              <p><span className="font-semibold text-yellow-400">Dark:</span> Curses - bad luck, flesh warping, bloodline curses, diseases</p>
              <p><span className="font-semibold text-yellow-400">Nature:</span> Orders - talk to animals, firestorms, transform to beasts, plant growth</p>
              <p><span className="font-semibold text-yellow-400">Costs:</span> Least (15), Lesser (30), Warping (50), Grand (75), Shattering (100), Divine (150)</p>
              <p><span className="font-semibold text-yellow-400">Penalty:</span> +20% cost unless themed/aids school nature</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Mana Pool</Label>
              <Input
                type="number"
                value={magic.mana_stat?.pool_size || 0}
                onChange={(e) => updateMagic('mana_stat', { ...magic.mana_stat, pool_size: parseInt(e.target.value) || 0 })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {magic.type === "Meta Magic" && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border-2 border-violet-700/50">
            <CardHeader>
              <CardTitle className="text-violet-100">Meta Magic (Archetypal)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-violet-900/30 p-4 rounded border border-violet-700/50 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-violet-400">Meta Magic Schools</p>
                <p>Schools considered &quot;meta&quot; are almost always generated via a power or other unnatural means which constrains what kind of spells it has access to. Examples include Pirate Magic, Ninja Magic, etcetera.</p>
                <p className="mt-2">Powers that typically generate such schools are <span className="text-violet-400">Archetypal Mages</span> whose powers do not cleanly fit into any of the standard or ancient schools.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">School Name / Theme</Label>
                <Input
                  value={magic.schools?.[0]?.name || ""}
                  onChange={(e) => updateMagic('schools', [{
                    name: e.target.value,
                    rank: magic.schools?.[0]?.rank || "Novice",
                    keywords: [],
                    modifiers: []
                  }])}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., Pirate Magic, Ninja Magic, Cowboy Magic"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">School Skill Rank</Label>
                <Select
                  value={magic.schools?.[0]?.rank || "Novice"}
                  onValueChange={(value) => {
                    const currentSchool = magic.schools?.[0] || { name: "", keywords: [], modifiers: [] };
                    updateMagic('schools', [{ ...currentSchool, rank: value }]);
                  }}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_RANKS.map(rank => (
                      <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Mana Tier</Label>
                  <Input
                    value={magic.mana_stat?.tier || ""}
                    onChange={(e) => updateMagic('mana_stat', { ...magic.mana_stat, tier: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., Cantrip, Initiate"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Mana Level</Label>
                  <Select
                    value={magic.mana_stat?.level || "Low"}
                    onValueChange={(value) => updateMagic('mana_stat', { ...magic.mana_stat, level: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Mana Pool Size</Label>
                  <Input
                    type="number"
                    value={magic.mana_stat?.pool_size || 0}
                    onChange={(e) => updateMagic('mana_stat', { ...magic.mana_stat, pool_size: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="bg-violet-900/30 p-4 rounded border border-violet-700/50 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-violet-400">Spell Acquisition</p>
                <p>Meta mages <span className="font-semibold">cannot research Modifiers</span> and do not always make spells via Keyword/Modifier combos.</p>
                <p className="mt-2">Instead, <span className="font-semibold">all spells are bought as Abilities</span> at the usual rank cost (D=10 SP, C=20 SP, B=40 SP, A=80 SP, S=160 SP) or come as part of an Ability.</p>
                <p className="mt-2">Spells gained this way still require a <span className="font-semibold">casting roll for Mana cost reduction</span> and can be <span className="font-semibold">Upcast</span> as normal.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex items-center justify-between p-6">
              <CardTitle className="text-amber-100">Meta Magic Spells</CardTitle>
              <Button onClick={addSpell} className="bg-amber-600 hover:bg-amber-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Spell
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(magic.spells || []).map((spell, index) => (
                <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Spell Name</Label>
                          <Input
                            value={spell.name}
                            onChange={(e) => updateSpell(index, 'name', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white font-semibold"
                            placeholder="e.g., Cannonball Barrage"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Ability Rank</Label>
                          <Select
                            value={spell.school || "D"}
                            onValueChange={(value) => updateSpell(index, 'school', value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="D">D-Rank (10 SP)</SelectItem>
                              <SelectItem value="C">C-Rank (20 SP)</SelectItem>
                              <SelectItem value="B">B-Rank (40 SP)</SelectItem>
                              <SelectItem value="A">A-Rank (80 SP)</SelectItem>
                              <SelectItem value="S">S-Rank (160 SP)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Base Mana Cost</Label>
                          <Input
                            type="number"
                            value={spell.mana_cost}
                            onChange={(e) => updateSpell(index, 'mana_cost', parseInt(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Description</Label>
                        <Textarea
                          value={spell.description}
                          onChange={(e) => updateSpell(index, 'description', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="DV, DL, range, effects..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpell(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {(magic.spells || []).length === 0 && (
                <p className="text-center py-8 text-slate-400 text-sm">No spells yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {magic.type === "Ki/Monk" && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-2 border-orange-700/50">
            <CardHeader>
              <CardTitle className="text-orange-100 flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Ki Focus Pool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-900/30 p-4 rounded border border-orange-700/50 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-orange-400">Focus Mechanics</p>
                <p>At start of turn: Auto skill check, fill pool at 1 point per 4 successes. Points don't last longer than a round.</p>
                <p>Outside combat: Gaining Focus takes a Daily Action.</p>
                <p><span className="font-semibold">Alignments:</span> Techniques aligned with user/location are more effective. Unaligned or conflicting ones are weaker or impossible.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Focus Pool Size</Label>
                <Input
                  type="number"
                  value={magic.ki_focus?.pool_size || 0}
                  onChange={(e) => updateMagic('ki_focus', { ...magic.ki_focus, pool_size: parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Based on conditional stat"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Current Focus</Label>
                <Input
                  type="number"
                  value={magic.ki_focus?.current || 0}
                  onChange={(e) => updateMagic('ki_focus', { ...magic.ki_focus, current: parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Alignments</Label>
                  <Button
                    onClick={() => {
                      const alignments = magic.ki_focus?.alignments || [];
                      updateMagic('ki_focus', {
                        ...magic.ki_focus,
                        alignments: [...alignments, { name: "", description: "" }]
                      });
                    }}
                    className="bg-amber-600 hover:bg-amber-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Alignment
                  </Button>
                </div>
                <p className="text-xs text-slate-400">Elements/concepts you're attuned to</p>
                
                {(magic.ki_focus?.alignments || []).map((alignment, index) => (
                  <div key={index} className="bg-slate-700/50 p-3 rounded border border-slate-600 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-400">Alignment Name</Label>
                          <Input
                            value={typeof alignment === 'string' ? alignment : alignment.name || ""}
                            onChange={(e) => {
                              const newAlignments = [...(magic.ki_focus?.alignments || [])];
                              newAlignments[index] = typeof newAlignments[index] === 'string' 
                                ? { name: e.target.value, description: "" }
                                : { ...newAlignments[index], name: e.target.value };
                              updateMagic('ki_focus', { ...magic.ki_focus, alignments: newAlignments });
                            }}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="e.g., Fire, Mountain, Storm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-400">Description</Label>
                          <Textarea
                            value={typeof alignment === 'string' ? "" : alignment.description || ""}
                            onChange={(e) => {
                              const newAlignments = [...(magic.ki_focus?.alignments || [])];
                              newAlignments[index] = typeof newAlignments[index] === 'string'
                                ? { name: newAlignments[index], description: e.target.value }
                                : { ...newAlignments[index], description: e.target.value };
                              updateMagic('ki_focus', { ...magic.ki_focus, alignments: newAlignments });
                            }}
                            className="bg-slate-700 border-slate-600 text-white text-sm"
                            placeholder="How this alignment manifests in your techniques..."
                            rows={2}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          updateMagic('ki_focus', {
                            ...magic.ki_focus,
                            alignments: (magic.ki_focus?.alignments || []).filter((_, i) => i !== index)
                          });
                        }}
                        className="text-red-400 h-8 w-8"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex items-center justify-between p-6">
              <CardTitle className="text-amber-100">Ki Techniques</CardTitle>
              <Button
                onClick={() => {
                  updateMagic('ki_focus', {
                    ...magic.ki_focus,
                    techniques: [...(magic.ki_focus?.techniques || []), {
                      name: "",
                      rank: "D",
                      cost: 0,
                      alignment: "",
                      description: ""
                    }]
                  });
                }}
                className="bg-amber-600 hover:bg-amber-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Technique
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(magic.ki_focus?.techniques || []).map((technique, index) => (
                <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="grid md:grid-cols-4 gap-3">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Technique Name</Label>
                          <Input
                            value={technique.name}
                            onChange={(e) => {
                              const newTechniques = [...(magic.ki_focus?.techniques || [])];
                              newTechniques[index] = { ...newTechniques[index], name: e.target.value };
                              updateMagic('ki_focus', { ...magic.ki_focus, techniques: newTechniques });
                            }}
                            className="bg-slate-700 border-slate-600 text-white font-semibold"
                            placeholder="e.g., Iron Fist Strike"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Rank</Label>
                          <Select
                            value={technique.rank}
                            onValueChange={(value) => {
                              const newTechniques = [...(magic.ki_focus?.techniques || [])];
                              newTechniques[index] = { ...newTechniques[index], rank: value };
                              updateMagic('ki_focus', { ...magic.ki_focus, techniques: newTechniques });
                            }}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="D">D (10 SP)</SelectItem>
                              <SelectItem value="C">C (20 SP)</SelectItem>
                              <SelectItem value="B">B (40 SP)</SelectItem>
                              <SelectItem value="A">A (80 SP)</SelectItem>
                              <SelectItem value="S">S (160 SP)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Focus Cost</Label>
                          <Input
                            type="number"
                            value={technique.cost}
                            onChange={(e) => {
                              const newTechniques = [...(magic.ki_focus?.techniques || [])];
                              newTechniques[index] = { ...newTechniques[index], cost: parseInt(e.target.value) || 0 };
                              updateMagic('ki_focus', { ...magic.ki_focus, techniques: newTechniques });
                            }}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Alignment</Label>
                          <Input
                            value={technique.alignment}
                            onChange={(e) => {
                              const newTechniques = [...(magic.ki_focus?.techniques || [])];
                              newTechniques[index] = { ...newTechniques[index], alignment: e.target.value };
                              updateMagic('ki_focus', { ...magic.ki_focus, techniques: newTechniques });
                            }}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Fire, Neutral, etc"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Description & Effects</Label>
                        <Textarea
                          value={technique.description}
                          onChange={(e) => {
                            const newTechniques = [...(magic.ki_focus?.techniques || [])];
                            newTechniques[index] = { ...newTechniques[index], description: e.target.value };
                            updateMagic('ki_focus', { ...magic.ki_focus, techniques: newTechniques });
                          }}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Technique effects, mechanics, DV, DL, range..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        updateMagic('ki_focus', {
                          ...magic.ki_focus,
                          techniques: (magic.ki_focus?.techniques || []).filter((_, i) => i !== index)
                        });
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {(magic.ki_focus?.techniques || []).length === 0 && (
                <p className="text-center py-8 text-slate-400 text-sm">No techniques yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {magic.type === "Psionics" && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-2 border-indigo-700/50">
            <CardHeader>
              <CardTitle className="text-indigo-100 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Psy Rating & Cognition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-indigo-900/30 p-4 rounded border border-indigo-700/50 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-indigo-400">Psionics Isn't Real - It's Lies</p>
                <p>Psy Rating grants 5 Cognition per point. Every sapient mind within 100ft per PR produces Cognition = highest mental stat.</p>
                <p>Spend action to drain up to PR amount. Cognition doesn't restore until Reset. Minds with PR don't produce Cognition.</p>
                <p><span className="font-semibold text-red-400">Fleeting Falsehoods:</span> Lose (half PR) Cognition per round without Lies/draining.</p>
                <p><span className="font-semibold text-red-400">Psychic Struggles:</span> Two Psions can drain each other's Cognition pools.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Psy Rating</Label>
                  <Input
                    type="number"
                    value={magic.psionics?.psy_rating || 0}
                    onChange={(e) => updateMagic('psionics', { ...magic.psionics, psy_rating: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400">Capped at highest mental stat</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Cognition Pool</Label>
                  <div className="bg-gradient-to-r from-indigo-900/50 to-indigo-800/50 border border-indigo-700/50 rounded-md px-3 py-2 h-10 flex items-center">
                    <span className="font-mono text-indigo-100 font-semibold">
                      {(magic.psionics?.psy_rating || 0) * 5}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">5 per Psy Rating</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Current Cognition</Label>
                <Input
                  type="number"
                  value={magic.psionics?.current_cognition || 0}
                  onChange={(e) => updateMagic('psionics', { ...magic.psionics, current_cognition: parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex items-center justify-between p-6">
              <div>
                <CardTitle className="text-amber-100">Lies</CardTitle>
                <p className="text-sm text-slate-400 mt-1">
                  {(magic.psionics?.lies || []).length} / {magic.psionics?.psy_rating || 0} lies (Psy Rating limit)
                </p>
              </div>
              <Button
                onClick={() => {
                  updateMagic('psionics', {
                    ...magic.psionics,
                    lies: [...(magic.psionics?.lies || []), {
                      name: "",
                      cost: "",
                      description: ""
                    }]
                  });
                }}
                className="bg-amber-600 hover:bg-amber-700"
                size="sm"
                disabled={(magic.psionics?.lies || []).length >= (magic.psionics?.psy_rating || 0)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Lie
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-indigo-900/20 p-3 rounded border border-indigo-700/30 text-xs text-slate-400">
                <p><span className="font-semibold text-indigo-400">First Lie:</span> Free with unlocking power</p>
                <p><span className="font-semibold text-indigo-400">Additional Lies:</span> 5 SP, +5 SP per Lie after (10 SP for 2nd, 15 SP for 3rd, etc)</p>
                <p className="mt-2"><span className="font-semibold text-indigo-400">Rule:</span> Lies can only affect directly observable things, not abstract concepts. Cannot permanently change the world directly.</p>
              </div>

              {(magic.psionics?.lies || []).map((lie, index) => (
                <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Lie Name / Statement</Label>
                          <Input
                            value={lie.name}
                            onChange={(e) => {
                              const newLies = [...(magic.psionics?.lies || [])];
                              newLies[index] = { ...newLies[index], name: e.target.value };
                              updateMagic('psionics', { ...magic.psionics, lies: newLies });
                            }}
                            className="bg-slate-700 border-slate-600 text-white font-semibold"
                            placeholder='e.g., "I Am Invincible", "You Are Dead"'
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Cognition Cost</Label>
                          <Input
                            value={lie.cost}
                            onChange={(e) => {
                              const newLies = [...(magic.psionics?.lies || [])];
                              newLies[index] = { ...newLies[index], cost: e.target.value };
                              updateMagic('psionics', { ...magic.psionics, lies: newLies });
                            }}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="e.g., 5, Variable, DV x2"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Effects & Mechanics</Label>
                        <Textarea
                          value={lie.description}
                          onChange={(e) => {
                            const newLies = [...(magic.psionics?.lies || [])];
                            newLies[index] = { ...newLies[index], description: e.target.value };
                            updateMagic('psionics', { ...magic.psionics, lies: newLies });
                          }}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Single sentence declaring a fact of reality + mechanical effects..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        updateMagic('psionics', {
                          ...magic.psionics,
                          lies: (magic.psionics?.lies || []).filter((_, i) => i !== index)
                        });
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {(magic.psionics?.lies || []).length === 0 && (
                <p className="text-center py-8 text-slate-400 text-sm">No lies yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {magic.type === "Shamanism" && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border-2 border-green-700/50">
            <CardHeader>
              <CardTitle className="text-green-100">Elemental Bond</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-900/30 p-4 rounded border border-green-700/50 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-green-400">Void Spirit Connection</p>
                <p>Bond with Elemental-phase Void Spirit grants Shamanic powers.</p>
                <p><span className="font-semibold">Dedication Pool:</span> [Willpower Levels] rounds per Reset, scales as Elemental Conditional. Each active Dedication drains 1/round.</p>
                <p><span className="font-semibold">Markings:</span> Max [Will/Cha Tiers] active at once, swap as Craft action.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Bonded Elemental</Label>
                  <Input
                    value={magic.shamanism?.bonded_elemental || ""}
                    onChange={(e) => updateMagic('shamanism', { ...magic.shamanism, bonded_elemental: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., Fire, Water, Storm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Elemental Phase</Label>
                  <Input
                    value={magic.shamanism?.elemental_phase || ""}
                    onChange={(e) => updateMagic('shamanism', { ...magic.shamanism, elemental_phase: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., Lesser, Greater, Grand"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Dedication Pool</Label>
                  <Input
                    type="number"
                    value={magic.shamanism?.dedication_pool || 0}
                    onChange={(e) => updateMagic('shamanism', { ...magic.shamanism, dedication_pool: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Willpower Levels"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="blessings" className="space-y-6">
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="blessings">Blessings</TabsTrigger>
              <TabsTrigger value="constructs">Constructs</TabsTrigger>
              <TabsTrigger value="wrath">Wrath Abilities</TabsTrigger>
            </TabsList>

            <TabsContent value="blessings" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex items-center justify-between p-6">
                  <CardTitle className="text-amber-100">Dedications (True Blessings)</CardTitle>
                  <Button
                    onClick={() => {
                      updateMagic('shamanism', {
                        ...magic.shamanism,
                        blessings: [...(magic.shamanism?.blessings || []), {
                          name: "",
                          type: "Dedication",
                          description: "",
                          cost: 1
                        }]
                      });
                    }}
                    className="bg-amber-600 hover:bg-amber-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Dedication
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-slate-400">Powerful temporary benefits. Each active Dedication drains 1 round from Dedication Pool per round.</p>

                  {(magic.shamanism?.blessings || []).filter(b => b.type === "Dedication").map((blessing, index) => (
                    <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-slate-300">Dedication Name</Label>
                              <Input
                                value={blessing.name}
                                onChange={(e) => {
                                  const newBlessings = [...(magic.shamanism?.blessings || [])];
                                  const blessingIdx = newBlessings.indexOf(blessing);
                                  newBlessings[blessingIdx] = { ...newBlessings[blessingIdx], name: e.target.value };
                                  updateMagic('shamanism', { ...magic.shamanism, blessings: newBlessings });
                                }}
                                className="bg-slate-700 border-slate-600 text-white font-semibold"
                                placeholder="e.g., Wings of Air, Barrier of Water"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-slate-300">Pool Drain/Round</Label>
                              <Input
                                type="number"
                                value={blessing.cost}
                                onChange={(e) => {
                                  const newBlessings = [...(magic.shamanism?.blessings || [])];
                                  const blessingIdx = newBlessings.indexOf(blessing);
                                  newBlessings[blessingIdx] = { ...newBlessings[blessingIdx], cost: parseInt(e.target.value) || 1 };
                                  updateMagic('shamanism', { ...magic.shamanism, blessings: newBlessings });
                                }}
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-300">Effects</Label>
                            <Textarea
                              value={blessing.description}
                              onChange={(e) => {
                                const newBlessings = [...(magic.shamanism?.blessings || [])];
                                const blessingIdx = newBlessings.indexOf(blessing);
                                newBlessings[blessingIdx] = { ...newBlessings[blessingIdx], description: e.target.value };
                                updateMagic('shamanism', { ...magic.shamanism, blessings: newBlessings });
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Temporary benefits, stat boosts, elemental powers..."
                              rows={2}
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            updateMagic('shamanism', {
                              ...magic.shamanism,
                              blessings: (magic.shamanism?.blessings || []).filter(b => b !== blessing)
                            });
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {(magic.shamanism?.blessings || []).filter(b => b.type === "Dedication").length === 0 && (
                    <p className="text-center py-8 text-slate-400 text-sm">No dedications yet</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex items-center justify-between p-6">
                  <CardTitle className="text-amber-100">Markings</CardTitle>
                  <Button
                    onClick={() => {
                      updateMagic('shamanism', {
                        ...magic.shamanism,
                        blessings: [...(magic.shamanism?.blessings || []), {
                          name: "",
                          type: "Marking",
                          description: "",
                          cost: 0
                        }]
                      });
                    }}
                    className="bg-amber-600 hover:bg-amber-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Marking
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-slate-400">Semi-permanent alterations with minor benefits. Max [Will/Cha Tiers] active at once.</p>

                  {(magic.shamanism?.blessings || []).filter(b => b.type === "Marking").map((blessing, index) => (
                    <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="space-y-2">
                            <Label className="text-slate-300">Marking Name</Label>
                            <Input
                              value={blessing.name}
                              onChange={(e) => {
                                const newBlessings = [...(magic.shamanism?.blessings || [])];
                                const blessingIdx = newBlessings.indexOf(blessing);
                                newBlessings[blessingIdx] = { ...newBlessings[blessingIdx], name: e.target.value };
                                updateMagic('shamanism', { ...magic.shamanism, blessings: newBlessings });
                              }}
                              className="bg-slate-700 border-slate-600 text-white font-semibold"
                              placeholder="e.g., Mark of Flame, Seal of Stone"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-300">Benefits & Bonuses</Label>
                            <Textarea
                              value={blessing.description}
                              onChange={(e) => {
                                const newBlessings = [...(magic.shamanism?.blessings || [])];
                                const blessingIdx = newBlessings.indexOf(blessing);
                                newBlessings[blessingIdx] = { ...newBlessings[blessingIdx], description: e.target.value };
                                updateMagic('shamanism', { ...magic.shamanism, blessings: newBlessings });
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Minor stat boosts, passive abilities..."
                              rows={2}
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            updateMagic('shamanism', {
                              ...magic.shamanism,
                              blessings: (magic.shamanism?.blessings || []).filter(b => b !== blessing)
                            });
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {(magic.shamanism?.blessings || []).filter(b => b.type === "Marking").length === 0 && (
                    <p className="text-center py-8 text-slate-400 text-sm">No markings yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="constructs" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex items-center justify-between p-6">
                  <CardTitle className="text-amber-100">Elemental Constructs</CardTitle>
                  <Button
                    onClick={() => {
                      updateMagic('shamanism', {
                        ...magic.shamanism,
                        constructs: [...(magic.shamanism?.constructs || []), {
                          name: "",
                          type: "Ephemeral",
                          description: ""
                        }]
                      });
                    }}
                    className="bg-amber-600 hover:bg-amber-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Construct
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-700/30 p-2 rounded border border-slate-600">
                      <p className="font-semibold text-slate-300">Ephemeral</p>
                      <p className="text-slate-400">Temporary, single-check</p>
                    </div>
                    <div className="bg-slate-700/30 p-2 rounded border border-slate-600">
                      <p className="font-semibold text-slate-300">Concrete</p>
                      <p className="text-slate-400">Solid, permanent tools</p>
                    </div>
                    <div className="bg-slate-700/30 p-2 rounded border border-slate-600">
                      <p className="font-semibold text-slate-300">Animate</p>
                      <p className="text-slate-400">Semi/fully autonomous</p>
                    </div>
                  </div>

                  {(magic.shamanism?.constructs || []).map((construct, index) => (
                    <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-slate-300">Construct Name</Label>
                              <Input
                                value={construct.name}
                                onChange={(e) => {
                                  const newConstructs = [...(magic.shamanism?.constructs || [])];
                                  newConstructs[index] = { ...newConstructs[index], name: e.target.value };
                                  updateMagic('shamanism', { ...magic.shamanism, constructs: newConstructs });
                                }}
                                className="bg-slate-700 border-slate-600 text-white font-semibold"
                                placeholder="e.g., Flame Weapon, Stone Guardian"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-slate-300">Type</Label>
                              <Select
                                value={construct.type}
                                onValueChange={(value) => {
                                  const newConstructs = [...(magic.shamanism?.constructs || [])];
                                  newConstructs[index] = { ...newConstructs[index], type: value };
                                  updateMagic('shamanism', { ...magic.shamanism, constructs: newConstructs });
                                }}
                              >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Ephemeral">Ephemeral</SelectItem>
                                  <SelectItem value="Concrete">Concrete</SelectItem>
                                  <SelectItem value="Animate">Animate</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-300">Description & Properties</Label>
                            <Textarea
                              value={construct.description}
                              onChange={(e) => {
                                const newConstructs = [...(magic.shamanism?.constructs || [])];
                                newConstructs[index] = { ...newConstructs[index], description: e.target.value };
                                updateMagic('shamanism', { ...magic.shamanism, constructs: newConstructs });
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Form, abilities, stats, duration..."
                              rows={2}
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            updateMagic('shamanism', {
                              ...magic.shamanism,
                              constructs: (magic.shamanism?.constructs || []).filter((_, i) => i !== index)
                            });
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {(magic.shamanism?.constructs || []).length === 0 && (
                    <p className="text-center py-8 text-slate-400 text-sm">No constructs yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wrath" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex items-center justify-between p-6">
                  <CardTitle className="text-amber-100">Wrath Abilities</CardTitle>
                  <Button
                    onClick={() => {
                      updateMagic('shamanism', {
                        ...magic.shamanism,
                        wrath_abilities: [...(magic.shamanism?.wrath_abilities || []), {
                          name: "",
                          condition: "",
                          description: ""
                        }]
                      });
                    }}
                    className="bg-amber-600 hover:bg-amber-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Wrath
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-slate-400">Unlocked by meeting conditions with Blessings. Uses Psyche rules with Charisma or Willpower dice.</p>

                  {(magic.shamanism?.wrath_abilities || []).map((wrath, index) => (
                    <div key={index} className="bg-red-900/20 p-4 rounded-lg border-2 border-red-700/50 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-slate-300">Wrath Name</Label>
                              <Input
                                value={wrath.name}
                                onChange={(e) => {
                                  const newWraths = [...(magic.shamanism?.wrath_abilities || [])];
                                  newWraths[index] = { ...newWraths[index], name: e.target.value };
                                  updateMagic('shamanism', { ...magic.shamanism, wrath_abilities: newWraths });
                                }}
                                className="bg-slate-700 border-slate-600 text-white font-semibold"
                                placeholder="e.g., Inferno's Rage, Tidal Fury"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-slate-300">Unlock Condition</Label>
                              <Input
                                value={wrath.condition}
                                onChange={(e) => {
                                  const newWraths = [...(magic.shamanism?.wrath_abilities || [])];
                                  newWraths[index] = { ...newWraths[index], condition: e.target.value };
                                  updateMagic('shamanism', { ...magic.shamanism, wrath_abilities: newWraths });
                                }}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder="e.g., Use Wings 10+ times in combat"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-300">Wrath Effects</Label>
                            <Textarea
                              value={wrath.description}
                              onChange={(e) => {
                                const newWraths = [...(magic.shamanism?.wrath_abilities || [])];
                                newWraths[index] = { ...newWraths[index], description: e.target.value };
                                updateMagic('shamanism', { ...magic.shamanism, wrath_abilities: newWraths });
                              }}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Powerful abilities using Psyche rules with Cha/Will dice..."
                              rows={3}
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            updateMagic('shamanism', {
                              ...magic.shamanism,
                              wrath_abilities: (magic.shamanism?.wrath_abilities || []).filter((_, i) => i !== index)
                            });
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {(magic.shamanism?.wrath_abilities || []).length === 0 && (
                    <p className="text-center py-8 text-slate-400 text-sm">No wrath abilities yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {magic.type !== "None" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-amber-100">Notes & Additional Info</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={magic.notes || ""}
              onChange={(e) => updateMagic('notes', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
              placeholder="Additional magic notes, special interactions, unique mechanics, teacher info..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}