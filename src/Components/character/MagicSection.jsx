import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Plus, Trash2, Sparkles, Flame, Zap, BookOpen, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const MAGIC_TYPES = ["None", "Modern Magic", "Ancient Magic", "Meta Magic", "Ki/Monk", "Psionics", "Shamanism"];
const MODERN_SCHOOLS = ["Elementalism", "Force", "Clairvoyance", "Necromancy", "Transmutation", "Biomancy", "Dimensionalism", "Psychic", "Conjuration"];
const ANCIENT_SCHOOLS = ["Holy Magic", "Dark Magic", "Nature Magic"];
const SKILL_RANKS = ["Untrained", "Novice", "Journeyman", "Adept", "Expert", "Master", "Legend", "Mythological"];

const SCHOOL_KEYWORDS = {
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

const COMMON_MODIFIERS = [
  "Armor", "Axe", "Ball", "Bolt", "Boost", "Bow", "Club/Stave", "Dagger", "Destroy", "Drain",
  "Enchant", "Form", "Great Sword", "Grow", "Halberd", "Hammer", "Imbue", "Infuse",
  "Knuckle Dusters/Spiked Boots", "Portal", "Scythe", "Shield", "Spear", "Sense", "Sword",
  "Thrusting Sword", "Warp/Shape", "Wave", "Whip"
];

export default function MagicSection({ character, setCharacter }) {
  const magic = character.magic || { type: "None" };

  const updateMagic = (field, value) => {
    setCharacter({
      ...character,
      magic: { ...magic, [field]: value }
    });
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
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Tier</Label>
                    <Input
                      value={magic.mana_stat?.tier || ""}
                      onChange={(e) => updateMagic('mana_stat', { ...magic.mana_stat, tier: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., Cantrip, Initiate"
                    />
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
                    <Label className="text-slate-300">Pool Size</Label>
                    <Input
                      type="number"
                      value={magic.mana_stat?.pool_size || 0}
                      onChange={(e) => updateMagic('mana_stat', { ...magic.mana_stat, pool_size: parseInt(e.target.value) || 0 })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
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
                </div>
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600 text-xs text-slate-400">
                  <p>5 per Level, doubles per Tier. Modern Magic cap: Supernatural. Ancient Magic cap: Epic.</p>
                  <p className="mt-1"><span className="text-purple-400">Thinning the Veil:</span> Every 50 Mana in area = +1t to checks. +1t lasts 1 min, +2t=1hr, +4t=1day, +6t=1week, +8t=permanent.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
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
                      <div className="flex-1 grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
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

                        <div className="space-y-2">
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
                          <p className="text-xs text-slate-400">
                            +10 dice per tier. Novice = 1 Keyword, +1 per rank
                          </p>
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

                    <div className="space-y-2">
                      <Label className="text-slate-300">Keywords (comma-separated)</Label>
                      <Input
                        value={(school.keywords || []).join(", ")}
                        onChange={(e) => updateSchool(schoolIndex, 'keywords', e.target.value.split(",").map(k => k.trim()).filter(k => k))}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., Fire, Water, Lightning"
                      />
                      {school.name && SCHOOL_KEYWORDS[school.name] && (
                        <p className="text-xs text-slate-400">
                          Available: {SCHOOL_KEYWORDS[school.name].join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Keyword Descriptions */}
                    {(school.keywords || []).length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-slate-300">Keyword Notes / Descriptions</Label>
                        {(school.keywords || []).map((keyword, kIndex) => (
                          <div key={kIndex} className="space-y-1">
                            <Label className="text-xs text-slate-400">{keyword}</Label>
                            <Textarea
                              value={school.keyword_notes?.[keyword] || ""}
                              onChange={(e) => updateKeywordNote(schoolIndex, keyword, e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white text-sm"
                              placeholder={`Notes for ${keyword} keyword (Innate Cost, DL, damage type, effects...)...`}
                              rows={2}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Custom Keywords</Label>
                        <Button
                          onClick={() => addCustomKeyword(schoolIndex)}
                          variant="outline"
                          size="sm"
                          className="bg-slate-700 border-slate-600 h-7"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Custom
                        </Button>
                      </div>
                      {(school.custom_keywords || []).map((keyword, kIndex) => (
                        <div key={kIndex} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div className="flex-1 space-y-2">
                              <div className="space-y-1">
                                <Label className="text-xs text-slate-400">Keyword Name</Label>
                                <Input
                                  value={keyword.name}
                                  onChange={(e) => updateCustomKeyword(schoolIndex, kIndex, 'name', e.target.value)}
                                  className="bg-slate-700 border-slate-600 text-white"
                                  placeholder="e.g., Custom Element"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-slate-400">Description & Mechanics</Label>
                                <Textarea
                                  value={keyword.description}
                                  onChange={(e) => updateCustomKeyword(schoolIndex, kIndex, 'description', e.target.value)}
                                  className="bg-slate-700 border-slate-600 text-white text-sm"
                                  placeholder="Innate Cost, Base DL, damage type, effects..."
                                  rows={2}
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCustomKeyword(schoolIndex, kIndex)}
                              className="text-red-400 h-8 w-8"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Modifiers (comma-separated)</Label>
                      <Input
                        value={(school.modifiers || []).join(", ")}
                        onChange={(e) => updateSchool(schoolIndex, 'modifiers', e.target.value.split(",").map(m => m.trim()).filter(m => m))}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., Bolt, Sword, Shield"
                      />
                      <p className="text-xs text-slate-400">
                        Common: {COMMON_MODIFIERS.slice(0, 10).join(", ")}...
                      </p>
                      <p className="text-xs text-slate-400">
                        Limit: [Intellect Levels] total, x3 with Grimoire
                      </p>
                    </div>

                    {/* Modifier Descriptions */}
                    {(school.modifiers || []).length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-slate-300">Modifier Notes / Descriptions</Label>
                        {(school.modifiers || []).map((modifier, mIndex) => (
                          <div key={mIndex} className="space-y-1">
                            <Label className="text-xs text-slate-400">{modifier}</Label>
                            <Textarea
                              value={school.modifier_notes?.[modifier] || ""}
                              onChange={(e) => updateModifierNote(schoolIndex, modifier, e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white text-sm"
                              placeholder={`Notes for ${modifier} modifier (Innate Cost, DL mod, range, MMD, duration...)...`}
                              rows={2}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Custom Modifiers</Label>
                        <Button
                          onClick={() => addCustomModifier(schoolIndex)}
                          variant="outline"
                          size="sm"
                          className="bg-slate-700 border-slate-600 h-7"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Custom
                        </Button>
                      </div>
                      {(school.custom_modifiers || []).map((modifier, mIndex) => (
                        <div key={mIndex} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div className="flex-1 space-y-2">
                              <div className="space-y-1">
                                <Label className="text-xs text-slate-400">Modifier Name</Label>
                                <Input
                                  value={modifier.name}
                                  onChange={(e) => updateCustomModifier(schoolIndex, mIndex, 'name', e.target.value)}
                                  className="bg-slate-700 border-slate-600 text-white"
                                  placeholder="e.g., Custom Attack"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-slate-400">Description & Mechanics</Label>
                                <Textarea
                                  value={modifier.description}
                                  onChange={(e) => updateCustomModifier(schoolIndex, mIndex, 'description', e.target.value)}
                                  className="bg-slate-700 border-slate-600 text-white text-sm"
                                  placeholder="Innate Cost, DL modification, range, MMD, duration..."
                                  rows={2}
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCustomModifier(schoolIndex, mIndex)}
                              className="text-red-400 h-8 w-8"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
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
              <CardHeader className="flex flex-row items-center justify-between">
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
            <CardHeader className="flex flex-row items-center justify-between">
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
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-amber-100">Ki/Monk (placeholder)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Ki/Monk section - full implementation coming soon</p>
          </CardContent>
        </Card>
      )}

      {magic.type === "Psionics" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-amber-100">Psionics (placeholder)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Psionics section - full implementation coming soon</p>
          </CardContent>
        </Card>
      )}

      {magic.type === "Shamanism" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-amber-100">Shamanism (placeholder)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Shamanism section - full implementation coming soon</p>
          </CardContent>
        </Card>
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