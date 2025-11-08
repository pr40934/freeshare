// working code 

// import { Suspense } from 'react'
// import { getVideoDetails, videoDomain } from '../../api/api'
// import 'plyr-react/plyr.css'
// import './player.css'

// import VideoPlayerClient from './video-player-client'

// async function getVideo(videoId: string) {
//   const data = await getVideoDetails(videoId)
//   return {
//     videoUrl: `${videoDomain}${data?.data?.video_url}`,
//     thumbnailUrl: `${videoDomain}${data?.data?.video_thumbnail}`,
//     title: data?.data?.video_title || null,
//     description: data?.data?.video_desc || null,
//   }
// }

// export default async function VideoPage({ params }: { params: Promise<{ video_id: string }> }) {
//   const { video_id } = await params
//   const videoData = await getVideo(video_id)

//   return (
//     <Suspense fallback={<p>Loading video...</p>}>
//       <VideoPlayerClient videoId={video_id} {...videoData} />
//     </Suspense>
//   )
// }





import { Suspense } from 'react'
import { getVideoDetails, videoDomain } from '../../api/api'
import 'plyr-react/plyr.css'
import './player.css'

import VideoPlayerClient from './video-player-client'

async function getVideo(videoId: string) {
  const data = await getVideoDetails(videoId)
  return {
    videoUrl: `${videoDomain}${data?.data?.video_url}`,
    thumbnailUrl: `${videoDomain}${data?.data?.video_thumbnail}`,
    title: data?.data?.video_title || null,
    description: data?.data?.video_desc || null,
  }
}

export default async function VideoPage({ params }: { params: Promise<{ video_id: string }> }) {
  const { video_id } = await params
  const videoData = await getVideo(video_id)

  return (
    <Suspense fallback={<p>Loading video...</p>}>
      <VideoPlayerClient 
        videoId={video_id} 
        {...videoData}
        trackingDuration={videoData.trackingDuration || 10}
      />
    </Suspense>
  )
}