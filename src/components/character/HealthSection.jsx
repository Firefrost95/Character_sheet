import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Heart, AlertTriangle, Activity, Shield } from "lucide-react";

const INJURY_SEVERITIES = ["Scratched", "Bruised", "Middling", "Severe", "Brutal", "Horrific"];
const INJURY_TYPES = ["Vital", "Lethal", "Temporary Strain"];

export default function HealthSection({ character, setCharacter }) {
  const addInjury = () => {
    setCharacter({
      ...character,
      health: {
        ...character.health,
        injuries: [...(character.health.injuries || []), {
          type: "Vital",
          severity: "Middling",
          value: 0,
          duration: "",
          affected_stat: ""
        }]
      }
    });
  };

  const updateInjury = (index, field, value) => {
    const newInjuries = [...(character.health.injuries || [])];
    newInjuries[index] = { ...newInjuries[index], [field]: value };
    setCharacter({
      ...character,
      health: { ...character.health, injuries: newInjuries }
    });
  };

  const removeInjury = (index) => {
    setCharacter({
      ...character,
      health: {
        ...character.health,
        injuries: character.health.injuries.filter((_, i) => i !== index)
      }
    });
  };

  const addStatusEffect = () => {
    setCharacter({
      ...character,
      health: {
        ...character.health,
        status_effects: [...(character.health.status_effects || []), {
          name: "",
          stage: 1,
          description: "",
          stacks: 0
        }]
      }
    });
  };

  const updateStatusEffect = (index, field, value) => {
    const newEffects = [...(character.health.status_effects || [])];
    newEffects[index] = { ...newEffects[index], [field]: value };
    setCharacter({
      ...character,
      health: { ...character.health, status_effects: newEffects }
    });
  };

  const removeStatusEffect = (index) => {
    setCharacter({
      ...character,
      health: {
        ...character.health,
        status_effects: character.health.status_effects.filter((_, i) => i !== index)
      }
    });
  };

  const addVulnerability = () => {
    const newVulns = [...(character.health.vulnerabilities || []), ""];
    setCharacter({
      ...character,
      health: { ...character.health, vulnerabilities: newVulns }
    });
  };

  const updateVulnerability = (index, value) => {
    const newVulns = [...(character.health.vulnerabilities || [])];
    newVulns[index] = value;
    setCharacter({
      ...character,
      health: { ...character.health, vulnerabilities: newVulns }
    });
  };

  const removeVulnerability = (index) => {
    setCharacter({
      ...character,
      health: {
        ...character.health,
        vulnerabilities: character.health.vulnerabilities.filter((_, i) => i !== index)
      }
    });
  };

  const addDurability = () => {
    const durabilities = character.health?.durabilities || [];
    setCharacter({
      ...character,
      health: {
        ...character.health,
        durabilities: [...durabilities, { type: "", level: "" }]
      }
    });
  };

  const updateDurability = (index, field, value) => {
    const newDurabilities = [...(character.health?.durabilities || [])];
    newDurabilities[index] = { ...newDurabilities[index], [field]: value };
    setCharacter({
      ...character,
      health: { ...character.health, durabilities: newDurabilities }
    });
  };

  const removeDurability = (index) => {
    setCharacter({
      ...character,
      health: {
        ...character.health,
        durabilities: character.health.durabilities.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Durability & Soak */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Durability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Durability Types</Label>
              <Button
                onClick={addDurability}
                className="bg-amber-600 hover:bg-amber-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Durability
              </Button>
            </div>
            {(character.health?.durabilities || []).map((durability, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={durability.type}
                  onChange={(e) => updateDurability(index, 'type', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                  placeholder="e.g., Middling Physical Resistance"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDurability(index)}
                  className="text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {(character.health?.durabilities || []).length === 0 && (
              <p className="text-xs text-slate-400">Default: Lesser Everything Toughness</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Vulnerabilities</Label>
              <Button
                onClick={addVulnerability}
                className="bg-amber-600 hover:bg-amber-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            {(character.health?.vulnerabilities || []).map((vuln, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={vuln}
                  onChange={(e) => updateVulnerability(index, e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., Minor Fire Vulnerability, Achilles Silver"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVulnerability(index)}
                  className="text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-1 text-xs text-slate-400">
            <p><span className="font-semibold text-amber-400">Durability Levels:</span> Toughness (normal) → Resistance (halves DV) → Immunity (nullifies)</p>
          </div>
        </CardContent>
      </Card>

      {/* Injuries (3 Boxes) */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Injuries (3 Boxes Total)
          </CardTitle>
          <Button
            onClick={addInjury}
            className="bg-red-600 hover:bg-red-700"
            size="sm"
            disabled={(character.health?.injuries || []).length >= 3}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Injury
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-900/20 p-3 rounded border border-red-700/50 text-xs text-slate-300">
            <p className="font-semibold text-red-400 mb-2">All 3 Boxes Filled = Taken Out (KO or Death)</p>
            <p>Boxes empty at end of Reset. Long-term injuries can be "Scarred" (keep box filled, negate malus).</p>
          </div>

          {(character.health?.injuries || []).map((injury, index) => (
            <div key={index} className="bg-red-900/20 p-4 rounded-lg border-2 border-red-700/50 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Type</Label>
                      <Select
                        value={injury.type}
                        onValueChange={(value) => updateInjury(index, 'type', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INJURY_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-400">
                        Vital: +1 DV, Lethal: +2 DV
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Severity</Label>
                      <Select
                        value={injury.severity}
                        onValueChange={(value) => updateInjury(index, 'severity', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INJURY_SEVERITIES.map(sev => (
                            <SelectItem key={sev} value={sev}>{sev}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-400">
                        Based on DL vs Health tier
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Value (+t malus)</Label>
                      <Input
                        type="number"
                        value={injury.value}
                        onChange={(e) => updateInjury(index, 'value', parseInt(e.target.value) || 0)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <p className="text-xs text-slate-400">
                        = DV or Gibs count (whichever higher)
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Affected Stat</Label>
                      <Select
                        value={injury.affected_stat || ""}
                        onValueChange={(value) => updateInjury(index, 'affected_stat', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select stat" />
                        </SelectTrigger>
                        <SelectContent>
                          {character.stats?.map(stat => (
                            <SelectItem key={stat.name} value={stat.name}>{stat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-400">Reduces stat levels by Value</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Duration / Notes</Label>
                      <Input
                        value={injury.duration}
                        onChange={(e) => updateInjury(index, 'duration', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Formula: [DV × time unit] +2, -2 per Health level"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInjury(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {(character.health?.injuries || []).length === 0 && (
            <p className="text-center py-8 text-slate-400">No injuries (healthy!)</p>
          )}

          <div className="space-y-2 mt-4">
            <Label className="text-slate-300">Wounds (Soak t-malus)</Label>
            <Input
              type="number"
              value={character.health?.wounds || 0}
              onChange={(e) => setCharacter({
                ...character,
                health: { ...character.health, wounds: parseInt(e.target.value) || 0 }
              })}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-400">Lingering t-malus from passed Soak checks</p>
          </div>

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-1 text-xs text-slate-400">
            <p><span className="font-semibold text-amber-400">Severity Scale:</span> 3+ DL above Health = Horrific, 2 above = Brutal (weeks), 1 above = Severe (days), Equal = Middling (hours), 1 below = Bruised (minutes), 2 below = Scratched (rounds)</p>
            <p><span className="font-semibold text-amber-400">Max Stacking:</span> Same damage type = 4 injuries (+1 Vital, +2 Lethal)</p>
            <p><span className="font-semibold text-amber-400">Temporary Strain:</span> Half +t for 1 round after injury (until end of next turn)</p>
          </div>
        </CardContent>
      </Card>

      {/* Status Effects */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Status Effects
          </CardTitle>
          <Button
            onClick={addStatusEffect}
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Effect
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(character.health?.status_effects || []).map((effect, index) => (
            <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Effect Name</Label>
                    <Input
                      value={effect.name}
                      onChange={(e) => updateStatusEffect(index, 'name', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., Burning, Bleeding, Paralysis"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Stacks</Label>
                    <Input
                      type="number"
                      value={effect.stacks || 0}
                      onChange={(e) => updateStatusEffect(index, 'stacks', parseInt(e.target.value) || 0)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <p className="text-xs text-slate-400">
                      Half tier = no effect, Full tier = standard, Double = maximum
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Stage</Label>
                    <Select
                      value={effect.stage?.toString() || "1"}
                      onValueChange={(value) => updateStatusEffect(index, 'stage', parseInt(value))}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None (Below Half)</SelectItem>
                        <SelectItem value="1">Half Effect</SelectItem>
                        <SelectItem value="2">Full Effect</SelectItem>
                        <SelectItem value="3">Double Effect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStatusEffect(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Description / Mechanics</Label>
                <Textarea
                  value={effect.description}
                  onChange={(e) => updateStatusEffect(index, 'description', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Effect mechanics, target stat, recovery type (Action/Duration/Process/Other)..."
                  rows={2}
                />
              </div>
            </div>
          ))}

          {(character.health?.status_effects || []).length === 0 && (
            <p className="text-center py-8 text-slate-400">No active status effects</p>
          )}

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-1 text-xs text-slate-400">
            <p><span className="font-semibold text-amber-400">Common Effects:</span> Paralysis (Health), Burning (Agility), Bleeding (Health), Chilled (Strength), Berserk (Cha/Will), Poisoned (Health), Exhaustion (Health/Will), Paranoia (Cha/Will)</p>
            <p><span className="font-semibold text-amber-400">Recovery Types:</span> Action (deliberate effort), Duration (fixed time), Process (degrades over time), Other (unique)</p>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Info */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Recovery & Healing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-400">
          <p>• <span className="text-emerald-400">Natural Recovery:</span> Soak resets to base once per day (unless injury prevents it)</p>
          <p>• <span className="text-emerald-400">Surgery:</span> Marathon DC = (DV × 2), +0t base, +2t per tier above Scratched (no cap)</p>
          <p>• <span className="text-emerald-400">Surgery Limit:</span> Horrific [+1] or higher cannot be treated with standard surgery</p>
          <p>• <span className="text-emerald-400">Medicine:</span> Treats poisons, diseases, afflictions that surgery cannot mend</p>
          <p>• <span className="text-emerald-400">Injury Boxes:</span> Empty at end of Reset (even if injury persists)</p>
        </CardContent>
      </Card>
    </div>
  );
}