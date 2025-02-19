"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import HomeView from "./components/home-view"
import HealthTrackingView from "./components/health-tracking-view"
import YogaPostureAnalysis from "./components/yoga-posture-analysis"
import PostureGuideView from "./components/posture-guide-view"
import HealthChat from "./components/health-chat"
import ProfileView from "./components/profile-view"
import SettingsView from "./components/settings-view"
import BottomNav from "./components/bottom-nav"
import AuthModal from "./components/auth-modal"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { HealthData, HealthReport } from "@/types/health"

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [activeView, setActiveView] = useState("home")
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [healthData, setHealthData] = useState<HealthData | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user)
    })

    return () => unsubscribe()
  }, [])

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    setIsSignedIn(true)
  }

  const handleHealthSubmit = (data: HealthData & { recommendations: HealthReport }) => {
    setHealthData(data)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto pb-16">
        <AnimatePresence mode="wait">
          {activeView === "home" && (
            <HomeView
              key="home"
              setActiveView={setActiveView}
              isSignedIn={isSignedIn}
              onSignInClick={() => setShowAuthModal(true)}
              healthData={healthData}
            />
          )}
          {activeView === "health" && (
            <HealthTrackingView 
              key="health" 
              onHealthSubmit={handleHealthSubmit}
              existingData={healthData}
            />
          )}
          {activeView === "yoga" && <YogaPostureAnalysis key="yoga" setActiveView={setActiveView} />}
          {activeView === "health-chat" && <HealthChat key="health-chat" />}
          {activeView === "posture-guide" && <PostureGuideView key="posture-guide" setActiveView={setActiveView} />}
          {activeView === "profile" && <ProfileView key="profile" />}
          {activeView === "settings" && <SettingsView key="settings" />}
        </AnimatePresence>
      </main>

      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  )
}

