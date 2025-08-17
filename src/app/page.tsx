import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      {/* Call to Action Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Ready to create your first AI video?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of creators using AI VideoGen to turn ideas into stunning videos in minutes. No credit card required.
            </p>
            <a
              href="/generate"
              className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 group"
            >
              <span>Start Creating Free</span>
              <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 text-sm text-gray-500">
              <span></span>
              <span>•</span>
              <span>🚀 Free forever plan</span>
              <span>•</span>
              <span>🔒 Your data is secure</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
