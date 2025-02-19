"use client"

import { motion } from "framer-motion"
import { Heart, Camera, BarChart2, User, BookOpen, LogIn, Activity, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LucideIcon } from "lucide-react"
import { HealthData } from "@/types/health"

interface HomeViewProps {
  setActiveView: (view: string) => void
  isSignedIn: boolean
  onSignInClick: () => void
  healthData?: HealthData | null
}

interface FeatureBoxProps {
  icon: LucideIcon
  title: string
  description: string
  onClick: () => void
  color: "purple" | "blue" | "green" | "yellow"
  className?: string
}

interface ProgressItemProps {
  label: string
  value: number
  color: string
  description: string
}

interface QuickStatProps {
  label: string
  value: string
  icon: LucideIcon
  trend: "up" | "down" | "neutral"
}

interface ActivityItemProps {
  icon: LucideIcon
  title: string
  description: string
  time: string
}

interface AchievementItemProps {
  title: string
  description: string
  progress: number
}

interface GoalItemProps {
  title: string
  deadline: string
  progress: number
}

export default function HomeView({ setActiveView, isSignedIn, onSignInClick, healthData }: HomeViewProps) {
  // Helper function to format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Helper function to get activity level text
  const getActivityLevelText = (level: string) => {
    const levels: { [key: string]: string } = {
      sedentary: "Sedentary",
      light: "Light",
      moderate: "Moderate",
      very: "Very Active",
      extra: "Extra Active"
    }
    return levels[level] || level
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50 pb-20"
    >
      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-90" />
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative px-6 py-8"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 rounded-lg p-2">
                <Activity className="h-8 w-8 text-white" />
              </div>
        <div>
                <h1 className="text-3xl font-bold text-white">Posture Fix</h1>
                <p className="text-purple-100">Your personal health companion</p>
              </div>
        </div>
        {isSignedIn ? (
          <Button
            variant="ghost"
            size="icon"
                className="text-white hover:bg-white/20"
            onClick={() => setActiveView("profile")}
          >
            <User className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
                className="bg-white text-purple-600 hover:bg-purple-50 transition-all duration-200 font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl"
            onClick={onSignInClick}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )}
          </div>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {isSignedIn ? (
          <>
            {/* Recent Health Report */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Card className="bg-white shadow-xl rounded-xl overflow-hidden border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Recent Health Report</h3>
                    <Button
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          onClick={() => setActiveView("health")}
                    >
                      View Details
                    </Button>
      </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 mb-1">Health Score</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {healthData ? "85%" : "--"}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">BMI</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {healthData ? healthData.bmi.toFixed(1) : "--"}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Activity Level</p>
                      <p className="text-2xl font-bold text-green-700">
                        {healthData ? getActivityLevelText(healthData.activityLevel) : "--"}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-600 mb-1">Last Check</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {healthData ? "Just Now" : "--"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature Grid */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-6"
            >
              <Card 
                className="cursor-pointer bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-shadow"
                onClick={() => setActiveView("health")}
              >
                <CardContent className="p-6 h-[220px] flex flex-col">
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-xl mb-3">Track Health</h3>
                    <p className="text-sm opacity-90 line-clamp-2">Monitor your health metrics and get personalized recommendations</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-shadow"
                onClick={() => setActiveView("yoga")}
              >
                <CardContent className="p-6 h-[220px] flex flex-col">
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-xl mb-3">Analyze Pose</h3>
                    <p className="text-sm opacity-90 line-clamp-2">Get real-time feedback on your posture and form</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-shadow"
                onClick={() => setActiveView("health-chat")}
              >
                <CardContent className="p-6 h-[220px] flex flex-col">
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-xl mb-3">Health Chat</h3>
                    <p className="text-sm opacity-90 line-clamp-2">Get answers to your health and wellness questions</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:shadow-lg transition-shadow"
                onClick={() => setActiveView("posture-guide")}
              >
                <CardContent className="p-6 h-[220px] flex flex-col">
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-xl mb-3">Guide</h3>
                    <p className="text-sm opacity-90 line-clamp-2">Learn proper posture techniques and exercises</p>
            </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to get started</h2>
            <p className="text-gray-600 mb-8">Track your health, analyze your posture, and get personalized recommendations</p>
            <Button
              onClick={onSignInClick}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-full"
            >
              Sign In
            </Button>
          </div>
      )}
      </main>
    </motion.div>
  )
}

function FeatureBox({ icon: Icon, title, description, onClick, color, className = "" }: FeatureBoxProps) {
  const colorClasses = {
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700",
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
    green: "bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700",
    yellow: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700",
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
    <Card
        className={`cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${colorClasses[color]}`}
      onClick={onClick}
    >
        <CardContent className="p-4">
          <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mb-3">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProgressItem({ label, value, color, description }: ProgressItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value}%</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full rounded-full ${color}`}
        />
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}

function QuickStat({ label, value, icon: Icon, trend }: QuickStatProps) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500"
  }

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`p-2 rounded-full ${trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50'}`}>
            <Icon className={`w-5 h-5 ${trendColors[trend]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ icon: Icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-purple-100 rounded-full p-2">
        <Icon className="w-4 h-4 text-purple-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-600">{description}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  )
}

function AchievementItem({ title, description, progress }: AchievementItemProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full rounded-full bg-purple-500"
        />
      </div>
    </div>
  )
}

function GoalItem({ title, deadline, progress }: GoalItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{deadline}</p>
      </div>
      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full rounded-full bg-green-500"
        />
      </div>
    </div>
  )
}

