"use client"

import { 
  Wand2, 
  Video, 
  Palette, 
  Clock, 
  Download, 
  Share2,
  Sparkles,
  Brain,
  Zap
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Generation",
    description: "Advanced AI models create professional videos from simple text descriptions in seconds.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Wand2,
    title: "Text-to-Video Magic",
    description: "Simply describe your vision and watch as AI transforms your words into stunning visuals.",
    color: "from-blue-500 to-purple-500"
  },
  {
    icon: Palette,
    title: "Customizable Styles",
    description: "Choose from hundreds of artistic styles, from photorealistic to animated and everything in between.",
    color: "from-pink-500 to-red-500"
  },
  {
    icon: Clock,
    title: "Lightning Fast",
    description: "Generate high-quality videos in under 2 minutes. No more waiting hours for rendering.",
    color: "from-green-500 to-blue-500"
  },
  {
    icon: Video,
    title: "HD Quality Output",
    description: "Export your videos in crisp 1080p or 4K resolution, perfect for any platform or purpose.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share directly to social media platforms or download for later use with one-click export.",
    color: "from-teal-500 to-green-500"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Create{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Amazing Videos
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our AI video generation platform combines cutting-edge technology with intuitive design 
            to make professional video creation accessible to everyone.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer group">
            <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Try All Features For Free !!
          </div>
        </div>
      </div>
    </section>
  )
}
