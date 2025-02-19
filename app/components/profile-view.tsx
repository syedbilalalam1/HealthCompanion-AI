import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Star, Clock, Edit } from "lucide-react"

export default function ProfileView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 space-y-6"
    >
      <div className="text-center mb-8">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">John Doe</h2>
        <p className="text-gray-600">Posture Enthusiast</p>
        <Button variant="outline" size="sm" className="mt-4">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>john.doe@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Age:</span>
              <span>32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Height:</span>
              <span>180 cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span>75 kg</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">42</div>
            <div className="text-sm text-gray-600">Exercises Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">7.5/10</div>
            <div className="text-sm text-gray-600">Current Posture Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">14</div>
            <div className="text-sm text-gray-600">Days Active</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-600">Achievements Unlocked</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Achievements</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <span>7-Day Streak Master</span>
            </li>
            <li className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <span>Posture Perfect (Score 7+)</span>
            </li>
            <li className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <span>Exercise Explorer (10+ Completed)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

