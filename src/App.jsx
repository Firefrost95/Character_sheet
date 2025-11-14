import { useState } from 'react'
import CharacterList from './Pages/Characterlist.jsx'
import CharacterSheet from './Pages/CharacterSheet.jsx'
import './App.css'

export default function App() {
  const [currentView, setCurrentView] = useState('list')
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character)
    setCurrentView('sheet')
  }

  const handleBack = () => {
    setCurrentView('list')
    setSelectedCharacter(null)
  }

  return (
    <div className="app-container">
      {currentView === 'list' ? (
        <CharacterList onSelectCharacter={handleSelectCharacter} />
      ) : (
        <CharacterSheet
          character={selectedCharacter}
          onBack={handleBack}
        />
      )}
    </div>
  )
}
