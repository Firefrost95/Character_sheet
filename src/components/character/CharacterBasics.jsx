import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, User, Plus, Trash2, Dices, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { MASS_TIERS, STAT_LEVELS as LEVELS, SIZES, TIER_VALUES as tierValuesMap } from "@/components/gameConstants";
import RACE_DATA from "@/components/raceData";

const RACES = Object.keys(RACE_DATA);

export default function CharacterBasics({ character, setCharacter }) {
  const [uploading, setUploading] = useState(false);
  const [copiedPool, setCopiedPool] = useState(null);
  const [copiedSoak, setCopiedSoak] = useState(false);
  const [copiedResolve, setCopiedResolve] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCharacter({ ...character, photo_url: event.target.result });
        toast.success("Photo uploaded!");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload photo");
      console.error(error);
      setUploading(false);
    }
  };

  const handleRaceChange = (raceName) => {
    setCharacter({
      ...character,
      race: raceName,
      race_traits: RACE_DATA[raceName] || []
    });
  };

  const calculateMovementSpeed = () => {
    const primaryStat = character.stats?.find(s => s.name === character.movement?.primary_stat);
    if (!primaryStat) return 15;

    const baseSpeed = 15 * (tierValuesMap[primaryStat.tier] || 1);
    
    const sizeModifiers = {
      "Miniscule": -1.5, "Tiny": -1, "Small": -0.5,
      "Medium": 0,
      "Large": 0.5, "Huge": 1, "Gargantuan": 1.5, "Titanic": 2
    };
    
    const sizeMultiplier = 1 + (sizeModifiers[character.size] || 0);
    const upgradeBonus = (character.movement?.improved_purchased ? 15 * (character.movement?.upgrades || 0) : 0);
    
    return Math.round(baseSpeed * sizeMultiplier + upgradeBonus);
  };

  const getCraftActions = () => {
    const intellectStat = character.stats?.find(s => s.name === "Intellect");
    if (!intellectStat) return 0;
    
    return tierValuesMap[intellectStat.tier] || 0;
  };

  const getLaborActions = () => {
    const strengthStat = character.stats?.find(s => s.name === "Strength");
    const healthStat = character.stats?.find(s => s.name === "Health");
    
    const strTier = strengthStat ? tierValuesMap[strengthStat.tier] || 0 : 0;
    const hlthTier = healthStat ? tierValuesMap[healthStat.tier] || 0 : 0;
    
    return Math.max(strTier, hlthTier);
  };

  useEffect(() => {
    const craftTotal = getCraftActions();
    const laborTotal = getLaborActions();
    
    const currentCraftTotal = character.daily_actions?.craft_total || 0;
    const currentLaborTotal = character.daily_actions?.labor_total || 0;

    if (currentCraftTotal !== craftTotal || currentLaborTotal !== laborTotal) {
      setCharacter(prevChar => ({
        ...prevChar,
        daily_actions: {
          craft_total: craftTotal,
          craft_used: prevChar.daily_actions?.craft_used || 0,
          labor_total: laborTotal,
          labor_used: prevChar.daily_actions?.labor_used || 0
        }
      }));
    }
  }, [character.stats, setCharacter, character.daily_actions]);

  const addTrait = () => {
    setCharacter({
      ...character,
      traits: [...(character.traits || []), { name: "", description: "" }]
    });
  };

  const updateTrait = (index, field, value) => {
    const newTraits = [...(character.traits || [])];
    newTraits[index] = { ...newTraits[index], [field]: value };
    setCharacter({ ...character, traits: newTraits });
  };

  const removeTrait = (index) => {
    setCharacter({
      ...character,
      traits: (character.traits || []).filter((_, i) => i !== index)
    });
  };

  const calculateDicePool = (tier, level) => {
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

    let baseDice = diceMap[tier]?.[level] || 4;
    let sides = sidesMap[tier] || 12;
    
    return { baseDice, sides };
  };

  const calculateInitiative = () => {
    const agilityStat = character.stats?.find(s => s.name === "Agility");
    const perceptionStat = character.stats?.find(s => s.name === "Perception");
    
    if (!agilityStat && !perceptionStat) return null;
    
    const agilityPool = agilityStat ? calculateDicePool(agilityStat.tier, agilityStat.level) : { baseDice: 0, sides: 12 };
    const perceptionPool = perceptionStat ? calculateDicePool(perceptionStat.tier, perceptionStat.level) : { baseDice: 0, sides: 12 };
    
    const avgDice = Math.floor((agilityPool.baseDice + perceptionPool.baseDice) / 2);
    const sides = Math.max(agilityPool.sides, perceptionPool.sides);
    
    return { dice: avgDice, sides };
  };

  const calculateSoakResolve = (statName) => {
    const stat = character.stats?.find(s => s.name === statName);
    if (!stat) return null;
    
    const pool = calculateDicePool(stat.tier, stat.level);
    return pool;
  };

  const copyDicePool = (poolString) => {
    navigator.clipboard.writeText(poolString);
    setCopiedPool(poolString);
    toast.success("Dice pool copied!");
    setTimeout(() => setCopiedPool(null), 2000);
  };

  return (
    <div className="grid gap-6">
      {/* Main Info Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Character Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label className="text-slate-300">Character Portrait</Label>
              <div className="relative w-full aspect-square bg-slate-700/50 rounded-lg overflow-hidden border-2 border-slate-600 hover:border-amber-600/50 transition-colors">
                {character.photo_url ? (
                  <img src={character.photo_url} alt={character.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-20 h-20 text-slate-600" />
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-white" />
                  )}
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Character Name *</Label>
                <Input
                  id="name"
                  value={character.name}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Enter character name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="race" className="text-slate-300">Race</Label>
                  <Select
                    value={character.race || ""}
                    onValueChange={handleRaceChange}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select race" />
                    </SelectTrigger>
                    <SelectContent>
                      {RACES.map(race => (
                        <SelectItem key={race} value={race}>{race}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-400">Auto-fills race traits below</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="power" className="text-slate-300">Power</Label>
                  <Input
                    id="power"
                    value={character.power}
                    onChange={(e) => setCharacter({ ...character, power: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="Primary power name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  value={character.description}
                  onChange={(e) => setCharacter({ ...character, description: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                  placeholder="Physical appearance, personality, age..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="background" className="text-slate-300">Background</Label>
            <Textarea
              id="background"
              value={character.background}
              onChange={(e) => setCharacter({ ...character, background: e.target.value })}
              className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
              placeholder="Character backstory, mental bleed effects, narrative ties to power/race..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Race Traits (Auto-filled) */}
      {character.race && (character.race_traits || []).length > 0 && (
        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-2 border-blue-700/50">
          <CardHeader>
            <CardTitle className="text-cyan-100">{character.race} Race Traits</CardTitle>
            <p className="text-sm text-cyan-400 mt-1">Auto-populated from selected race</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {(character.race_traits || []).map((trait, index) => (
              <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-cyan-700/30">
                <h4 className="font-bold text-cyan-300 mb-2">{trait.name}</h4>
                <p className="text-sm text-slate-300 whitespace-pre-line">{trait.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Custom Traits */}
      <Card className="bg-slate-800/50 border-slate-700">
  <CardHeader className="flex items-center justify-between p-6">
          <div>
            <CardTitle className="text-amber-100">Custom Traits</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Additional character-specific traits and quirks</p>
          </div>
          <Button
            onClick={addTrait}
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Trait
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(character.traits || []).map((trait, index) => (
            <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Trait Name</Label>
                    <Input
                      value={trait.name}
                      onChange={(e) => updateTrait(index, 'name', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white font-semibold"
                      placeholder="e.g., Combat Veteran, Quick Learner"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Description & Mechanics</Label>
                    <Textarea
                      value={trait.description}
                      onChange={(e) => updateTrait(index, 'description', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Detailed description of the trait's effects..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTrait(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {(character.traits || []).length === 0 && (
            <p className="text-center py-8 text-slate-400 text-sm">
              No custom traits yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Physical Attributes */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Physical Attributes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Mass Level</Label>
              <Select
                value={character.mass?.level || "Mid"}
                onValueChange={(value) => setCharacter({
                  ...character,
                  mass: { ...character.mass, level: value }
                })}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Mass Tier</Label>
              <Select
                value={character.mass?.tier || "Light"}
                onValueChange={(value) => setCharacter({
                  ...character,
                  mass: { ...character.mass, tier: value }
                })}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MASS_TIERS.map(tier => (
                    <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Size</Label>
              <Select
                value={character.size}
                onValueChange={(value) => setCharacter({ ...character, size: value })}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-2 text-xs text-slate-400">
            <p>
              <span className="font-semibold text-amber-400">Mass - Knockback:</span> Each level above High Light reduces knockback tier/level 1:1
            </p>
            <p>
              <span className="font-semibold text-amber-400">Mass - Fall Damage:</span> +1 DL per tier above Light, -10 ft distance (min 0 ft at Absurd)
            </p>
            <p>
              <span className="font-semibold text-amber-400">Size - Small:</span> +2t Soak, -1t physical AD/attacks per category below Medium, -50% movement
            </p>
            <p>
              <span className="font-semibold text-amber-400">Size - Large:</span> +1t AD/attacks, +1 dice sides for Soak, +50% movement per category above Medium
            </p>
            <p>
              <span className="font-semibold text-amber-400">Size - Durability Min:</span> Large = Middling Physical/Energy Toughness, increases to Strong Immunity/Resistance at Titanic
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Daily Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-4 rounded-lg border border-blue-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300 font-semibold">Craft Actions</p>
              <p className="text-xs text-slate-400">Based on Intellect Tier</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-3xl font-bold text-blue-400">
                  {character.daily_actions?.craft_used || 0} / {character.daily_actions?.craft_total || 0}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCharacter(prevChar => ({
                    ...prevChar,
                    daily_actions: {
                      ...prevChar.daily_actions,
                      craft_used: Math.max(0, (prevChar.daily_actions?.craft_used || 0) - 1)
                    }
                  }))}
                  disabled={(character.daily_actions?.craft_used || 0) === 0}
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCharacter(prevChar => ({
                    ...prevChar,
                    daily_actions: {
                      ...prevChar.daily_actions,
                      craft_used: Math.min(
                        prevChar.daily_actions?.craft_total || 0,
                        (prevChar.daily_actions?.craft_used || 0) + 1
                      )
                    }
                  }))}
                  disabled={(character.daily_actions?.craft_used || 0) >= (character.daily_actions?.craft_total || 0)}
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  +
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-400">Research, hacking, engineering, magical design</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-4 rounded-lg border border-green-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300 font-semibold">Labor Actions</p>
              <p className="text-xs text-slate-400">Based on Str/Health Tier</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-3xl font-bold text-green-400">
                  {character.daily_actions?.labor_used || 0} / {character.daily_actions?.labor_total || 0}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCharacter(prevChar => ({
                    ...prevChar,
                    daily_actions: {
                      ...prevChar.daily_actions,
                      labor_used: Math.max(0, (prevChar.daily_actions?.labor_used || 0) - 1)
                    }
                  }))}
                  disabled={(character.daily_actions?.labor_used || 0) === 0}
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCharacter(prevChar => ({
                    ...prevChar,
                    daily_actions: {
                      ...prevChar.daily_actions,
                      labor_used: Math.min(
                        prevChar.daily_actions?.labor_total || 0,
                        (prevChar.daily_actions?.labor_used || 0) + 1
                      )
                    }
                  }))}
                  disabled={(character.daily_actions?.labor_used || 0) >= (character.daily_actions?.labor_total || 0)}
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  +
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-400">Marching, mining, hauling, physical tasks</p>
          </div>
        </CardContent>
      </Card>

      {/* Initiative & Combat Checks */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Combat Checks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Initiative */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-4 rounded-lg border border-purple-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300 font-semibold">Initiative</p>
              <p className="text-xs text-slate-400">Average of Agility & Perception</p>
            </div>
            {calculateInitiative() ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dices className="w-4 h-4 text-purple-400" />
                  <span className="font-mono text-purple-100 font-semibold text-lg">
                    {calculateInitiative().dice}d{calculateInitiative().sides} ie12 t7
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyDicePool(`${calculateInitiative().dice}d${calculateInitiative().sides} ie12 t7`)}
                  className="h-6 w-6 hover:bg-purple-700/30"
                >
                  {copiedPool === `${calculateInitiative().dice}d${calculateInitiative().sides} ie12 t7` ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-purple-400" />
                  )}
                </Button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Set Agility and Perception stats first</p>
            )}
          </div>

          {/* Soak */}
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 p-4 rounded-lg border border-red-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300 font-semibold">Soak (Physical)</p>
              <p className="text-xs text-slate-400">Health Check</p>
            </div>
            {calculateSoakResolve("Health") ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dices className="w-4 h-4 text-red-400" />
                    <span className="font-mono text-red-100 font-semibold text-lg">
                      {calculateSoakResolve("Health").baseDice}d{calculateSoakResolve("Health").sides} ie12 DC3
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(`${calculateSoakResolve("Health").baseDice}d${calculateSoakResolve("Health").sides} ie12 t${character.combat_checks?.soak_t || 4}`);
                      setCopiedSoak(true);
                      toast.success("Soak pool copied!");
                      setTimeout(() => setCopiedSoak(false), 2000);
                    }}
                    className="h-6 w-6 hover:bg-red-700/30"
                  >
                    {copiedSoak ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-red-400" />
                    )}
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  <Label className="text-xs text-slate-300">Current t modifier (baseline t4 + DV)</Label>
                  <Input
                    type="number"
                    value={character.combat_checks?.soak_t || 4}
                    onChange={(e) => setCharacter({
                      ...character,
                      combat_checks: {
                        ...character.combat_checks,
                        soak_t: parseInt(e.target.value) || 4
                      }
                    })}
                    className="bg-slate-700 border-slate-600 text-white h-8"
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500">Set Health stat first</p>
            )}
          </div>

          {/* Resolve */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/30 p-4 rounded-lg border border-indigo-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300 font-semibold">Resolve (Mental)</p>
              <p className="text-xs text-slate-400">Willpower Check</p>
            </div>
            {calculateSoakResolve("Willpower") ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dices className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono text-indigo-100 font-semibold text-lg">
                      {calculateSoakResolve("Willpower").baseDice}d{calculateSoakResolve("Willpower").sides} ie12 DC3
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(`${calculateSoakResolve("Willpower").baseDice}d${calculateSoakResolve("Willpower").sides} ie12 t${character.combat_checks?.resolve_t || 4}`);
                      setCopiedResolve(true);
                      toast.success("Resolve pool copied!");
                      setTimeout(() => setCopiedResolve(false), 2000);
                    }}
                    className="h-6 w-6 hover:bg-indigo-700/30"
                  >
                    {copiedResolve ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-indigo-400" />
                    )}
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  <Label className="text-xs text-slate-300">Current t modifier (baseline t4 + DV)</Label>
                  <Input
                    type="number"
                    value={character.combat_checks?.resolve_t || 4}
                    onChange={(e) => setCharacter({
                      ...character,
                      combat_checks: {
                        ...character.combat_checks,
                        resolve_t: parseInt(e.target.value) || 4
                      }
                    })}
                    className="bg-slate-700 border-slate-600 text-white h-8"
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500">Set Willpower stat first</p>
            )}
          </div>

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-1 text-xs text-slate-400">
            <p><span className="font-semibold text-amber-400">Soak Formula:</span> Base DC 3, t4 +DV of attack</p>
            <p><span className="font-semibold text-amber-400">t10+ Rule:</span> Soak checks above t10 become t11 -5 and continue</p>
          </div>
        </CardContent>
      </Card>

      {/* Progression & Movement */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-amber-100">Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sp" className="text-slate-300">Strife Points (SP)</Label>
              <Input
                id="sp"
                type="number"
                value={character.strife_points}
                onChange={(e) => setCharacter({
                  ...character,
                  strife_points: parseInt(e.target.value) || 0
                })}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-400">
                From encounters (0-12d3). For stats, skills, powers, upgrades.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gp" className="text-slate-300">Growth Points (GP)</Label>
              <Input
                id="gp"
                type="number"
                value={character.growth_points}
                onChange={(e) => setCharacter({
                  ...character,
                  growth_points: parseInt(e.target.value) || 0
                })}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-400">
                For stats/skills/upgrades only (NOT new powers).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-amber-100">Movement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Primary Movement Stat</Label>
              <Select
                value={character.movement?.primary_stat || "Agility"}
                onValueChange={(value) => setCharacter({
                  ...character,
                  movement: { ...character.movement, primary_stat: value }
                })}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Agility">Agility</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400">Highest tier of Strength or Agility</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="improved-movement"
                  checked={character.movement?.improved_purchased || false}
                  onCheckedChange={(checked) => setCharacter({
                    ...character,
                    movement: { ...character.movement, improved_purchased: checked }
                  })}
                />
                <label htmlFor="improved-movement" className="text-sm text-slate-300">
                  Improved Movement Purchased
                </label>
              </div>
              {character.movement?.improved_purchased && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Upgrades (5 SP each, max double base)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={character.movement?.upgrades || 0}
                    onChange={(e) => setCharacter({
                      ...character,
                      movement: { ...character.movement, upgrades: parseInt(e.target.value) || 0 }
                    })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 p-4 rounded-lg border border-amber-700/50">
              <p className="text-xs text-slate-400 mb-2">Base Movement Speed</p>
              <p className="text-3xl font-bold text-amber-400">
                {calculateMovementSpeed()} ft
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Per action • Sprint: {calculateMovementSpeed() * 2} ft (2 actions)
              </p>
              <p className="text-xs text-slate-400">
                Dead Run: {Math.round(calculateMovementSpeed() * 1.5)} ft/action (+4t to AD/attacks)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}