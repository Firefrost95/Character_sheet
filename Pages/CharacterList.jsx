import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Swords, User, Sparkles, Trash2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function CharacterList() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('torchdice_characters') || '[]');
    setCharacters(stored.sort((a, b) => new Date(b.updated_date || 0) - new Date(a.updated_date || 0)));
  }, []);

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this character permanently?')) {
      const updated = characters.filter(c => c.id !== id);
      localStorage.setItem('torchdice_characters', JSON.stringify(updated));
      setCharacters(updated);
      toast.success('Character deleted');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-100 mb-2 flex items-center gap-3">
              <Swords className="w-10 h-10 text-amber-400" />
              Torchdice Character Vault
            </h1>
            <p className="text-slate-400 text-lg">Manage your heroes and legends</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => document.getElementById('import-file-input').click()}
              variant="outline"
              className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white font-semibold px-6 py-6 text-lg shadow-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Import
            </Button>
            <input
              id="import-file-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const imported = JSON.parse(event.target.result);
                      const newId = Date.now().toString();
                      const now = new Date().toISOString();
                      const newChar = { ...imported, id: newId, created_date: now, updated_date: now };
                      const stored = JSON.parse(localStorage.getItem('torchdice_characters') || '[]');
                      stored.push(newChar);
                      localStorage.setItem('torchdice_characters', JSON.stringify(stored));
                      setCharacters(stored.sort((a, b) => new Date(b.updated_date || 0) - new Date(a.updated_date || 0)));
                      toast.success(`${imported.name || 'Character'} imported successfully!`);
                    } catch (error) {
                      toast.error('Failed to import character');
                    }
                  };
                  reader.readAsText(file);
                }
                e.target.value = '';
              }}
            />
            <Link to={createPageUrl("CharacterSheet")}>
              <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold px-6 py-6 text-lg shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                New Character
              </Button>
            </Link>
          </div>
        </div>

        {/* Character Grid */}
        {characters.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Sparkles className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-2xl font-semibold text-slate-400 mb-2">No Characters Yet</h3>
              <p className="text-slate-500 mb-6">Create your first hero to begin your adventure</p>
              <Link to={createPageUrl("CharacterSheet")}>
                <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Character
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {characters.map((character) => (
              <motion.div key={character.id} variants={item}>
                <Link to={createPageUrl(`CharacterSheet?id=${character.id}`)}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 group overflow-hidden relative">
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(e, character.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-900/50 z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Character Portrait */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                      {character.photo_url ? (
                        <img
                          src={character.photo_url}
                          alt={character.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-20 h-20 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      
                      {/* Quick Stats Overlay */}
                      <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                        <div className="bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-amber-400 font-semibold">
                          SP: {character.strife_points || 0}
                        </div>
                        <div className="bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-emerald-400 font-semibold">
                          GP: {character.growth_points || 0}
                        </div>
                      </div>
                    </div>

                    {/* Character Info */}
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-amber-100 mb-2 group-hover:text-amber-300 transition-colors">
                        {character.name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        {character.race && (
                          <p className="text-slate-400">
                            <span className="text-slate-500">Race:</span>{" "}
                            <span className="text-slate-300">{character.race}</span>
                          </p>
                        )}
                        {character.power && (
                          <p className="text-slate-400">
                            <span className="text-slate-500">Power:</span>{" "}
                            <span className="text-slate-300">{character.power}</span>
                          </p>
                        )}
                        {character.size && (
                          <p className="text-slate-400">
                            <span className="text-slate-500">Size:</span>{" "}
                            <span className="text-slate-300">{character.size}</span>
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}