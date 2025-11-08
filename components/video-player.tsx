// "use client"

// import React, { useEffect, useRef, useState } from "react"

// type VideoPlayerProps = {
//   src: string
//   poster?: string
//   title?: string
// }

// export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
//   const ref = useRef<HTMLVideoElement | null>(null)
//   const [playing, setPlaying] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(1)
//   const [muted, setMuted] = useState(false)
//   const [videoWidth, setVideoWidth] = useState<number | null>(null)
//   const [videoHeight, setVideoHeight] = useState<number | null>(null)
//   const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover')

//   useEffect(() => {
//     const v = ref.current
//     if (!v) return
//     v.volume = volume
//     v.muted = muted
//   }, [volume, muted])

//   function togglePlay() {
//     const v = ref.current
//     if (!v) return
//     if (v.paused) {
//       v.play()
//       setPlaying(true)
//     } else {
//       v.pause()
//       setPlaying(false)
//     }
//   }

//   function onTimeUpdate() {
//     const v = ref.current
//     if (!v) return
//     setCurrentTime(v.currentTime)
//   }

//   function onLoadedMeta() {
//     const v = ref.current
//     if (!v) return
//     setDuration(v.duration)
//     if (v.videoWidth && v.videoHeight) {
//       setVideoWidth(v.videoWidth)
//       setVideoHeight(v.videoHeight)
//     }
//   }

//   function skip(seconds: number) {
//     const v = ref.current
//     if (!v) return
//     let t = v.currentTime + seconds
//     if (t < 0) t = 0
//     if (t > (v.duration || 0)) t = v.duration || t
//     v.currentTime = t
//     setCurrentTime(t)
//   }

//   function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
//     const v = ref.current
//     if (!v) return
//     const t = Number(e.target.value)
//     v.currentTime = t
//     setCurrentTime(t)
//   }

//   function toggleMute() {
//     setMuted((m) => !m)
//   }

//   function formatTime(s: number) {
//     if (!isFinite(s)) return "0:00"
//     const m = Math.floor(s / 60)
//     const sec = Math.floor(s % 60)
//     return `${m}:${sec.toString().padStart(2, "0")}`
//   }

//   async function toggleFullscreen() {
//     const el = ref.current
//     if (!el) return
//     const doc = document as any
//     const container = el.parentElement
//     if (!container) return
//     if (!doc.fullscreenElement) {
//       await container.requestFullscreen?.()
//     } else {
//       await document.exitFullscreen?.()
//     }
//   }

//   const isPortrait =
//     videoWidth && videoHeight ? videoHeight > videoWidth && videoHeight / videoWidth > 1.1 : false
//   // Use explicit, YouTube-like frames:
//   // - portrait (reel/shorts): narrow column but large enough to be visible on desktop/mobile
//   // - landscape (normal): wide 16:9 player capped to viewport
//   const frameStyle: React.CSSProperties = isPortrait
//     ? { aspectRatio: "9 / 16", width: "min(540px, 90vw)", maxHeight: "90vh" }
//     : { aspectRatio: "16 / 9", width: "min(1100px, 95vw)", maxHeight: "80vh" }

//   // Default fitMode based on detected ratio; user can toggle if automatic guess is wrong
//   useEffect(() => {
//     if (!videoWidth || !videoHeight) return
//     const auto = videoHeight > videoWidth ? 'contain' : 'cover'
//     setFitMode(auto)
//   }, [videoWidth, videoHeight])

//   const videoStyle: React.CSSProperties = {
//     width: '100%',
//     height: '100%',
//     objectFit: fitMode,
//     display: 'block',
//   }

//   return (
//     <div className="w-full" style={{ margin: "0 auto", display: "flex", justifyContent: "center" }}>
//       <div style={frameStyle} className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
//         <div className="w-full h-full relative" style={{ background: "var(--color-card)" }}>
//           <video
//             ref={ref}
//             style={videoStyle}
//             src={src}
//             poster={poster}
//             onTimeUpdate={onTimeUpdate}
//             onLoadedMetadata={onLoadedMeta}
//             onPlay={() => setPlaying(true)}
//             onPause={() => setPlaying(false)}
//             controls={false}
//           />
          
//           {title && (
//             <div className="absolute top-3 left-3 text-sm text-white/90 bg-black/30 px-3 py-1 rounded-md">
//               {title}
//             </div>
//           )}

//           <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
//             <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
//               <div className="flex items-center gap-3 bg-black/20 rounded-md px-3 py-2 backdrop-blur-sm">
//                 {/* Left group: play/back */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     aria-label={playing ? "Pause" : "Play"}
//                     onClick={togglePlay}
//                     className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition"
//                     style={{ color: "var(--color-primary-foreground)" }}
//                   >
//                     {playing ? (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                         <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
//                       </svg>
//                     ) : (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                         <path d="M5 3v18l15-9L5 3z" />
//                       </svg>
//                     )}
//                   </button>

//                   <button
//                     onClick={() => skip(-10)}
//                     aria-label="Back 10s"
//                     className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                       <path d="M11 18V6l-8 6 8 6zm9 0V6l-8 6 8 6z" />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Center: seek */}
//                 <div className="flex items-center gap-3 w-[560px] max-w-[50vw]">
//                   <input
//                     aria-label="Seek"
//                     type="range"
//                     min={0}
//                     max={duration || 0}
//                     step={0.1}
//                     value={currentTime}
//                     onChange={handleSeek}
//                     className="w-full h-1 accent-[var(--color-primary)] appearance-none bg-white/10 rounded"
//                   />
//                 </div>

//                 {/* Time */}
//                 <div className="text-xs text-white/80">{formatTime(currentTime)} / {formatTime(duration)}</div>

//                 {/* Right group: forward, volume, fit, fullscreen */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => skip(10)}
//                     aria-label="Forward 10s"
//                     className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                       <path d="M5 6v12l8.5-6L5 6zm9 0v12l8.5-6L14 6z" />
//                     </svg>
//                   </button>

//                   <button
//                     onClick={toggleMute}
//                     aria-label={muted ? "Unmute" : "Mute"}
//                     className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white"
//                   >
//                     {muted || volume === 0 ? (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                         <path d="M16.5 12a4.5 4.5 0 0 0-4.5-4.5v9A4.5 4.5 0 0 0 16.5 12zM19 12c0 2.761-2.239 5-5 5v-2a3 3 0 0 0 3-3 3 3 0 0 0-3-3v-2c2.761 0 5 2.239 5 5z" />
//                       </svg>
//                     ) : (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                         <path d="M5 9v6h4l5 5V4L9 9H5z" />
//                       </svg>
//                     )}
//                   </button>

//                   <input
//                     aria-label="Volume"
//                     type="range"
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     value={volume}
//                     onChange={(e) => setVolume(Number(e.target.value))}
//                     className="w-20 h-1 accent-[var(--color-primary)] appearance-none bg-white/10 rounded"
//                   />

//                   <button
//                     onClick={() => setFitMode((f) => (f === 'cover' ? 'contain' : 'cover'))}
//                     aria-label={fitMode === 'cover' ? 'Switch to contain' : 'Switch to cover'}
//                     title={fitMode === 'cover' ? 'Contain (show full video)' : 'Cover (fill frame)'}
//                     className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white"
//                   >
//                     {fitMode === 'cover' ? (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                         <path d="M3 3h8v2H5v6H3V3zm18 0v8h-2V5h-6V3h8zM3 21v-8h2v6h6v2H3zm18 0h-8v-2h6v-6h2v8z" />
//                       </svg>
//                     ) : (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                         <path d="M5 5h14v14H5z" />
//                       </svg>
//                     )}
//                   </button>

//                   <button
//                     onClick={toggleFullscreen}
//                     aria-label="Fullscreen"
//                     className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                       <path d="M7 14H5v5h5v-2H7v-3zm10 5h-3v2h5v-5h-2v3zM5 5v5h2V7h3V5H5zm14 0h-5v2h3v3h2V5z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



// "use client"

// import React, { useEffect, useRef, useState } from "react"

// type VideoPlayerProps = {
//   src: string
//   poster?: string
//   title?: string
// }

// export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
//   const ref = useRef<HTMLVideoElement | null>(null)
//   const [playing, setPlaying] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(1)
//   const [muted, setMuted] = useState(false)
//   const [videoWidth, setVideoWidth] = useState<number | null>(null)
//   const [videoHeight, setVideoHeight] = useState<number | null>(null)
//   const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover')
//   const [buffered, setBuffered] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [fullscreen, setFullscreen] = useState(false)
//   const [playbackSpeed, setPlaybackSpeed] = useState(1)
//   const [prevVolume, setPrevVolume] = useState(1)
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false)

//   useEffect(() => {
//     const v = ref.current
//     if (!v) return
//     v.volume = volume
//     v.muted = muted
//     v.playbackRate = playbackSpeed
//   }, [volume, muted, playbackSpeed])

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       const v = ref.current
//       if (!v) return

//       switch (e.code) {
//         case 'Space':
//           e.preventDefault()
//           togglePlay()
//           break
//         case 'ArrowRight':
//           skip(5)
//           break
//         case 'ArrowLeft':
//           skip(-5)
//           break
//         case 'ArrowUp':
//           setVolume((vol) => Math.min(vol + 0.1, 1))
//           break
//         case 'ArrowDown':
//           setVolume((vol) => Math.max(vol - 0.1, 0))
//           break
//         case 'KeyM':
//           toggleMute()
//           break
//         case 'KeyF':
//           toggleFullscreen()
//           break
//       }
//     }

//     window.addEventListener('keydown', handleKeyPress)
//     return () => window.removeEventListener('keydown', handleKeyPress)
//   }, [])

//   function togglePlay() {
//     const v = ref.current
//     if (!v) return
//     if (v.paused) {
//       v.play()
//       setPlaying(true)
//     } else {
//       v.pause()
//       setPlaying(false)
//     }
//   }

//   function togglePlayOnClick() {
//     const v = ref.current
//     if (!v) return
//     if (v.paused) {
//       v.play()
//       setPlaying(true)
//     } else {
//       v.pause()
//       setPlaying(false)
//     }
//   }

//   function onTimeUpdate() {
//     const v = ref.current
//     if (!v) return
//     setCurrentTime(v.currentTime)
//   }

//   function onLoadedMeta() {
//     const v = ref.current
//     if (!v) return
//     setDuration(v.duration)
//     setLoading(false)
//     if (v.videoWidth && v.videoHeight) {
//       setVideoWidth(v.videoWidth)
//       setVideoHeight(v.videoHeight)
//     }
//   }

//   function onProgress() {
//     const v = ref.current
//     if (!v || !v.buffered.length) return
//     setBuffered(v.buffered.end(v.buffered.length - 1))
//   }

//   function skip(seconds: number) {
//     const v = ref.current
//     if (!v) return
//     let t = v.currentTime + seconds
//     if (t < 0) t = 0
//     if (t > (v.duration || 0)) t = v.duration || t
//     v.currentTime = t
//     setCurrentTime(t)
//   }

//   function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
//     const v = ref.current
//     if (!v) return
//     const t = Number(e.target.value)
//     v.currentTime = t
//     setCurrentTime(t)
//   }

//   function toggleMute() {
//     if (muted) {
//       setVolume(prevVolume)
//       setMuted(false)
//     } else {
//       setPrevVolume(volume)
//       setVolume(0)
//       setMuted(true)
//     }
//   }

//   function formatTime(s: number) {
//     if (!isFinite(s)) return "0:00"
//     const m = Math.floor(s / 60)
//     const sec = Math.floor(s % 60)
//     return `${m}:${sec.toString().padStart(2, "0")}`
//   }

//   async function toggleFullscreen() {
//     const el = ref.current
//     if (!el) return
//     const doc = document as any
//     const container = el.parentElement
//     if (!container) return
//     try {
//       if (!doc.fullscreenElement) {
//         await container.requestFullscreen?.()
//         setFullscreen(true)
//       } else {
//         await document.exitFullscreen?.()
//         setFullscreen(false)
//       }
//     } catch (err) {
//       console.error('Fullscreen error:', err)
//     }
//   }

//   const isPortrait =
//     videoWidth && videoHeight ? videoHeight > videoWidth && videoHeight / videoWidth > 1.1 : false

//   const frameStyle: React.CSSProperties = isPortrait
//     ? { aspectRatio: "9 / 16", width: "min(540px, 90vw)", maxHeight: "90vh" }
//     : { aspectRatio: "16 / 9", width: "min(1100px, 95vw)", maxHeight: "80vh" }

//   useEffect(() => {
//     if (!videoWidth || !videoHeight) return
//     const auto = videoHeight > videoWidth ? 'contain' : 'cover'
//     setFitMode(auto)
//   }, [videoWidth, videoHeight])

//   const videoStyle: React.CSSProperties = {
//     width: '100%',
//     height: '100%',
//     objectFit: fitMode,
//     display: 'block',
//   }

//   const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0
//   const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0

//   return (
//     <div className="w-full" style={{ margin: "0 auto", display: "flex", justifyContent: "center" }}>
//       <div style={frameStyle} className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
//         <div className="w-full h-full relative" style={{ background: "var(--color-card)" }}>
//           <video
//             ref={ref}
//             style={videoStyle}
//             src={src}
//             poster={poster}
//             onTimeUpdate={onTimeUpdate}
//             onLoadedMetadata={onLoadedMeta}
//             onProgress={onProgress}
//             onLoadStart={() => setLoading(true)}
//             onPlay={() => setPlaying(true)}
//             onPause={() => setPlaying(false)}
//             onError={() => setError("Failed to load video")}
//             onClick={togglePlayOnClick}
//             controls={false}
//           />

//           {/* Loading Indicator */}
//           {loading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//               <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/50">
//               <div className="bg-red-500/80 text-white px-4 py-3 rounded-lg text-center">
//                 {error}
//               </div>
//             </div>
//           )}

//           {title && (
//             <div className="absolute top-3 left-3 text-sm text-white/90 bg-black/30 px-3 py-1 rounded-md">
//               {title}
//             </div>
//           )}

//           <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
//             {/* Progress Bar with Buffered */}
//             <div className="w-full mb-3 group">
//               <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
//                 {/* Buffered Progress */}
//                 <div
//                   className="absolute h-full bg-white/40 rounded-full"
//                   style={{ width: `${bufferedPercent}%` }}
//                 ></div>
//                 {/* Current Progress */}
//                 <div
//                   className="absolute h-full bg-[var(--color-primary)] rounded-full"
//                   style={{ width: `${currentPercent}%` }}
//                 ></div>
//                 {/* Seek Input */}
//                 <input
//                   aria-label="Seek"
//                   type="range"
//                   min={0}
//                   max={duration || 0}
//                   step={0.1}
//                   value={currentTime}
//                   onChange={handleSeek}
//                   className="absolute w-full h-3 opacity-0 cursor-pointer accent-[var(--color-primary)]"
//                   style={{ zIndex: 5, top: '50%', transform: 'translateY(-50%)' }}
//                 />
//                 {/* Hover Indicator */}
//                 <div
//                   className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                   style={{ left: `${currentPercent}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
//                 ></div>
//               </div>
//             </div>

//             <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
//               <div className="flex items-center gap-3 bg-black/20 rounded-md px-3 py-2 backdrop-blur-sm">
//                 {/* Left group: play/back */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     aria-label={playing ? "Pause" : "Play"}
//                     onClick={togglePlay}
//                     className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
//                     style={{ color: "var(--color-primary-foreground)" }}
//                   >
//                     {playing ? (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                         <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
//                       </svg>
//                     ) : (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                         <path d="M5 3v18l15-9L5 3z" />
//                       </svg>
//                     )}
//                   </button>

//                   <button
//                     onClick={() => skip(-10)}
//                     aria-label="Back 10s"
//                     className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
//                     title="Back 10s"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                       <path d="M11.99 5V1l-5 5 5 5V7c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 19.627 0 13h-2c0 7.732 6.268 14 14 14s14-6.268 14-14S19.732 5 11.99 5z" />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Center: seek */}
//                 <div className="flex items-center gap-3 w-[560px] max-w-[50vw]">
//                   <input
//                     aria-label="Seek bar"
//                     type="range"
//                     min={0}
//                     max={duration || 0}
//                     step={0.1}
//                     value={currentTime}
//                     onChange={handleSeek}
//                     className="w-full h-1 accent-[var(--color-primary)] appearance-none bg-white/10 rounded cursor-pointer"
//                   />
//                 </div>

//                 {/* Time */}
//                 <div className="text-xs text-white/80">{formatTime(currentTime)} / {formatTime(duration)}</div>

//                 {/* Right group: forward, volume, speed, fit, fullscreen */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => skip(10)}
//                     aria-label="Forward 10s"
//                     className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
//                     title="Forward 10s"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                       <path d="M12.01 5V1l5 5-5 5V7C5.383 7 0 12.373 0 19s5.383 12 12.01 12c6.627 0 12-5.373 12-12h2c0 7.732-6.268 14-14 14S0 26.732 0 19 6.268 5 12.01 5z" />
//                     </svg>
//                   </button>

//                   <button
//                     onClick={toggleMute}
//                     aria-label={muted ? "Unmute" : "Mute"}
//                     className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
//                     title="Mute"
//                   >
//                     {muted || volume === 0 ? (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                         <path d="M16.5 12a4.5 4.5 0 00-4.5-4.5v9a4.5 4.5 0 004.5-4.5zM19 12c0 2.761-2.239 5-5 5v-2a3 3 0 003-3 3 3 0 00-3-3V7c2.761 0 5 2.239 5 5z" />
//                       </svg>
//                     ) : (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                         <path d="M5 9v6h4l5 5V4L9 9H5z" />
//                       </svg>
//                     )}
//                   </button>

//                   <input
//                     aria-label="Volume"
//                     type="range"
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     value={volume}
//                     onChange={(e) => {
//                       const val = Number(e.target.value)
//                       setVolume(val)
//                       if (val > 0 && muted) setMuted(false)
//                     }}
//                     className="w-20 h-1 accent-[var(--color-primary)] appearance-none bg-white/10 rounded hover:bg-white/20 focus:outline-none cursor-pointer transition"
//                   />

//                   <div className="relative">
//                     <button
//                       onClick={() => setShowSpeedMenu(!showSpeedMenu)}
//                       aria-label="Playback speed"
//                       className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition text-xs font-semibold"
//                     >
//                       {playbackSpeed.toFixed(1)}x
//                     </button>
//                     {showSpeedMenu && (
//                       <div className="absolute bottom-full mb-2 right-0 bg-black/80 border border-white/10 rounded-md overflow-hidden backdrop-blur-sm z-10">
//                         {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
//                           <button
//                             key={speed}
//                             onClick={() => {
//                               setPlaybackSpeed(speed)
//                               setShowSpeedMenu(false)
//                             }}
//                             className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition ${
//                               playbackSpeed === speed ? 'bg-[var(--color-primary)]/50 font-semibold' : ''
//                             }`}
//                           >
//                             {speed.toFixed(2)}x
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     onClick={() => setFitMode((f) => (f === 'cover' ? 'contain' : 'cover'))}
//                     aria-label={fitMode === 'cover' ? 'Switch to contain' : 'Switch to cover'}
//                     title={fitMode === 'cover' ? 'Contain (show full video)' : 'Cover (fill frame)'}
//                     className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
//                   >
//                     {fitMode === 'cover' ? (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                         <path d="M3 3h8v2H5v6H3V3zm18 0v8h-2V5h-6V3h8zM3 21v-8h2v6h6v2H3zm18 0h-8v-2h6v-6h2v8z" />
//                       </svg>
//                     ) : (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                         <path d="M5 5h14v14H5z" />
//                       </svg>
//                     )}
//                   </button>

//                   <button
//                     onClick={toggleFullscreen}
//                     aria-label="Fullscreen"
//                     className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                       <path d="M7 14H5v5h5v-2H7v-3zm10 5h-3v2h5v-5h-2v3zM5 5v5h2V7h3V5H5zm14 0h-5v2h3v3h2V5z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import React, { useEffect, useRef, useState } from "react"

type VideoPlayerProps = {
  src: string
  poster?: string
  title?: string
}

export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [videoWidth, setVideoWidth] = useState<number | null>(null)
  const [videoHeight, setVideoHeight] = useState<number | null>(null)
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover')
  const [buffered, setBuffered] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [prevVolume, setPrevVolume] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.volume = volume
    v.muted = muted
    v.playbackRate = playbackSpeed
  }, [volume, muted, playbackSpeed])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const v = ref.current
      if (!v) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowRight':
          skip(5)
          break
        case 'ArrowLeft':
          skip(-5)
          break
        case 'ArrowUp':
          setVolume((vol) => Math.min(vol + 0.1, 1))
          break
        case 'ArrowDown':
          setVolume((vol) => Math.max(vol - 0.1, 0))
          break
        case 'KeyM':
          toggleMute()
          break
        case 'KeyF':
          toggleFullscreen()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  function togglePlay() {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  function togglePlayOnClick() {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  function onTimeUpdate() {
    const v = ref.current
    if (!v) return
    setCurrentTime(v.currentTime)
  }

  function onLoadedMeta() {
    const v = ref.current
    if (!v) return
    setDuration(v.duration)
    setLoading(false)
    if (v.videoWidth && v.videoHeight) {
      setVideoWidth(v.videoWidth)
      setVideoHeight(v.videoHeight)
    }
  }

  function onProgress() {
    const v = ref.current
    if (!v || !v.buffered.length) return
    setBuffered(v.buffered.end(v.buffered.length - 1))
  }

  function skip(seconds: number) {
    const v = ref.current
    if (!v) return
    let t = v.currentTime + seconds
    if (t < 0) t = 0
    if (t > (v.duration || 0)) t = v.duration || t
    v.currentTime = t
    setCurrentTime(t)
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const v = ref.current
    if (!v) return
    const t = Number(e.target.value)
    v.currentTime = t
    setCurrentTime(t)
  }

  function toggleMute() {
    if (muted) {
      setVolume(prevVolume)
      setMuted(false)
    } else {
      setPrevVolume(volume)
      setVolume(0)
      setMuted(true)
    }
  }

  function formatTime(s: number) {
    if (!isFinite(s)) return "0:00"
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  async function toggleFullscreen() {
    const el = ref.current
    if (!el) return
    const doc = document as any
    const container = el.parentElement
    if (!container) return
    try {
      if (!doc.fullscreenElement) {
        await container.requestFullscreen?.()
        setFullscreen(true)
      } else {
        await document.exitFullscreen?.()
        setFullscreen(false)
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  const isPortrait =
    videoWidth && videoHeight ? videoHeight > videoWidth && videoHeight / videoWidth > 1.1 : false

  const frameStyle: React.CSSProperties = isPortrait
    ? { aspectRatio: "9 / 16", width: "min(540px, 90vw)", maxHeight: "90vh" }
    : { aspectRatio: "16 / 9", width: "min(1100px, 95vw)", maxHeight: "80vh" }

  useEffect(() => {
    if (!videoWidth || !videoHeight) return
    const auto = videoHeight > videoWidth ? 'contain' : 'cover'
    setFitMode(auto)
  }, [videoWidth, videoHeight])

  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: fitMode,
    display: 'block',
  }

  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0
  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full" style={{ margin: "0 auto", display: "flex", justifyContent: "center" }}>
      <div style={frameStyle} className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
        <div className="w-full h-full relative" style={{ background: "var(--color-card)" }}>
          <video
            ref={ref}
            style={videoStyle}
            src={src}
            poster={poster}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMeta}
            onProgress={onProgress}
            onLoadStart={() => setLoading(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setError("Failed to load video")}
            onClick={togglePlayOnClick}
            controls={false}
          />

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-red-500/80 text-white px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            </div>
          )}

          {title && (
            <div className="absolute top-3 left-3 text-sm text-white/90 bg-black/30 px-3 py-1 rounded-md">
              {title}
            </div>
          )}

          <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            {/* Progress Bar with Buffered */}
            {/* <div className="w-full mb-3 group">
              <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-white/40 rounded-full"
                  style={{ width: `${bufferedPercent}%` }}
                ></div>
                <div
                  className="absolute h-full bg-[var(--color-primary)] rounded-full"
                  style={{ width: `${currentPercent}%` }}
                ></div>
                <input
                  aria-label="Seek"
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute w-full h-3 opacity-0 cursor-pointer accent-[var(--color-primary)]"
                  style={{ zIndex: 5, top: '50%', transform: 'translateY(-50%)' }}
                />
                <div
                  className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${currentPercent}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                ></div>
              </div>
            </div> */}

            {/* Progress Bar (Clickable like YouTube) */}
            <div 
                    className="relative h-1 bg-white/10 rounded-full overflow-hidden"
            onClick={(e) => {
            const x = (e.nativeEvent as any).offsetX
            const w = (e.currentTarget as HTMLElement).clientWidth
            const newTime = (x / w) * duration
            if (ref.current) ref.current.currentTime = newTime
            setCurrentTime(newTime)
            }}
            >
            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                {/* Buffered */}
                <div
                className="absolute h-full bg-white/40 rounded-full"
                style={{ width: `${bufferedPercent}%` }}
                ></div>

                {/* Current */}
                <div
                className="absolute h-full bg-[var(--color-primary)] rounded-full"
                style={{ width: `${currentPercent}%` }}
                ></div>

                {/* Hover dot */}
                <div
                className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${currentPercent}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                ></div>
            </div>
            </div>


            <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
              <div className="flex items-center gap-3 bg-black/20 rounded-md px-3 py-2 backdrop-blur-sm">
                {/* Left group: play/back */}
                <div className="flex items-center gap-2">
                  <button
                    aria-label={playing ? "Pause" : "Play"}
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                    style={{ color: "var(--color-primary-foreground)" }}
                  >
                    {playing ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M5 3v18l15-9L5 3z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => skip(-10)}
                    aria-label="Back 10s"
                    className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                    title="Back 10s"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M11.99 5V1l-5 5 5 5V7c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 19.627 0 13h-2c0 7.732 6.268 14 14 14s14-6.268 14-14S19.732 5 11.99 5z" />
                    </svg>
                  </button>
                </div>

                {/* Center: seek */}
                {/* <div className="flex items-center gap-3 w-[560px] max-w-[50vw]">
                  <input
                    aria-label="Seek bar"
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 accent-[var(--color-primary)] appearance-none bg-white/10 rounded cursor-pointer"
                  />
                </div> */}

                {/* Time */}
                <div className="text-xs text-white/80">{formatTime(currentTime)} / {formatTime(duration)}</div>

                {/* Right group: forward, volume, speed, fit, fullscreen */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => skip(10)}
                    aria-label="Forward 10s"
                    className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                    title="Forward 10s"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12.01 5V1l5 5-5 5V7C5.383 7 0 12.373 0 19s5.383 12 12.01 12c6.627 0 12-5.373 12-12h2c0 7.732-6.268 14-14 14S0 26.732 0 19 6.268 5 12.01 5z" />
                    </svg>
                  </button>

                  <button
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                    title="Mute"
                  >
                    {muted || volume === 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M16.5 12a4.5 4.5 0 00-4.5-4.5v9a4.5 4.5 0 004.5-4.5zM19 12c0 2.761-2.239 5-5 5v-2a3 3 0 003-3 3 3 0 00-3-3V7c2.761 0 5 2.239 5 5z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M5 9v6h4l5 5V4L9 9H5z" />
                      </svg>
                    )}
                  </button>

                  <input
                    aria-label="Volume"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setVolume(val)
                      if (val > 0 && muted) setMuted(false)
                    }}
                    className="w-20 h-1 accent-[var(--color-primary)] appearance-none bg-white/10 rounded hover:bg-white/20 focus:outline-none cursor-pointer transition"
                  />

                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      aria-label="Playback speed"
                      className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition text-xs font-semibold"
                    >
                      {playbackSpeed.toFixed(1)}x
                    </button>
                    {showSpeedMenu && (
                      <div className="absolute bottom-full mb-2 right-0 bg-black/80 border border-white/10 rounded-md overflow-hidden backdrop-blur-sm z-10">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => {
                              setPlaybackSpeed(speed)
                              setShowSpeedMenu(false)
                            }}
                            className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition ${
                              playbackSpeed === speed ? 'bg-[var(--color-primary)]/50 font-semibold' : ''
                            }`}
                          >
                            {speed.toFixed(2)}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setFitMode((f) => (f === 'cover' ? 'contain' : 'cover'))}
                    aria-label={fitMode === 'cover' ? 'Switch to contain' : 'Switch to cover'}
                    title={fitMode === 'cover' ? 'Contain (show full video)' : 'Cover (fill frame)'}
                    className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  >
                    {fitMode === 'cover' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M3 3h8v2H5v6H3V3zm18 0v8h-2V5h-6V3h8zM3 21v-8h2v6h6v2H3zm18 0h-8v-2h6v-6h2v8z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M5 5h14v14H5z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    aria-label="Fullscreen"
                    className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center border border-white/10 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M7 14H5v5h5v-2H7v-3zm10 5h-3v2h5v-5h-2v3zM5 5v5h2V7h3V5H5zm14 0h-5v2h3v3h2V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}