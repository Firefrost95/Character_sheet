import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Award, Skull, Users as UsersIcon } from "lucide-react";

export default function RenownSection({ character, setCharacter }) {
  const calculatePointsNeeded = (level) => {
    return 5 + (level * 5);
  };

  const updateRenown = (field, value) => {
    setCharacter({
      ...character,
      renown: { ...character.renown, [field]: value }
    });
  };

  const renown = character.renown || {
    veterancy_points: 0,
    veterancy_level: 0,
    infamy_points: 0,
    infamy_level: 0,
    reputation_points: 0,
    reputation_level: 0,
    reputation_community: ""
  };

  return (
    <div className="space-y-6">
      {/* Veterancy (Heroes) */}
      <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-2 border-blue-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-100 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Veterancy (Heroes)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Points</Label>
              <Input
                type="number"
                min="0"
                value={renown.veterancy_points}
                onChange={(e) => updateRenown('veterancy_points', parseInt(e.target.value) || 0)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Level</Label>
              <Input
                type="number"
                min="0"
                value={renown.veterancy_level}
                onChange={(e) => updateRenown('veterancy_level', parseInt(e.target.value) || 0)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="bg-cyan-900/30 p-3 rounded border border-cyan-700/50">
              <p className="text-xs text-slate-400">Next Level Needs</p>
              <p className="text-xl font-bold text-cyan-400">{calculatePointsNeeded(renown.veterancy_level)} pts</p>
            </div>
          </div>

          <div className="bg-slate-700/30 p-3 rounded border border-slate-600 text-xs text-slate-400">
            <p className="mb-1"><span className="text-cyan-400">Use:</span> Recruiting sidekicks, building bases, restricted equipment access (2 levels for Restricted tier)</p>
            <p><span className="text-cyan-400">Gain:</span> 1 point per non-PRE encounter. Only exists while active Hero.</p>
          </div>
        </CardContent>
      </Card>

      {/* Infamy (Villains) */}
      <Card className="bg-gradient-to-br from-red-900/20 to-purple-900/20 border-2 border-red-700/50">
        <CardHeader>
          <CardTitle className="text-red-100 flex items-center gap-2">
            <Skull className="w-5 h-5" />
            Infamy (Villains)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Points</Label>
              <Input
                type="number"
                min="0"
                value={renown.infamy_points}
                onChange={(e) => updateRenown('infamy_points', parseInt(e.target.value) || 0)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Level</Label>
              <Input
                type="number"
                min="0"
                value={renown.infamy_level}
                onChange={(e) => updateRenown('infamy_level', parseInt(e.target.value) || 0)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="bg-red-900/30 p-3 rounded border border-red-700/50">
              <p className="text-xs text-slate-400">Next Level Needs</p>
              <p className="text-xl font-bold text-red-400">{calculatePointsNeeded(renown.infamy_level)} pts</p>
            </div>
          </div>

          <div className="bg-slate-700/30 p-3 rounded border border-slate-600 text-xs text-slate-400">
            <p className="mb-1"><span className="text-red-400">Use:</span> Black market access (1+ level), hiring criminals, building bases, restricted equipment (1 level for Restricted tier)</p>
            <p className="mb-1"><span className="text-red-400">Gain:</span> 1 point per non-PRE encounter (schemes, defeating heroes)</p>
            <p><span className="text-red-400">Loss:</span> Can lose levels if soundly defeated or humiliated</p>
          </div>
        </CardContent>
      </Card>

      {/* Reputation (Neutrals) */}
      <Card className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border-2 border-amber-700/50">
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Reputation (Neutral)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Points</Label>
              <Input
                type="number"
                min="0"
                value={renown.reputation_points}
                onChange={(e) => updateRenown('reputation_points', parseInt(e.target.value) || 0)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Level</Label>
              <Input
                type="number"
                min="0"
                value={renown.reputation_level}
                onChange={(e) => updateRenown('reputation_level', parseInt(e.target.value) || 0)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="bg-amber-900/30 p-3 rounded border border-amber-700/50">
              <p className="text-xs text-slate-400">Next Level Needs</p>
              <p className="text-xl font-bold text-amber-400">{calculatePointsNeeded(renown.reputation_level)} pts</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Community / Region</Label>
            <Textarea
              value={renown.reputation_community || ""}
              onChange={(e) => updateRenown('reputation_community', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., Downtown district, Underground community, Coastal town..."
              rows={2}
            />
          </div>

          <div className="bg-slate-700/30 p-3 rounded border border-slate-600 text-xs text-slate-400">
            <p className="mb-1"><span className="text-amber-400">Use:</span> Base building, NPC recruitment (specific to community)</p>
            <p className="mb-1"><span className="text-amber-400">Gain:</span> 1 point per non-PRE encounter (difficulty, heroism, both)</p>
            <p><span className="text-amber-400">Loss:</span> Negative actions can damage or remove points entirely</p>
          </div>
        </CardContent>
      </Card>

      {/* Mercenary Note */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Mercenaries (Parallel Growth)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-400">
          <p>• Can gain <span className="text-cyan-400">Veterancy</span>, <span className="text-red-400">Infamy</span>, or <span className="text-amber-400">Reputation</span> depending on job type</p>
          <p>• Gaining too many levels in one can cause loss in others</p>
          <p>• Unmatched freedom in choice of work</p>
        </CardContent>
      </Card>
    </div>
  );
}