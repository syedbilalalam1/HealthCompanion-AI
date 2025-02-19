import { Person, KeyPoint, BodyPart } from "@/types/pose"
import { toast } from "sonner"
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'

export interface PoseDetectionResult {
  pose: string
  confidence: number
  keypoints: KeyPoint[]
  feedback: string[]
  isCorrect?: boolean
}

let pose: Pose | null = null
let isInitialized = false

// Initialize MediaPipe Pose
export async function initPoseDetection() {
  if (!pose) {
    console.log('Creating new Pose instance')
    pose = new Pose({
      locateFile: (file) => {
        console.log('Loading MediaPipe file:', file)
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`
      }
    })

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
  }

  if (!isInitialized) {
    console.log('Initializing pose detection')
    try {
      await pose.initialize()
      isInitialized = true
      console.log('Pose detection initialized successfully')
    } catch (error) {
      console.error('Error initializing pose detection:', error)
      isInitialized = false
      pose = null
      throw error
    }
  }

  return pose
}

// Analyze pose and provide feedback
function analyzePoseAlignment(results: Results): string[] {
  const feedback: string[] = []
  const landmarks = results.poseLandmarks

  if (!landmarks) return feedback

  // Check shoulder alignment
  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  if (Math.abs(leftShoulder.y - rightShoulder.y) > 0.1) {
    feedback.push("Shoulders are not level - try to keep them even")
  }

  // Check hip alignment
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  if (Math.abs(leftHip.y - rightHip.y) > 0.1) {
    feedback.push("Hips are not level - try to balance your weight evenly")
  }

  // Check for extended side angle pose
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  // Check front leg bend
  const frontLegAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  if (Math.abs(frontLegAngle - 90) > 15) {
    feedback.push("Front knee should be at 90 degrees")
  }

  // Check back leg straightness
  const backLegAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
  if (backLegAngle < 160) {
    feedback.push("Back leg should be straighter")
  }

  return feedback
}

// Calculate angle between three points
function calculateAngle(a: any, b: any, c: any): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs(radians * 180.0 / Math.PI)
  if (angle > 180.0) angle = 360.0 - angle
  return angle
}

// Function to detect and classify pose
export async function detectAndClassifyPose(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): Promise<PoseDetectionResult | null> {
  try {
    const poseDetector = await initPoseDetection()
    if (!poseDetector) {
      throw new Error("Failed to initialize pose detector")
    }

    return new Promise((resolve, reject) => {
      let frameProcessed = false

      // Set up the onResults callback
      poseDetector.onResults((results) => {
        if (!results.poseLandmarks) {
          console.log('No pose landmarks detected')
          if (!frameProcessed) {
            frameProcessed = true
            resolve(null)
          }
          return
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          console.error('Failed to get canvas context')
          if (!frameProcessed) {
            frameProcessed = true
            resolve(null)
          }
          return
        }

        // Clear canvas and set dimensions
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw the pose landmarks with thicker lines for better visibility
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: '#4ADE80',
          lineWidth: 4
        })
        drawLandmarks(ctx, results.poseLandmarks, {
          color: '#22C55E',
          lineWidth: 2,
          radius: 6
        })
        ctx.restore()

        // Analyze pose
        const feedback = analyzePoseAlignment(results)
        const isCorrect = feedback.length === 0

        // Show feedback (with debounced toasts)
        if (isCorrect) {
          toast.success("Great job! Your pose is correct!", {
            id: "pose-correct",
            duration: 1000
          })
        } else if (feedback.length > 0) {
          toast.info(feedback[0], {
            description: "Try adjusting your position",
            id: "pose-feedback",
            duration: 2000
          })
        }

        if (!frameProcessed) {
          frameProcessed = true
          resolve({
            pose: "Extended Side Angle",
            confidence: 1.0,
            keypoints: results.poseLandmarks.map((lm: any, index: number) => ({
              bodyPart: index,
              coordinate: { x: lm.x, y: lm.y },
              score: lm.visibility || 0
            })),
            feedback,
            isCorrect
          })
        }
      })

      // Send the video frame to MediaPipe
      console.log('Sending frame to MediaPipe')
      poseDetector.send({ image: video }).catch((error) => {
        console.error('Error sending frame to MediaPipe:', error)
        if (!frameProcessed) {
          frameProcessed = true
          reject(error)
        }
      })

      // Set a timeout to resolve if no results are received
      setTimeout(() => {
        if (!frameProcessed) {
          console.log('Frame processing timed out')
          frameProcessed = true
          resolve(null)
        }
      }, 1000)
    })
  } catch (error) {
    console.error('Error in pose detection:', error)
    if (error instanceof Error) {
      toast.error(error.message)
    }
    return null
  }
}

// Function to draw pose keypoints on canvas
export function drawPose(
  ctx: CanvasRenderingContext2D,
  keypoints: KeyPoint[],
  videoWidth: number,
  videoHeight: number,
  isCorrect: boolean = false
) {
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Scale factors
  const scaleX = ctx.canvas.width / videoWidth
  const scaleY = ctx.canvas.height / videoHeight

  // Draw keypoints
  keypoints.forEach((keypoint) => {
    const x = keypoint.coordinate.x * scaleX
    const y = keypoint.coordinate.y * scaleY

    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = isCorrect ? '#22C55E' : keypoint.score > 0.3 ? '#4C1D95' : '#9CA3AF'
    ctx.fill()
  })

  // Draw connections
  const connections = [
    // Torso
    [BodyPart.LEFT_SHOULDER, BodyPart.RIGHT_SHOULDER],
    [BodyPart.LEFT_SHOULDER, BodyPart.LEFT_HIP],
    [BodyPart.RIGHT_SHOULDER, BodyPart.RIGHT_HIP],
    [BodyPart.LEFT_HIP, BodyPart.RIGHT_HIP],
    // Arms
    [BodyPart.LEFT_SHOULDER, BodyPart.LEFT_ELBOW],
    [BodyPart.LEFT_ELBOW, BodyPart.LEFT_WRIST],
    [BodyPart.RIGHT_SHOULDER, BodyPart.RIGHT_ELBOW],
    [BodyPart.RIGHT_ELBOW, BodyPart.RIGHT_WRIST],
    // Legs
    [BodyPart.LEFT_HIP, BodyPart.LEFT_KNEE],
    [BodyPart.LEFT_KNEE, BodyPart.LEFT_ANKLE],
    [BodyPart.RIGHT_HIP, BodyPart.RIGHT_KNEE],
    [BodyPart.RIGHT_KNEE, BodyPart.RIGHT_ANKLE],
  ]

  connections.forEach(([partA, partB]) => {
    const a = keypoints[partA]
    const b = keypoints[partB]

    if (a.score > 0.3 && b.score > 0.3) {
      ctx.beginPath()
      ctx.moveTo(a.coordinate.x * scaleX, a.coordinate.y * scaleY)
      ctx.lineTo(b.coordinate.x * scaleX, b.coordinate.y * scaleY)
      ctx.strokeStyle = isCorrect ? '#4ADE80' : '#818CF8'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  })
} 