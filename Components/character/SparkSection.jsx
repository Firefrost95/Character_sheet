import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Zap, Cpu, Wrench } from "lucide-react";

const INVENTION_RANKS = ["D", "C", "B", "A", "S"];
const RANK_COSTS = { "D": 10, "C": 20, "B": 40, "A": 80, "S": 160 };

export default function SparkSection({ character, setCharacter }) {
  const updateFacet = (value) => {
    setCharacter({
      ...character,
      spark_projects: { ...character.spark_projects, facet: value }
    });
  };

  const addComponent = () => {
    const spark = character.spark_projects || {};
    setCharacter({
      ...character,
      spark_projects: {
        ...spark,
        components: [...(spark.components || []), {
          name: "",
          description: "",
          effects: ""
        }]
      }
    });
  };

  const updateComponent = (index, field, value) => {
    const components = [...(character.spark_projects?.components || [])];
    components[index] = { ...components[index], [field]: value };
    setCharacter({
      ...character,
      spark_projects: { ...character.spark_projects, components }
    });
  };

  const removeComponent = (index) => {
    setCharacter({
      ...character,
      spark_projects: {
        ...character.spark_projects,
        components: (character.spark_projects?.components || []).filter((_, i) => i !== index)
      }
    });
  };

  const addInvention = () => {
    const spark = character.spark_projects || {};
    setCharacter({
      ...character,
      spark_projects: {
        ...spark,
        inventions: [...(spark.inventions || []), {
          name: "",
          rank: "D",
          sp_cost: 10,
          description: "",
          requirements: "",
          variants: []
        }]
      }
    });
  };

  const updateInvention = (index, field, value) => {
    const inventions = [...(character.spark_projects?.inventions || [])];
    inventions[index] = { ...inventions[index], [field]: value };
    
    if (field === 'rank') {
      inventions[index].sp_cost = RANK_COSTS[value];
    }
    
    setCharacter({
      ...character,
      spark_projects: { ...character.spark_projects, inventions }
    });
  };

  const removeInvention = (index) => {
    setCharacter({
      ...character,
      spark_projects: {
        ...character.spark_projects,
        inventions: (character.spark_projects?.inventions || []).filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Facet */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Spark Facet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Facet / Specialty</Label>
            <Input
              value={character.spark_projects?.facet || ""}
              onChange={(e) => updateFacet(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
              placeholder="e.g., Robotics, Energy Weapons, Cybernetics, Aerospace Engineering"
            />
            <p className="text-xs text-slate-400">
              Counts as both Craft and Knowledge skill. Allows MDG stacking one additional time within this specialty.
            </p>
          </div>

          <div className="bg-slate-700/30 p-3 rounded border border-slate-600 text-xs text-slate-400">
            <p className="mb-1"><span className="text-amber-400">Rule of Four:</span> Projects split into Components (pieces), Variants (specialized versions), and Inventions (SP-required)</p>
            <p><span className="text-amber-400">SP Gain:</span> Sparks gain 1/10 SP when inventions fight or are used effectively in combat</p>
          </div>
        </CardContent>
      </Card>

      {/* Components */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Components
          </CardTitle>
          <Button onClick={addComponent} className="bg-amber-600 hover:bg-amber-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-400">
            Pieces with little use alone but grant benefits/detriments to items made using them. Usually don't require SP.
          </p>

          {(character.spark_projects?.components || []).map((component, index) => (
            <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Component Name</Label>
                    <Input
                      value={component.name}
                      onChange={(e) => updateComponent(index, 'name', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white font-semibold"
                      placeholder="e.g., Spider-Silk Weave, Arc Reactor Core"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Description</Label>
                    <Textarea
                      value={component.description}
                      onChange={(e) => updateComponent(index, 'description', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="What is it, how is it made..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Effects / Benefits</Label>
                    <Textarea
                      value={component.effects}
                      onChange={(e) => updateComponent(index, 'effects', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Higher Res armor, longer power suit runtime, +MMD weapons..."
                      rows={2}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeComponent(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {(character.spark_projects?.components || []).length === 0 && (
            <p className="text-center py-8 text-slate-400 text-sm">No components yet</p>
          )}
        </CardContent>
      </Card>

      {/* Inventions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Inventions (Projects)
          </CardTitle>
          <Button onClick={addInvention} className="bg-amber-600 hover:bg-amber-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Invention
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-400">
            True Sparktech requiring SP. D=plausible, C=sci-fi, B+=comic book. Can use Components for SP discounts.
          </p>

          {(character.spark_projects?.inventions || []).map((invention, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-4 rounded-lg border-2 border-purple-700/50 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Invention Name</Label>
                      <Input
                        value={invention.name}
                        onChange={(e) => updateInvention(index, 'name', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white font-semibold"
                        placeholder="e.g., Power Armor Mk.1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Rank</Label>
                      <Select
                        value={invention.rank}
                        onValueChange={(value) => updateInvention(index, 'rank', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INVENTION_RANKS.map(rank => (
                            <SelectItem key={rank} value={rank}>
                              {rank}-Rank ({RANK_COSTS[rank]} SP)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">SP Cost</Label>
                      <Input
                        type="number"
                        value={invention.sp_cost}
                        onChange={(e) => updateInvention(index, 'sp_cost', parseInt(e.target.value) || 0)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <p className="text-xs text-slate-400">Base: {RANK_COSTS[invention.rank]}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Description</Label>
                    <Textarea
                      value={invention.description}
                      onChange={(e) => updateInvention(index, 'description', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="What does it do, mechanics, capabilities..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Requirements / Materials</Label>
                    <Textarea
                      value={invention.requirements}
                      onChange={(e) => updateInvention(index, 'requirements', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Skill requirements, stat minimums, rare materials needed..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Variants (comma-separated)</Label>
                    <Input
                      value={(invention.variants || []).join(", ")}
                      onChange={(e) => updateInvention(index, 'variants', e.target.value.split(",").map(v => v.trim()))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., Heavy Armor (more Prot, lower Agility), Stealth Armor (less Prot, +Stealth)"
                    />
                    <p className="text-xs text-slate-400">Specialized forms with balanced tradeoffs (no SP if equal)</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInvention(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {(character.spark_projects?.inventions || []).length === 0 && (
            <p className="text-center py-8 text-slate-400 text-sm">No inventions yet</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Material Scarcity (SP Reduction)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-400">
          <p>• <span className="text-amber-400">Rare:</span> Gold, silver, crystals → up to –3 SP</p>
          <p>• <span className="text-amber-400">Illegal:</span> Uranium, specific blood/organs, dangerous drugs → up to –10 SP</p>
          <p>• <span className="text-amber-400">Unique:</span> Artifacts, specific powers, one-of-a-kind materials → up to –40 SP (min 15)</p>
        </CardContent>
      </Card>
    </div>
  );
}