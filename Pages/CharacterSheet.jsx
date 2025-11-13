
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import CharacterBasics from "../Components/character/CharacterBasics.jsx/index.js";
import StatsSection from "../Components/character/StatsSection.jsx/index.js";
import SkillsSection from "../Components/character/SkillsSection.jsx";
import PowersSection from "../components/character/PowersSection";
import EquipmentSection from "../components/character/EquipmentSection";
import HealthSection from "../components/character/HealthSection";
import CompanionsSection from "../components/character/CompanionsSection";
import RenownSection from "../components/character/RenownSection";

export default function CharacterSheet() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get('id');

  const [character, setCharacter] = useState({
    name: "",
    photo_url: "",
    background: "",
    description: "",
    power: "",
    race: "",
    mass: { level: "Mid", tier: "Light" },
    size: "Medium",
    strife_points: 0,
    growth_points: 0,
    daily_actions: { craft_total: 0, craft_used: 0, labor_total: 0, labor_used: 0 },
    movement: { primary_stat: "Agility", improved_purchased: false, upgrades: 0 },
    renown: {
      veterancy_points: 0,
      veterancy_level: 0,
      infamy_points: 0,
      infamy_level: 0,
      reputation_points: 0,
      reputation_level: 0,
      reputation_community: ""
    },
    companions: [],
    stats: [
      { name: "Strength", tier: "Mortal", level: "Low", is_conditional: false },
      { name: "Agility", tier: "Mortal", level: "Low", is_conditional: false },
      { name: "Health", tier: "Mortal", level: "Low", is_conditional: false },
      { name: "Perception", tier: "Mortal", level: "Low", is_conditional: false },
      { name: "Intellect", tier: "Mortal", level: "Low", is_conditional: false },
      { name: "Willpower", tier: "Mortal", level: "Low", is_conditional: false },
      { name: "Charisma", tier: "Mortal", level: "Low", is_conditional: false }
    ],
    skills: [],
    powers: [],
    spark_projects: { facet: "", components: [], inventions: [] },
    equipment: { armor: [], weapons: [], misc: [], currency: 100 },
    health: {
      durability_type: "Lesser Everything Toughness",
      durability_level: "",
      vulnerabilities: [],
      injuries: [],
      status_effects: [],
      wounds: 0
    }
  });

  const { data: existingCharacter, isLoading } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => base44.entities.Character.get(characterId),
    enabled: !!characterId,
  });

  useEffect(() => {
    if (existingCharacter) {
      setCharacter(existingCharacter);
    }
  }, [existingCharacter]);

  const handleExport = () => {
    try {
      if (!character.name) {
        toast.error("Please enter a character name before exporting");
        return;
      }

      // Create a clean copy without id/timestamps for sharing
      const exportData = {
        ...character,
        exported_date: new Date().toISOString(),
        torchdice_version: "1E"
      };

      // Create downloadable JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_torchdice.json`;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger download
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`"${character.name}" exported successfully!`);
      }, 0);
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export character. Check console for details.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("CharacterList"))}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-amber-100">
                {character.name || "New Character"}
              </h1>
              <p className="text-slate-400">
                {characterId ? "Edit character sheet" : "Create a new hero"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Character
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="basics" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700 p-1">
            <TabsTrigger value="basics" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Basics
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Stats
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Skills
            </TabsTrigger>
            <TabsTrigger value="powers" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Powers
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Equipment
            </TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Health
            </TabsTrigger>
            <TabsTrigger value="companions" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Companions
            </TabsTrigger>
            <TabsTrigger value="renown" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Renown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <CharacterBasics character={character} setCharacter={setCharacter} />
          </TabsContent>

          <TabsContent value="stats">
            <StatsSection character={character} setCharacter={setCharacter} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsSection character={character} setCharacter={setCharacter} />
          </TabsContent>

          <TabsContent value="powers">
            <PowersSection character={character} setCharacter={setCharacter} />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentSection character={character} setCharacter={setCharacter} />
          </TabsContent>

          <TabsContent value="health">
            <HealthSection character={character} setCharacter={setCharacter} />
          </TabsContent>

          <TabsContent value="companions">
            <CompanionsSection character={character} setCharacter={setCharacter} />
          </TabsContent>

          <TabsContent value="renown">
            <RenownSection character={character} setCharacter={setCharacter} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
