"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Play, FileText, ImageIcon, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaItem {
  id: string
  type: "image" | "video" | "document"
  title: string
  description?: string
  url: string
  thumbnail: string
  duration?: string
}

interface MediaCarouselProps {
  items: MediaItem[]
  className?: string
}

export function MediaCarousel({ items, className }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  const currentItem = items[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
  }

  const selectItem = (index: number) => {
    setCurrentIndex(index)
  }

  const openModal = (item: MediaItem) => {
    setSelectedItem(item)
  }

  const closeModal = () => {
    setSelectedItem(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-primary/10 text-primary"
      case "document":
        return "bg-secondary/10 text-secondary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Display */}
        <Card>
          <CardContent className="p-0">
            <div className="relative group">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img
                  src={currentItem.thumbnail || "/placeholder.svg"}
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="h-12 w-12 rounded-full bg-white/90 hover:bg-white text-black"
                    onClick={() => openModal(currentItem)}
                  >
                    <Maximize2 className="h-6 w-6" />
                  </Button>
                </div>

                {/* Navigation Arrows */}
                {items.length > 1 && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={goToPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={goToNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={cn("text-xs", getTypeColor(currentItem.type))}>
                    {getTypeIcon(currentItem.type)}
                    <span className="ml-1 capitalize">{currentItem.type}</span>
                  </Badge>
                </div>

                {/* Duration Badge */}
                {currentItem.duration && (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="text-xs bg-black/70 text-white">
                      {currentItem.duration}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="p-4">
                <h3 className="font-space-grotesk font-semibold text-lg mb-1">{currentItem.title}</h3>
                {currentItem.description && <p className="text-muted-foreground text-sm">{currentItem.description}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Navigation */}
        {items.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => selectItem(index)}
                className={cn(
                  "flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all",
                  index === currentIndex ? "border-primary" : "border-transparent hover:border-muted-foreground/50",
                )}
              >
                <img src={item.thumbnail || "/placeholder.svg"} alt={item.title} className="w-20 h-12 object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn("text-white/80", getTypeColor(item.type))}>{getTypeIcon(item.type)}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="max-w-4xl w-full max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
                    onClick={closeModal}
                  >
                    ×
                  </Button>

                  {selectedItem.type === "video" ? (
                    <div className="aspect-video bg-black">
                      <video
                        controls
                        className="w-full h-full"
                        poster={selectedItem.thumbnail}
                        src={selectedItem.url}
                      />
                    </div>
                  ) : (
                    <img
                      src={selectedItem.url || selectedItem.thumbnail}
                      alt={selectedItem.title}
                      className="w-full max-h-[80vh] object-contain"
                    />
                  )}

                  <div className="p-4">
                    <h3 className="font-space-grotesk font-semibold text-lg mb-1">{selectedItem.title}</h3>
                    {selectedItem.description && <p className="text-muted-foreground">{selectedItem.description}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
