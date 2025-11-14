
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Plus, Trash2, Shield, Sword, Package } from "lucide-react";

export default function EquipmentSection({ character, setCharacter }) {
  const addWeapon = () => {
    setCharacter({
      ...character,
      equipment: {
        ...character.equipment,
        weapons: [...(character.equipment.weapons || []), {
          name: "",
          damage_value: 1,
          damage_level: "Lesser",
          damage_type: "Physical",
          mmd: "",
          heavy_rating: "",
          ammo_capacity: "",
          tags: "",
          notes: ""
        }]
      }
    });
  };

  const updateWeapon = (index, field, value) => {
    const newWeapons = [...(character.equipment.weapons || [])];
    newWeapons[index] = { ...newWeapons[index], [field]: value };
    setCharacter({
      ...character,
      equipment: { ...character.equipment, weapons: newWeapons }
    });
  };

  const removeWeapon = (index) => {
    setCharacter({
      ...character,
      equipment: {
        ...character.equipment,
        weapons: character.equipment.weapons.filter((_, i) => i !== index)
      }
    });
  };

  const addArmor = () => {
    setCharacter({
      ...character,
      equipment: {
        ...character.equipment,
        armor: [...(character.equipment.armor || []), {
          name: "",
          durability: "",
          protection: 0,
          reliability: 0,
          restriction: "",
          coverage: "Partial",
          tags: "",
          notes: ""
        }]
      }
    });
  };

  const updateArmor = (index, field, value) => {
    const newArmor = [...(character.equipment.armor || [])];
    newArmor[index] = { ...newArmor[index], [field]: value };
    setCharacter({
      ...character,
      equipment: { ...character.equipment, armor: newArmor }
    });
  };

  const removeArmor = (index) => {
    setCharacter({
      ...character,
      equipment: {
        ...character.equipment,
        armor: character.equipment.armor.filter((_, i) => i !== index)
      }
    });
  };

  const addMisc = () => {
    setCharacter({
      ...character,
      equipment: {
        ...character.equipment,
        misc: [...(character.equipment.misc || []), {
          name: "",
          description: ""
        }]
      }
    });
  };

  const updateMisc = (index, field, value) => {
    const newMisc = [...(character.equipment.misc || [])];
    newMisc[index] = { ...newMisc[index], [field]: value };
    setCharacter({
      ...character,
      equipment: { ...character.equipment, misc: newMisc }
    });
  };

  const removeMisc = (index) => {
    setCharacter({
      ...character,
      equipment: {
        ...character.equipment,
        misc: character.equipment.misc.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Currency */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-amber-100">Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-slate-300">Available Currency</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={character.equipment?.currency || 100}
                onChange={(e) => setCharacter({
                  ...character,
                  equipment: {
                    ...character.equipment,
                    currency: parseInt(e.target.value) || 0
                  }
                })}
                className="bg-slate-700/50 border-slate-600 text-white max-w-xs"
              />
              <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-700/50 px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold text-yellow-400">
                  {character.equipment?.currency || 100} ⚜
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400">Starting: 100 (Kevlar or Superhero suit)</p>
          </div>
        </CardContent>
      </Card>

      {/* Weapons */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Sword className="w-5 h-5" />
            Weapons
          </CardTitle>
          <Button
            onClick={addWeapon}
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Weapon
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(character.equipment?.weapons || []).map((weapon, index) => (
            <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Weapon Name</Label>
                    <Input
                      value={weapon.name}
                      onChange={(e) => updateWeapon(index, 'name', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white font-semibold"
                      placeholder="e.g., Longsword, M1911"
                    />
                  </div>

                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="space-y-2">
                      <Label className="text-slate-300">DV</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={weapon.damage_value}
                        onChange={(e) => updateWeapon(index, 'damage_value', parseFloat(e.target.value) || 0)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">DL</Label>
                      <Input
                        value={weapon.damage_level}
                        onChange={(e) => updateWeapon(index, 'damage_level', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Lesser/Middling/Strong"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-slate-300">Damage Type</Label>
                      <Input
                        value={weapon.damage_type}
                        onChange={(e) => updateWeapon(index, 'damage_type', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Physical/Energy/Slashing/Piercing"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-slate-300">MMD</Label>
                      <Input
                        value={weapon.mmd}
                        onChange={(e) => updateWeapon(index, 'mmd', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., 8/16"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">HR (Heavy Rating)</Label>
                      <Input
                        value={weapon.heavy_rating}
                        onChange={(e) => updateWeapon(index, 'heavy_rating', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., hM(lU)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Ammo</Label>
                      <Input
                        value={weapon.ammo_capacity}
                        onChange={(e) => updateWeapon(index, 'ammo_capacity', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., 15(L)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Tags</Label>
                    <Input
                      value={weapon.tags}
                      onChange={(e) => updateWeapon(index, 'tags', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., Reach, Splash(10ft), Seeking, Fire Rate(3)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Notes</Label>
                    <Textarea
                      value={weapon.notes}
                      onChange={(e) => updateWeapon(index, 'notes', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Wear, reliability, special properties..."
                      rows={2}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeWeapon(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {(character.equipment?.weapons || []).length === 0 && (
            <p className="text-center py-8 text-slate-400">No weapons yet</p>
          )}
        </CardContent>
      </Card>

      {/* Armor */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Armor & Protection
          </CardTitle>
          <Button
            onClick={addArmor}
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Armor
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(character.equipment?.armor || []).map((armor, index) => (
            <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Armor Name</Label>
                    <Input
                      value={armor.name}
                      onChange={(e) => updateArmor(index, 'name', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white font-semibold"
                      placeholder="e.g., Kevlar Vest, Power Suit Mk.2"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Durability</Label>
                      <Input
                        value={armor.durability}
                        onChange={(e) => updateArmor(index, 'durability', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., Middling Physical Resistance"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Prot</Label>
                      <Input
                        type="number"
                        value={armor.protection}
                        onChange={(e) => updateArmor(index, 'protection', parseInt(e.target.value) || 0)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Rel</Label>
                      <Input
                        type="number"
                        value={armor.reliability}
                        onChange={(e) => updateArmor(index, 'reliability', parseInt(e.target.value) || 0)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Restriction (Res)</Label>
                      <Input
                        value={armor.restriction}
                        onChange={(e) => updateArmor(index, 'restriction', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., Low Uncanny Agility"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Coverage</Label>
                      <Input
                        value={armor.coverage}
                        onChange={(e) => updateArmor(index, 'coverage', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Partial (+4t) / Full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Tags</Label>
                    <Input
                      value={armor.tags}
                      onChange={(e) => updateArmor(index, 'tags', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., Shock Absorbent, Barrier"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Notes</Label>
                    <Textarea
                      value={armor.notes}
                      onChange={(e) => updateArmor(index, 'notes', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Condition, special properties..."
                      rows={2}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArmor(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {(character.equipment?.armor || []).length === 0 && (
            <p className="text-center py-8 text-slate-400">No armor yet</p>
          )}
        </CardContent>
      </Card>

      {/* Miscellaneous */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Miscellaneous Gear
          </CardTitle>
          <Button
            onClick={addMisc}
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(character.equipment?.misc || []).map((item, index) => (
            <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-slate-300">Item Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateMisc(index, 'name', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., Grappling Hook, Medical Kit"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMisc(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateMisc(index, 'description', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Utility, mechanics, condition..."
                  rows={2}
                />
              </div>
            </div>
          ))}
          {(character.equipment?.misc || []).length === 0 && (
            <p className="text-center py-8 text-slate-400">No miscellaneous items yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
