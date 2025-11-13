
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Dices, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const REGULAR_TIERS = ["Vermin", "Mortal", "Uncanny", "Supernatural", "Epic", "Heroic", "Divine", "Cosmic"];
const CONDITIONAL_TIERS = ["Cantrip", "Initiate", "Uncanny", "Supernatural", "Epic", "Heroic", "Divine", "Cosmic"];
const LEVELS = ["Low", "Mid", "High"];

export default function StatsSection({ character, setCharacter }) {
  const [copiedPool, setCopiedPool] = React.useState(null);

  const calculateDicePool = (tier, level, isConditional) => {
    const effectiveTier = isConditional && (tier === "Cantrip" || tier === "Initiate") 
      ? (tier === "Cantrip" ? "Vermin" : "Mortal")
      : tier;

    const diceMap = {
      "Vermin": { "Low": 2, "Mid": 4, "High": 6 },
      "Mortal": { "Low": 4, "Mid": 8, "High": 12 },
      "Uncanny": { "Low": 16, "Mid": 20, "High": 24 },
      "Supernatural": { "Low": 30, "Mid": 35, "High": 40 },
      "Epic": { "Low": 50, "Mid": 60, "High": 70 },
      "Heroic": { "Low": 80, "Mid": 90, "High": 100 },
      "Divine": { "Low": 110, "Mid": 120, "High": 130 },
      "Cosmic": { "Low": 140, "Mid": 150, "High": 160 }
    };

    const sidesMap = {
      "Vermin": 12, "Mortal": 12,
      "Uncanny": 12,
      "Supernatural": 13,
      "Epic": 14,
      "Heroic": 15,
      "Divine": 16,
      "Cosmic": 17
    };

    let baseDice = diceMap[effectiveTier]?.[level] || 4;
    let sides = sidesMap[effectiveTier] || 12;
    let tModifier = 7;

    // Calculate t modifier for base dice
    let wasBuffed = false;
    if (baseDice < 10) {
      tModifier += 1;
      wasBuffed = true;
      if (baseDice <= 5) tModifier += 1;
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
      wasCapped,
      wasBuffed
    };
  };

  const getTotalInjuryMalus = (statName) => {
    const injuries = character.health?.injuries || [];
    return injuries.reduce((total, injury) => {
      if (injury.affected_stat === statName) {
        return total + (injury.value || 0);
      }
      return total;
    }, 0);
  };

  const copyDicePool = (poolString) => {
    navigator.clipboard.writeText(poolString);
    setCopiedPool(poolString);
    toast.success("Dice pool copied!");
    setTimeout(() => setCopiedPool(null), 2000);
  };

  const addStat = () => {
    setCharacter({
      ...character,
      stats: [...character.stats, {
        name: "",
        tier: "Mortal",
        level: "Low",
        is_conditional: false,
        has_plot_armor: false,
        plot_armor_effect: "",
        pool_size: 0,
        pool_type: ""
      }]
    });
  };

  const updateStat = (index, field, value) => {
    const newStats = [...character.stats];
    
    if (field === 'is_conditional') {
      const currentTier = newStats[index].tier;
      if (value && (currentTier === "Vermin" || currentTier === "Mortal")) {
        newStats[index].tier = currentTier === "Vermin" ? "Cantrip" : "Initiate";
      } else if (!value && (currentTier === "Cantrip" || currentTier === "Initiate")) {
        newStats[index].tier = currentTier === "Cantrip" ? "Vermin" : "Mortal";
      }
    }
    
    newStats[index] = { ...newStats[index], [field]: value };
    setCharacter({ ...character, stats: newStats });
  };

  const removeStat = (index) => {
    setCharacter({
      ...character,
      stats: character.stats.filter((_, i) => i !== index)
    });
  };

  const getStatEffects = (statName, tier) => {
    const effects = {
      "Strength": "Knockback 5ft/level (doubles per tier), stunts: Brute Force (+0t melee), Charge (+2t/+DV), Counter (+4t parry)",
      "Agility": "Doubles Massed Slashes per tier above Mortal, Bullet Time -1 dodge req per tier (stacks with Perception)",
      "Health": "-1t physical Injury Boxes per tier above Mortal (cap -3t Supernatural, -2t Epic, -1t Heroic)",
      "Perception": "-1 Blindsided/Ambushed malus per tier above Mortal, stacks with Agility for Bullet Time",
      "Intellect": "+1 Craft/Research action per tier above Mortal",
      "Willpower": "-1t mental Injury Boxes per tier above Mortal (cap same as Health)",
      "Charisma": "Mental combat, requires Mentalist or concentration for Mental AD"
    };
    return effects[statName] || "";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-100">Character Stats</CardTitle>
          <Button
            onClick={addStat}
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stat
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {character.stats?.map((stat, index) => {
            const pool = calculateDicePool(stat.tier, stat.level, stat.is_conditional);
            const statEffect = getStatEffects(stat.name, stat.tier);
            const injuryMalus = getTotalInjuryMalus(stat.name);
            const adjustedT = pool.tModifier + injuryMalus;
            const poolString = `${pool.cappedDice}d${pool.sides} ie12 t${adjustedT}`;
            const isCopied = copiedPool === poolString;

            return (
              <div key={index} className="bg-slate-700/30 p-3 rounded-lg border border-slate-600 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Stat Name</Label>
                      <Input
                        value={stat.name}
                        onChange={(e) => updateStat(index, 'name', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white h-8 text-sm"
                        placeholder="e.g., Strength"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Tier</Label>
                      <Select
                        value={stat.tier}
                        onValueChange={(value) => updateStat(index, 'tier', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(stat.is_conditional ? CONDITIONAL_TIERS : REGULAR_TIERS).map(tier => (
                            <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Level</Label>
                      <Select
                        value={stat.level}
                        onValueChange={(value) => updateStat(index, 'level', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEVELS.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1 col-span-2">
                      <Label className="text-slate-300 text-xs">Dice Pool</Label>
                      <div className="bg-gradient-to-r from-amber-900/50 to-amber-800/50 border border-amber-700/50 rounded-md px-2 py-1.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Dices className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          <div className="flex flex-col">
                            {(pool.wasCapped || pool.wasBuffed) ? (
                              <>
                                <span className="font-mono text-amber-100 font-semibold text-xs leading-tight">
                                  {pool.cappedDice}d{pool.sides} ie12 t{adjustedT}
                                </span>
                                <span className="font-mono text-amber-400/60 text-[10px] leading-tight">
                                  {pool.wasCapped && `(base: ${pool.baseDice}d${pool.sides})`}
                                  {pool.wasBuffed && !pool.wasCapped && `(base: ${pool.baseDice}d${pool.sides}, t${7 + injuryMalus})`}
                                </span>
                              </>
                            ) : (
                              <span className="font-mono text-amber-100 font-semibold text-sm">
                                {pool.cappedDice}d{pool.sides} ie12 t{adjustedT}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyDicePool(poolString)}
                          className="h-6 w-6 hover:bg-amber-700/30 flex-shrink-0"
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-amber-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStat(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`conditional-${index}`}
                      checked={stat.is_conditional}
                      onCheckedChange={(checked) => updateStat(index, 'is_conditional', checked)}
                    />
                    <label htmlFor={`conditional-${index}`} className="text-xs text-slate-300">
                      Conditional
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`plot-armor-${index}`}
                      checked={stat.has_plot_armor}
                      onCheckedChange={(checked) => updateStat(index, 'has_plot_armor', checked)}
                    />
                    <label htmlFor={`plot-armor-${index}`} className="text-xs text-slate-300">
                      Plot Armor
                    </label>
                  </div>
                </div>

                {stat.has_plot_armor && (
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-600 space-y-2">
                    <Label className="text-amber-400 text-sm">Plot Armor Effect</Label>
                    <Textarea
                      value={stat.plot_armor_effect || ""}
                      onChange={(e) => updateStat(index, 'plot_armor_effect', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                      placeholder="Passive buff and flare effect for this stat..."
                      rows={2}
                    />
                    <p className="text-xs text-slate-400">
                      Cooldown: [Tiers in {stat.name}] rounds after flaring. GM-determined, player must request.
                    </p>
                  </div>
                )}

                {statEffect && (
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-600">
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-amber-400">Effects:</span> {statEffect}
                    </p>
                  </div>
                )}

                {stat.is_conditional && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Pool Type</Label>
                      <Select
                        value={stat.pool_type || ""}
                        onValueChange={(value) => updateStat(index, 'pool_type', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Composite">Composite</SelectItem>
                          <SelectItem value="Additive">Additive</SelectItem>
                          <SelectItem value="Pool">Pool</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Pool Size</Label>
                      <Input
                        type="number"
                        value={stat.pool_size || 0}
                        onChange={(e) => updateStat(index, 'pool_size', parseInt(e.target.value) || 0)}
                        className="bg-slate-700 border-slate-600 text-white h-8 text-sm"
                        placeholder="e.g., 5 per level"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {character.stats?.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Dices className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No stats yet. Add your first stat above.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Stat Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-400">
          <p>• <span className="text-amber-400">Starting Stats:</span> Up to 2 mundane at Mid Mortal, 5 at Low Mortal</p>
          <p>• <span className="text-amber-400">Universal Min/Cap:</span> Below 10 dice = +1t (+2t if 5+ below); Above 25 = -1t per 5 dice</p>
          <p>• <span className="text-amber-400">Dice Sides:</span> +1 per tier above Uncanny (d13 at Supernatural, d14 at Epic, etc.)</p>
          <p>• <span className="text-amber-400">Regular Stats:</span> Vermin, Mortal, Uncanny, Supernatural, Epic, Heroic, Divine, Cosmic</p>
          <p>• <span className="text-amber-400">Conditional Stats:</span> Cantrip, Initiate, Uncanny... (replaces Vermin/Mortal)</p>
          <p>• <span className="text-amber-400">SP Cost:</span> 15 SP per level (reduced by 5 SP for first level of each stat)</p>
        </CardContent>
      </Card>
    </div>
  );
}
