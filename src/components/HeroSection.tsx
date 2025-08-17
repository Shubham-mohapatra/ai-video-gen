"use client"

import { Button } from "@/components/ui/button"
import { 
  Play, 
  Sparkles, 
  Video, 
  Wand2, 
  ArrowRight,
  Star,
  Users,
  Clock
} from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Video Generation
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Create Stunning{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Videos
            </span>{" "}
            in Minutes
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into professional videos using cutting-edge AI technology. 
            No filming, no editing skills required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 group"
            >
              <Wand2 className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Creating Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-2 hover:bg-gray-50"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center mb-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-purple-500 mr-2" />
                <span className="text-3xl font-bold text-gray-900">2 Min</span>
              </div>
              <p className="text-gray-600">Average Creation Time</p>
            </div>
          </div>

          {/* Video Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                >
                  <Play className="w-12 h-12" />
                </Button>
              </div>
              {/* Video Controls Mockup */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between text-white text-sm">
                  <span>AI Video Demo</span>
                  <span>2:34</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                  <div className="bg-purple-500 h-1 rounded-full w-1/3"></div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 bg-white rounded-full p-3 shadow-lg">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-full p-3 shadow-lg">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 shadow-lg">
              <Video className="w-6 h-6 text-pink-500" />
            </div>
          </div>
          </div>
        </div>
    </section>
  )
}
