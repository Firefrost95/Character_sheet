
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Sword, Dices, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const RANKS = [
  { name: "Untrained", modifier: 1 },
  { name: "Novice", modifier: 0 },
  { name: "Journeyman", modifier: -1 },
  { name: "Adept", modifier: -3 },
  { name: "Expert", modifier: -4 },
  { name: "Master", modifier: -6 },
  { name: "Legend", modifier: -9 },
  { name: "Mythological", modifier: -13 }
];

export default function SkillsSection({ character, setCharacter }) {
  const [copiedPool, setCopiedPool] = React.useState(null);

  const addSkill = () => {
    setCharacter({
      ...character,
      skills: [...(character.skills || []), {
        name: "",
        stat1: "",
        stat2: "",
        rank: "Untrained",
        notes: ""
      }]
    });
  };

  const updateSkill = (index, field, value) => {
    const newSkills = [...(character.skills || [])];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setCharacter({ ...character, skills: newSkills });
  };

  const removeSkill = (index) => {
    setCharacter({
      ...character,
      skills: (character.skills || []).filter((_, i) => i !== index)
    });
  };

  const calculateSkillDice = (skill) => {
    const stat1 = character.stats?.find(s => s.name === skill.stat1);
    const stat2 = character.stats?.find(s => s.name === skill.stat2);

    if (!stat1 && !stat2) return { baseDice: 0, cappedDice: 0, sides: 12, tModifier: 7, baseT: 7, wasCapped: false, wasBuffed: false };

    const getDice = (tier, level) => {
      const diceMap = {
        "Vermin": { "Low": 2, "Mid": 4, "High": 6 },
        "Cantrip": { "Low": 2, "Mid": 4, "High": 6 },
        "Mortal": { "Low": 4, "Mid": 8, "High": 12 },
        "Initiate": { "Low": 4, "Mid": 8, "High": 12 },
        "Uncanny": { "Low": 16, "Mid": 20, "High": 24 },
        "Supernatural": { "Low": 30, "Mid": 35, "High": 40 },
        "Epic": { "Low": 50, "Mid": 60, "High": 70 },
        "Heroic": { "Low": 80, "Mid": 90, "High": 100 },
        "Divine": { "Low": 110, "Mid": 120, "High": 130 },
        "Cosmic": { "Low": 140, "Mid": 150, "High": 160 }
      };
      return diceMap[tier]?.[level] || 4;
    };

    const getSides = (tier) => {
      const sidesMap = {
        "Vermin": 12, "Cantrip": 12,
        "Mortal": 12, "Initiate": 12,
        "Uncanny": 12,
        "Supernatural": 13,
        "Epic": 14,
        "Heroic": 15,
        "Divine": 16,
        "Cosmic": 17
      };
      return sidesMap[tier] || 12;
    };

    let dice1 = stat1 ? getDice(stat1.tier, stat1.level) : 0;
    let dice2 = stat2 ? getDice(stat2.tier, stat2.level) : 0;
    
    let baseDice = stat2 ? Math.floor((dice1 + dice2) / 2) : dice1;
    let sides = Math.max(
      stat1 ? getSides(stat1.tier) : 12,
      stat2 ? getSides(stat2.tier) : 12
    );

    const rank = RANKS.find(r => r.name === skill.rank);
    let tModifier = 7 + (rank?.modifier || 0);
    let baseT = tModifier; // Store initial tModifier before dice-based adjustments

    const rankIndex = RANKS.findIndex(r => r.name === skill.rank);
    if (rankIndex > 1) {
      baseDice += (rankIndex - 1) * 2;
    }

    let wasBuffed = false;
    // Calculate t modifier for base dice
    if (baseDice < 10) {
      tModifier += 1;
      wasBuffed = true;
      if (baseDice <= 5) {
        tModifier += 1;
        wasBuffed = true;
      }
    }
    
    // Apply cap
    let cappedDice = baseDice;
    let wasCapped = false;
    if (baseDice > 25) {
      const excess = Math.floor((baseDice - 25) / 5);
      tModifier -= excess;
      cappedDice = 25;
      wasCapped = true;
    }

    return { 
      baseDice, 
      cappedDice, 
      sides, 
      tModifier,
      baseT,
      wasCapped,
      wasBuffed
    };
  };

  const getTotalInjuryMalus = (skill) => {
    const injuries = character.health?.injuries || [];
    let totalMalus = 0;
    
    if (skill.stat1) {
      totalMalus += injuries.reduce((total, injury) => {
        if (injury.affected_stat === skill.stat1) {
          return total + (injury.value || 0);
        }
        return total;
      }, 0);
    }
    
    if (skill.stat2) {
      totalMalus += injuries.reduce((total, injury) => {
        if (injury.affected_stat === skill.stat2) {
          return total + (injury.value || 0);
        }
        return total;
      }, 0);
    }
    
    return totalMalus;
  };

  const copyDicePool = (poolString) => {
    navigator.clipboard.writeText(poolString);
    setCopiedPool(poolString);
    toast.success("Dice pool copied!");
    setTimeout(() => setCopiedPool(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-100">Skills</CardTitle>
          <Button
            onClick={addSkill}
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {(character.skills || []).map((skill, index) => {
            const pool = calculateSkillDice(skill);
            const injuryMalus = getTotalInjuryMalus(skill);
            const adjustedT = pool.tModifier + injuryMalus;
            const poolString = `${pool.cappedDice}d${pool.sides} ie12 t${adjustedT}`;
            const isCopied = copiedPool === poolString;

            return (
              <div key={index} className="bg-slate-700/30 p-3 rounded-lg border border-slate-600 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Skill Name</Label>
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white h-8 text-sm"
                        placeholder="e.g., Brawling, Stealth"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Stat 1</Label>
                      <Select
                        value={skill.stat1}
                        onValueChange={(value) => updateSkill(index, 'stat1', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {character.stats?.map(stat => (
                            <SelectItem key={stat.name} value={stat.name}>
                              {stat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Stat 2</Label>
                      <Select
                        value={skill.stat2}
                        onValueChange={(value) => updateSkill(index, 'stat2', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 text-sm">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>None</SelectItem>
                          {character.stats?.map(stat => (
                            <SelectItem key={stat.name} value={stat.name}>
                              {stat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Rank</Label>
                      <Select
                        value={skill.rank}
                        onValueChange={(value) => updateSkill(index, 'rank', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RANKS.map(rank => (
                            <SelectItem key={rank.name} value={rank.name}>
                              {rank.name} ({rank.modifier >= 0 ? '+' : ''}{rank.modifier}t)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Dice Pool</Label>
                      <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border border-emerald-700/50 rounded-md px-2 py-1.5 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <Dices className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <div className="flex flex-col">
                            {pool.wasCapped || pool.wasBuffed ? (
                              <>
                                <span className="font-mono text-emerald-100 font-semibold text-xs leading-tight">
                                  {pool.cappedDice}d{pool.sides} t{adjustedT}
                                  {injuryMalus > 0 && (
                                    <span className="text-red-400"> (+{injuryMalus})</span>
                                  )}
                                </span>
                                <span className="font-mono text-emerald-400/60 text-[10px] leading-tight">
                                  {pool.wasCapped && `(Base: ${pool.baseDice}d${pool.sides} t${pool.baseT + injuryMalus})`}
                                  {pool.wasBuffed && !pool.wasCapped && `(Base: ${pool.baseDice}d${pool.sides} t${pool.baseT + injuryMalus})`}
                                </span>
                              </>
                            ) : (
                              <span className="font-mono text-emerald-100 font-semibold text-xs truncate">
                                {pool.cappedDice}d{pool.sides} t{adjustedT}
                                {injuryMalus > 0 && (
                                  <span className="text-red-400"> (+{injuryMalus})</span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyDicePool(poolString)}
                          className="h-5 w-5 hover:bg-emerald-700/30 flex-shrink-0"
                        >
                          {isCopied ? (
                            <Check className="w-2.5 h-2.5 text-green-400" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-emerald-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {skill.notes && (
                  <div className="space-y-1">
                    <Textarea
                      value={skill.notes}
                      onChange={(e) => updateSkill(index, 'notes', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white text-xs"
                      placeholder="Special abilities, bonuses, or mechanics..."
                      rows={1}
                    />
                  </div>
                )}
                
                {!skill.notes && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSkill(index, 'notes', '')}
                    className="text-slate-400 hover:text-slate-300 h-6 text-xs px-2"
                  >
                    + Add notes
                  </Button>
                )}
              </div>
            );
          })}

          {(character.skills || []).length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Sword className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No skills yet. Add your first skill above.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Skill Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-400">
          <p>• <span className="text-emerald-400">Starting Allocation:</span> 10 tiers total (1 for Novice, double per higher tier, cap Journeyman)</p>
          <p>• <span className="text-emerald-400">Multi-Stat:</span> Average dice pools, stack t bonuses/maluses, sides based on closest level</p>
          <p>• <span className="text-emerald-400">Mastery:</span> +2 dice per rank above Novice (+3 for Advanced skills)</p>
          <p>• <span className="text-emerald-400">MDG:</span> Combine t-minuses, soft cap 3 if Adept or lower (no combat)</p>
        </CardContent>
      </Card>
    </div>
  );
}
