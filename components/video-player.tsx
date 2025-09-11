"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoItem {
  id: string
  title: string
  duration: string
  thumbnail: string
  videoUrl: string
  description?: string
}

interface VideoPlayerProps {
  videos: VideoItem[]
  currentVideoIndex?: number
  onVideoChange?: (index: number) => void
}

export function VideoPlayer({ videos, currentVideoIndex = 0, onVideoChange }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [activeVideoIndex, setActiveVideoIndex] = useState(currentVideoIndex)

  const currentVideo = videos[activeVideoIndex]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", handleNext)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", handleNext)
    }
  }, [activeVideoIndex])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const handlePrevious = () => {
    const newIndex = activeVideoIndex > 0 ? activeVideoIndex - 1 : videos.length - 1
    setActiveVideoIndex(newIndex)
    onVideoChange?.(newIndex)
  }

  const handleNext = () => {
    const newIndex = activeVideoIndex < videos.length - 1 ? activeVideoIndex + 1 : 0
    setActiveVideoIndex(newIndex)
    onVideoChange?.(newIndex)
  }

  const selectVideo = (index: number) => {
    setActiveVideoIndex(index)
    onVideoChange?.(index)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Main Video Player - Full Width */}
      <div>
        <Card>
          <CardContent className="p-0">
            <div
              className="relative bg-black rounded-t-lg overflow-hidden group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <video
                ref={videoRef}
                className="w-full aspect-video"
                poster={currentVideo.thumbnail}
                src={currentVideo.videoUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Button
                    size="lg"
                    className="h-16 w-16 rounded-full bg-primary/90 hover:bg-primary"
                    onClick={togglePlay}
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
              )}

              {/* Video Controls */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
                  showControls ? "opacity-100" : "opacity-0",
                )}
              >
                {/* Progress Bar */}
                <div className="mb-4">
                  <Slider
                    value={[progressPercentage]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={handlePrevious}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={togglePlay}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={handleNext}>
                      <SkipForward className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <div className="w-20">
                        <Slider
                          value={[isMuted ? 0 : volume * 100]}
                          onValueChange={handleVolumeChange}
                          max={100}
                          step={1}
                        />
                      </div>
                    </div>

                    <span className="text-white text-sm ml-4">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-space-grotesk font-semibold text-lg">{currentVideo.title}</h3>
                  {currentVideo.description && (
                    <p className="text-muted-foreground text-sm mt-1">{currentVideo.description}</p>
                  )}
                </div>
                <Badge variant="secondary">{currentVideo.duration}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Playlist - Moved to Bottom */}
      {/* <div>
        <Card>
          <CardContent className="p-4">
            <h4 className="font-space-grotesk font-semibold mb-4">Playlist do Módulo</h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    index === activeVideoIndex ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
                  )}
                  onClick={() => selectVideo(index)}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle
                        className={cn("h-6 w-6", index === activeVideoIndex ? "text-primary" : "text-white/80")}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        index === activeVideoIndex ? "text-primary" : "text-foreground",
                      )}
                    >
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}
