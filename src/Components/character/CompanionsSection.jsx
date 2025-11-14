
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Plus, Trash2, Users } from "lucide-react";

const TIERS = ["Vermin", "Mortal", "Uncanny", "Supernatural", "Epic", "Heroic", "Divine", "Cosmic"];
const LEVELS = ["Low", "Mid", "High"];
const SKILL_RANKS = ["Untrained", "Novice", "Journeyman", "Adept", "Expert", "Master", "Legend", "Mythological"];

export default function CompanionsSection({ character, setCharacter }) {
  const getMaxCompanions = () => {
    const charismaStat = character.stats?.find(s => s.name === "Charisma");
    if (!charismaStat) return 0;
    
    const tierValues = {
      "Vermin": 0, "Cantrip": 0,
      "Mortal": 1, "Initiate": 1,
      "Uncanny": 2,
      "Supernatural": 3,
      "Epic": 4,
      "Heroic": 5,
      "Divine": 6,
      "Cosmic": 7
    };
    
    return tierValues[charismaStat.tier] || 0;
  };

  const addCompanion = () => {
    setCharacter({
      ...character,
      companions: [...(character.companions || []), {
        name: "",
        description: "",
        stats: [],
        skills: [],
        abilities: "",
        growth_stage: 1,
        invested_sp: 0
      }]
    });
  };

  const updateCompanion = (index, field, value) => {
    const newCompanions = [...(character.companions || [])];
    newCompanions[index] = { ...newCompanions[index], [field]: value };
    setCharacter({ ...character, companions: newCompanions });
  };

  const removeCompanion = (index) => {
    setCharacter({
      ...character,
      companions: (character.companions || []).filter((_, i) => i !== index)
    });
  };

  const addCompanionStat = (companionIndex) => {
    const companions = [...(character.companions || [])];
    companions[companionIndex].stats = [...(companions[companionIndex].stats || []), {
      name: "",
      tier: "Mortal",
      level: "Low"
    }];
    setCharacter({ ...character, companions });
  };

  const updateCompanionStat = (companionIndex, statIndex, field, value) => {
    const companions = [...(character.companions || [])];
    companions[companionIndex].stats[statIndex] = {
      ...companions[companionIndex].stats[statIndex],
      [field]: value
    };
    setCharacter({ ...character, companions });
  };

  const removeCompanionStat = (companionIndex, statIndex) => {
    const companions = [...(character.companions || [])];
    companions[companionIndex].stats = companions[companionIndex].stats.filter((_, i) => i !== statIndex);
    setCharacter({ ...character, companions });
  };

  const addCompanionSkill = (companionIndex) => {
    const companions = [...(character.companions || [])];
    companions[companionIndex].skills = [...(companions[companionIndex].skills || []), {
      name: "",
      rank: "Novice"
    }];
    setCharacter({ ...character, companions });
  };

  const updateCompanionSkill = (companionIndex, skillIndex, field, value) => {
    const companions = [...(character.companions || [])];
    companions[companionIndex].skills[skillIndex] = {
      ...companions[companionIndex].skills[skillIndex],
      [field]: value
    };
    setCharacter({ ...character, companions });
  };

  const removeCompanionSkill = (companionIndex, skillIndex) => {
    const companions = [...(character.companions || [])];
    companions[companionIndex].skills = companions[companionIndex].skills.filter((_, i) => i !== skillIndex);
    setCharacter({ ...character, companions });
  };

  const maxCompanions = getMaxCompanions();
  const currentCompanions = (character.companions || []).length;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Companions
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              {currentCompanions} / {maxCompanions} companions (Charisma Tiers)
            </p>
          </div>
          <Button
            onClick={addCompanion}
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
            disabled={currentCompanions >= maxCompanions}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Companion
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {(character.companions || []).map((companion, companionIndex) => (
            <div key={companionIndex} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Companion Name</Label>
                      <Input
                        value={companion.name}
                        onChange={(e) => updateCompanion(companionIndex, 'name', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white font-semibold"
                        placeholder="e.g., Familiar, Sidekick, Ally"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Growth Stage</Label>
                        <Input
                          type="number"
                          min="1"
                          value={companion.growth_stage}
                          onChange={(e) => updateCompanion(companionIndex, 'growth_stage', parseInt(e.target.value) || 1)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Invested SP</Label>
                        <Input
                          type="number"
                          min="0"
                          value={companion.invested_sp}
                          onChange={(e) => updateCompanion(companionIndex, 'invested_sp', parseInt(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Description</Label>
                    <Textarea
                      value={companion.description}
                      onChange={(e) => updateCompanion(companionIndex, 'description', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Physical description, personality, background..."
                      rows={2}
                    />
                  </div>

                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">Stats</Label>
                      <Button
                        onClick={() => addCompanionStat(companionIndex)}
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 h-7"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(companion.stats || []).map((stat, statIndex) => (
                        <div key={statIndex} className="bg-slate-800/50 p-2 rounded border border-slate-600 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <Input
                              value={stat.name}
                              onChange={(e) => updateCompanionStat(companionIndex, statIndex, 'name', e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white h-7 text-xs"
                              placeholder="Stat"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCompanionStat(companionIndex, statIndex)}
                              className="h-6 w-6 text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <Select
                              value={stat.level}
                              onValueChange={(value) => updateCompanionStat(companionIndex, statIndex, 'level', value)}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {LEVELS.map(level => (
                                  <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={stat.tier}
                              onValueChange={(value) => updateCompanionStat(companionIndex, statIndex, 'tier', value)}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TIERS.map(tier => (
                                  <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">Skills</Label>
                      <Button
                        onClick={() => addCompanionSkill(companionIndex)}
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 h-7"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(companion.skills || []).map((skill, skillIndex) => (
                        <div key={skillIndex} className="bg-slate-800/50 p-2 rounded border border-slate-600 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <Input
                              value={skill.name}
                              onChange={(e) => updateCompanionSkill(companionIndex, skillIndex, 'name', e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white h-7 text-xs"
                              placeholder="Skill"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCompanionSkill(companionIndex, skillIndex)}
                              className="h-6 w-6 text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <Select
                            value={skill.rank}
                            onValueChange={(value) => updateCompanionSkill(companionIndex, skillIndex, 'rank', value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SKILL_RANKS.map(rank => (
                                <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Abilities */}
                  <div className="space-y-2">
                    <Label className="text-slate-300">Abilities</Label>
                    <Textarea
                      value={companion.abilities}
                      onChange={(e) => updateCompanion(companionIndex, 'abilities', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Special abilities, powers, techniques..."
                      rows={2}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCompanion(companionIndex)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {(character.companions || []).length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No companions yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Companion Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-400">
          <p>• <span className="text-amber-400">Limit:</span> Max companions = Charisma Tiers</p>
          <p>• <span className="text-amber-400">Growth:</span> Don't passively grow from combat; need significant feats or player SP investment</p>
          <p>• <span className="text-amber-400">SP Investment:</span> Players can donate SP to push companions towards next growth stage</p>
          <p>• <span className="text-amber-400">Awakening:</span> If companion Awakens/Mutates, they cease taking a slot and become full NPC allies</p>
        </CardContent>
      </Card>
    </div>
  );
}
