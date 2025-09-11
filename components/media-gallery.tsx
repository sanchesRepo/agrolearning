"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, FileText, ImageIcon, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaItem {
  id: string
  type: "image" | "video" | "document"
  title: string
  description?: string
  url: string
  thumbnail: string
  duration?: string
  category: string
}

interface MediaGalleryProps {
  items: MediaItem[]
  title?: string
}

export function MediaGallery({ items, title = "Galeria de Mídia" }: MediaGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  const openModal = (item: MediaItem) => {
    setSelectedItem(item)
  }

  const closeModal = () => {
    setSelectedItem(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">{title}</CardTitle>

          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar mídia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">Todas as categorias</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grade</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="group cursor-pointer" onClick={() => openModal(item)}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative aspect-video">
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="text-white">{getTypeIcon(item.type)}</div>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge className={cn("text-xs", getTypeColor(item.type))}>{getTypeIcon(item.type)}</Badge>
                        </div>

                        {/* Duration */}
                        {item.duration && (
                          <div className="absolute bottom-2 right-2">
                            <Badge variant="secondary" className="text-xs bg-black/70 text-white">
                              {item.duration}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-4">
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => openModal(item)}
                  >
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-12 object-cover rounded"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{item.title}</h4>
                        <Badge className={cn("text-xs", getTypeColor(item.type))}>{getTypeIcon(item.type)}</Badge>
                      </div>
                      {item.description && <p className="text-sm text-muted-foreground truncate">{item.description}</p>}
                    </div>

                    {item.duration && (
                      <Badge variant="secondary" className="text-xs">
                        {item.duration}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
                    <Badge className={cn("mt-2", getTypeColor(selectedItem.type))}>
                      {getTypeIcon(selectedItem.type)}
                      <span className="ml-1 capitalize">{selectedItem.type}</span>
                    </Badge>
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
