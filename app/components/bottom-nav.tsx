"use client"

import { Home, MessageCircle, Camera, Heart, Settings } from "lucide-react"

interface BottomNavProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function BottomNav({ activeView, setActiveView }: BottomNavProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "health", icon: Heart, label: "Health" },
    { id: "yoga", icon: Camera, label: "Analyze" },
    { id: "health-chat", icon: MessageCircle, label: "Chat" },
    { id: "settings", icon: Settings, label: "Settings" }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around h-14">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                activeView === id 
                  ? "text-purple-600 bg-purple-50/50" 
                  : "text-gray-500 hover:text-purple-400 hover:bg-purple-50/30"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${activeView === id ? "animate-bounce" : ""}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

