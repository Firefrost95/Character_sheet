import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Sparkles, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MagicSection from "./MagicSection";
import SparkSection from "./SparkSection";
import { ABILITY_RANKS, ABILITY_RANK_COSTS } from "@/components/gameConstants";

export default function PowersSection({ character, setCharacter }) {
  const addPower = () => {
    setCharacter({
      ...character,
      powers: [...(character.powers || []), {
        name: "",
        passive_bonuses: "",
        typing: "",
        rank_cap: "C",
        d_rank_abilities: [],
        c_rank_abilities: [],
        b_rank_abilities: [],
        a_rank_abilities: [],
        s_rank_abilities: []
      }]
    });
  };

  const updatePower = (index, field, value) => {
    const newPowers = [...(character.powers || [])];
    newPowers[index] = { ...newPowers[index], [field]: value };
    setCharacter({ ...character, powers: newPowers });
  };

  const removePower = (index) => {
    setCharacter({
      ...character,
      powers: (character.powers || []).filter((_, i) => i !== index)
    });
  };

  const addAbility = (powerIndex, rank) => {
    const newPowers = [...(character.powers || [])];
    const rankKey = `${rank.toLowerCase()}_rank_abilities`;
    newPowers[powerIndex][rankKey] = [...(newPowers[powerIndex][rankKey] || []), {
      name: "",
      description: "",
      status: "Complete"
    }];
    setCharacter({ ...character, powers: newPowers });
  };

  const updateAbility = (powerIndex, rank, abilityIndex, field, value) => {
    const newPowers = [...(character.powers || [])];
    const rankKey = `${rank.toLowerCase()}_rank_abilities`;
    newPowers[powerIndex][rankKey][abilityIndex] = {
      ...newPowers[powerIndex][rankKey][abilityIndex],
      [field]: value
    };
    setCharacter({ ...character, powers: newPowers });
  };

  const removeAbility = (powerIndex, rank, abilityIndex) => {
    const newPowers = [...(character.powers || [])];
    const rankKey = `${rank.toLowerCase()}_rank_abilities`;
    newPowers[powerIndex][rankKey] = newPowers[powerIndex][rankKey].filter((_, i) => i !== abilityIndex);
    setCharacter({ ...character, powers: newPowers });
  };

  const getRankCost = (rank) => {
    return ABILITY_RANK_COSTS[rank] || 0;
  };

  return (
    <Tabs defaultValue="powers" className="space-y-6">
      <TabsList className="bg-slate-800 border border-slate-700">
        <TabsTrigger value="powers">Powers & Abilities</TabsTrigger>
        <TabsTrigger value="spark">Spark Projects</TabsTrigger>
        <TabsTrigger value="magic">Magic / Ki / Psionics</TabsTrigger>
      </TabsList>

      <TabsContent value="powers">
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-amber-100">Powers & Abilities</CardTitle>
              <Button
                onClick={addPower}
                className="bg-amber-600 hover:bg-amber-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Power
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {(character.powers || []).map((power, powerIndex) => (
                <div key={powerIndex} className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-lg border-2 border-purple-700/50 space-y-6">
                  {/* Power Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300 text-lg">POWER NAME</Label>
                        <Input
                          value={power.name}
                          onChange={(e) => updatePower(powerIndex, 'name', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white text-lg font-semibold"
                          placeholder="e.g., RISEN GENIUS BRUISER KNIGHT"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePower(powerIndex)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Passive Bonuses */}
                  <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <Label className="text-amber-400 font-semibold">Passive Bonuses</Label>
                    </div>
                    <Textarea
                      value={power.passive_bonuses}
                      onChange={(e) => updatePower(powerIndex, 'passive_bonuses', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                      placeholder="e.g., Low Uncanny Strength, Mid Uncanny Intellect, High Mortal Willpower, Concept (Strength), 4 Aspects"
                      rows={3}
                    />
                    <p className="text-xs text-slate-400">List stat bonuses, caps, aspects, conditional stats, etc.</p>
                  </div>

                  {/* Typing */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Typing</Label>
                      <Input
                        value={power.typing}
                        onChange={(e) => updatePower(powerIndex, 'typing', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., Maestro/Archetype/Spark, Elementalist"
                      />
                      <p className="text-xs text-slate-400">Power categories (most to least relevant)</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Ability Rank Cap</Label>
                      <Select
                        value={power.rank_cap || "C"}
                        onValueChange={(value) => updatePower(powerIndex, 'rank_cap', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ABILITY_RANKS.map(rank => (
                            <SelectItem key={rank} value={rank}>
                              {rank}-Rank ({getRankCost(rank)} SP)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Abilities by Rank */}
                  {["D", "C", "B", "A", "S"].map((rank) => {
                    const rankKey = `${rank.toLowerCase()}_rank_abilities`;
                    const abilities = power[rankKey] || [];
                    const isAboveRankCap = ABILITY_RANKS.indexOf(rank) > ABILITY_RANKS.indexOf(power.rank_cap || "C");

                    return (
                      <div key={rank} className={`space-y-3 ${isAboveRankCap ? 'opacity-50' : ''}`}>
                        <div className="flex items-center justify-between bg-slate-800/70 p-3 rounded-lg border border-slate-600">
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-purple-400" />
                            <Label className="text-purple-300 font-bold text-lg">
                              {rank}-Rank Abilities ({getRankCost(rank)} SP each)
                            </Label>
                          </div>
                          <Button
                            onClick={() => addAbility(powerIndex, rank)}
                            className="bg-amber-600 hover:bg-amber-700"
                            size="sm"
                            disabled={isAboveRankCap}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add {rank}-Rank
                          </Button>
                        </div>

                        {abilities.map((ability, abilityIndex) => (
                          <div key={abilityIndex} className="bg-slate-700/40 p-4 rounded-lg border border-slate-600 space-y-3">
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex-1 space-y-3">
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-slate-300">Ability Name</Label>
                                    <Input
                                      value={ability.name}
                                      onChange={(e) => updateAbility(powerIndex, rank, abilityIndex, 'name', e.target.value)}
                                      className="bg-slate-700 border-slate-600 text-white font-semibold"
                                      placeholder="e.g., Absolutely Batman, Heat Haze"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-slate-300">Status</Label>
                                    <Select
                                      value={ability.status || "Complete"}
                                      onValueChange={(value) => updateAbility(powerIndex, rank, abilityIndex, 'status', value)}
                                    >
                                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Complete">Complete</SelectItem>
                                        <SelectItem value="Incomplete">Incomplete</SelectItem>
                                        <SelectItem value="Flawed">Flawed (Half Cost)</SelectItem>
                                        <SelectItem value="Broken">Broken (Debt)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-slate-300">Description & Mechanics</Label>
                                  <Textarea
                                    value={ability.description}
                                    onChange={(e) => updateAbility(powerIndex, rank, abilityIndex, 'description', e.target.value)}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="Detailed description of what the ability does, mechanics, DL/DV, range, etc..."
                                    rows={4}
                                  />
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAbility(powerIndex, rank, abilityIndex)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {abilities.length === 0 && !isAboveRankCap && (
                          <p className="text-center py-4 text-slate-500 text-sm">No {rank}-Rank abilities yet</p>
                        )}

                        {isAboveRankCap && (
                          <p className="text-center py-2 text-slate-500 text-xs">Above rank cap - cannot add {rank}-Rank abilities</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {(character.powers || []).length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No powers yet. Add your first power above.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-100">Power Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-400">
              <p>• <span className="text-purple-400">Rank Costs:</span> D(10 SP) → C(20) → B(40) → A(80) → S(160)</p>
              <p>• <span className="text-purple-400">Upgrades:</span> Max 3 per mechanic - Lesser (50%), Moderate (100%), Greater (150%)</p>
              <p>• <span className="text-purple-400">Flawed:</span> Half cost, flaws remain until full payment</p>
              <p>• <span className="text-purple-400">Broken:</span> Mid-encounter, debt until flawed cost paid, can still raise stats/skills</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-100">Power Type Quick Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-400">
              <p>• <span className="text-amber-400">Archetype:</span> Powers of story characters, Mental Bleed, Narrative Senses</p>
              <p>• <span className="text-amber-400">Aspect:</span> Physiology abilities without transformation, Balanced basic ability</p>
              <p>• <span className="text-amber-400">Elementalist:</span> Energy/substance control, Elemental stat, Prestidigitation, Heroic+ Immunity to element</p>
              <p>• <span className="text-amber-400">Genesis:</span> Create/control objects/creatures, Constructs/Creatures/Summons, Extension/Drones/Alliance</p>
              <p>• <span className="text-amber-400">Golem:</span> Body becomes non-biological matter, Built Different (Vital/Lethal -1 step)</p>
              <p>• <span className="text-amber-400">Maestro:</span> Exceptional skill prowess, Size Up ability</p>
              <p>• <span className="text-amber-400">Mage:</span> Natural mage with Mana bonus, Spellcasting skill</p>
              <p>• <span className="text-amber-400">Mentalist:</span> Mental powers, Collective Unconscious</p>
              <p>• <span className="text-amber-400">Monk:</span> Ki-derived abilities, unique Truths/Essences/Principles</p>
              <p>• <span className="text-amber-400">Morpher:</span> Biological warping, Partial/Half/Full Transformations, Uncanny Control</p>
              <p>• <span className="text-amber-400">Paragon:</span> Melee/self-enhancement scaling with stats, Unparalleled Might</p>
              <p>• <span className="text-amber-400">Psion:</span> Psionic abilities, twisted Lies system</p>
              <p>• <span className="text-amber-400">Psyche:</span> Mental exertion powers, Rounding/Split/Action Enhancement, Self-Awareness</p>
              <p>• <span className="text-amber-400">Spark:</span> Reality-breaking tech, Projects (D=plausible to S=comic book), Facets, gain SP from inventions</p>
              <p>• <span className="text-amber-400">Sprite:</span> Body becomes energy/non-solid, Elemental Freedom (flight or climbing)</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="spark">
        <SparkSection character={character} setCharacter={setCharacter} />
      </TabsContent>

      <TabsContent value="magic">
        <MagicSection character={character} setCharacter={setCharacter} />
      </TabsContent>
    </Tabs>
  );
}