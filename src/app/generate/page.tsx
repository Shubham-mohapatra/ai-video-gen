"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { 
  Wand2, 
  Video, 
  Download, 
  Share2, 
  Play,
  Loader2,
  Sparkles,
  Clock,
  Settings
} from "lucide-react"

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setGeneratedVideo("/placeholder-video.mp4")
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Video Generator
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Create Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Video
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Describe your vision and watch as AI transforms your words into a stunning video
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Describe Your Video
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Description
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A serene mountain landscape at sunset with golden clouds floating above snow-capped peaks..."
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="style-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Style
                      </label>
                      <select 
                        id="style-select"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option>Cinematic</option>
                        <option>Animated</option>
                        <option>Photorealistic</option>
                        <option>Artistic</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="duration-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <select 
                        id="duration-select"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option>5 seconds</option>
                        <option>10 seconds</option>
                        <option>15 seconds</option>
                        <option>30 seconds</option>
                      </select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  💡 Pro Tips
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• Be specific about lighting, mood, and atmosphere</li>
                  <li>• Include details about camera movements or angles</li>
                  <li>• Mention specific colors or visual styles you want</li>
                  <li>• Keep descriptions clear and concise</li>
                </ul>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Generated Video
                </h2>
                
                {isGenerating ? (
                  <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                    <p className="text-gray-600 text-center">
                      Creating your video...
                      <br />
                      <span className="text-sm">This usually takes 1-3 minutes</span>
                    </p>
                  </div>
                ) : generatedVideo ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                        <Button 
                          variant="ghost" 
                          size="lg"
                          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        >
                          <Play className="w-12 h-12" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500">
                    <Video className="w-16 h-16 mb-4" />
                    <p className="text-center">
                      Your generated video will appear here
                      <br />
                      <span className="text-sm">Enter a description above to get started</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Generation Stats */}
              {generatedVideo && (
                <div className="bg-green-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    ✅ Generation Complete
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-green-800">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Generated in 2m 34s</span>
                    </div>
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      <span className="text-sm">1080p HD Quality</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
