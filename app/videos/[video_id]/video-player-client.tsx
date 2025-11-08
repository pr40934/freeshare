// working code

// 'use client'

// import { useEffect, useRef } from 'react'
// import dynamic from 'next/dynamic'
// import { sendViewData } from '../../api/api'
// import 'plyr-react/plyr.css'
// import './player.css'

// const Plyr = dynamic(() => import('plyr-react'), { ssr: false })

// interface VideoPlayerClientProps {
//   videoId: string
//   videoUrl: string
//   thumbnailUrl: string
//   title: string | null
//   description: string | null
// }

// export default function VideoPlayerClient({
//   videoId,
//   videoUrl,
//   thumbnailUrl,
//   title,
//   description,
// }: VideoPlayerClientProps) {
//   const watchTimeRef = useRef(0)
//   const viewTrackedRef = useRef(false)

//   // Track view function
//   async function trackView(id: string, duration: number) {
//     if (viewTrackedRef.current) return
//     viewTrackedRef.current = true

//     let viewerId = localStorage.getItem('viewer_id') || ''
//     if (!viewerId) {
//       viewerId = crypto.randomUUID()
//       localStorage.setItem('viewer_id', viewerId)
//     }

//     const screenRes = `${window.screen.width}x${window.screen.height}`
//     const payload = {
//       video_id: id,
//       viewer_id: viewerId,
//       duration,
//       screen_resolution: screenRes,
//     }

//     try {
//       await sendViewData(payload)
//     } catch (err) {
//       console.error('Track view failed', err)
//     }
//   }

//   // Track after 30s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       watchTimeRef.current += 1
//       if (watchTimeRef.current === 30) {
//         trackView(videoId, watchTimeRef.current)
//       }
//     }, 1000)

//     return () => {
//       clearInterval(interval)
//       watchTimeRef.current = 0
//       viewTrackedRef.current = false
//     }
//   }, [videoId])

//   return (
//     <div className="flex justify-center items-center flex-col mx-5 mt-[20px]">
//       <div className="w-min">
//         <Plyr
//           source={{
//             type: 'video',
//             sources: [{ src: videoUrl, type: 'video/mp4' }],
//             poster: thumbnailUrl || '',
//           }}
//           options={{
//             controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
//           }}
//           preload="none"
//         />
//         <div>
//           <h2 className="text-2xl font-medium capitalize mt-[15px]">{title}</h2>
//           <p className="mt-[12px] w-inherit">{description}</p>
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { sendViewData } from '../../api/api'
import 'plyr-react/plyr.css'
import './player.css'

const Plyr = dynamic(() => import('plyr-react'), { ssr: false })

interface VideoPlayerClientProps {
  videoId: string
  videoUrl: string
  thumbnailUrl: string
  title: string | null
  description: string | null
  trackingDuration?: number
}

export default function VideoPlayerClient({
  videoId,
  videoUrl,
  thumbnailUrl,
  title,
  description,
  trackingDuration = 10,
}: VideoPlayerClientProps) {
  const playerRef = useRef<any>(null)
  const watchTimeRef = useRef(0)
  const viewTrackedRef = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isPlayingRef = useRef(false)

  // Track view function
  async function trackView(id: string, duration: number) {
    if (viewTrackedRef.current) return
    viewTrackedRef.current = true

    let viewerId = localStorage.getItem('viewer_id') || ''
    if (!viewerId) {
      viewerId = crypto.randomUUID()
      localStorage.setItem('viewer_id', viewerId)
    }

    const screenRes = `${window.screen.width}x${window.screen.height}`
    const payload = {
      video_id: id,
      viewer_id: viewerId,
      duration,
      screen_resolution: screenRes,
    }

    try {
      await sendViewData(payload)
      console.log('View tracked successfully')
    } catch (err) {
      console.error('Track view failed', err)
    }
  }

  // Start/stop timer based on play state
  useEffect(() => {
    const checkAndUpdateTimer = () => {
      if (isPlayingRef.current) {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            watchTimeRef.current += 1
            console.log(`Watch time: ${watchTimeRef.current}s`)

            if (watchTimeRef.current === trackingDuration) {
              trackView(videoId, watchTimeRef.current)
            }
          }, 1000)
        }
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }

    checkAndUpdateTimer()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Attach play/pause event listeners to Plyr
  useEffect(() => {
    const attachListeners = () => {
      if (playerRef.current?.plyr) {
        const plyr = playerRef.current.plyr

        plyr.on('play', () => {
          console.log('Video playing')
          isPlayingRef.current = true
          if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
              watchTimeRef.current += 1
              console.log(`Watch time: ${watchTimeRef.current}s`)

              if (watchTimeRef.current === trackingDuration) {
                trackView(videoId, watchTimeRef.current)
              }
            }, 1000)
          }
        })

        plyr.on('pause', () => {
          console.log('Video paused')
          isPlayingRef.current = false
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        })

        plyr.on('ended', () => {
          console.log('Video ended')
          isPlayingRef.current = false
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        })
        
        return true
      }
      return false
    }

    if (!attachListeners()) {
      const timer = setTimeout(attachListeners, 1000)
      return () => clearTimeout(timer)
    }
  }, [trackingDuration, videoId])

  return (
    <div className="flex justify-center items-center flex-col mx-5 mt-[20px]">
      <div className="w-min">
        <Plyr
          ref={playerRef}
          source={{
            type: 'video',
            sources: [{ src: videoUrl, type: 'video/mp4' }],
            poster: thumbnailUrl || '',
          }}
          options={{
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
          }}
          preload="none"
        />
        <div>
          <h2 className="text-2xl font-medium capitalize mt-[15px]">{title}</h2>
          <p className="mt-[12px] w-inherit">{description}</p>
        </div>
      </div>
    </div>
  )
}
