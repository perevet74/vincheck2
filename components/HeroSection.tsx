import VINForm from './VINForm'
import { Shield, Zap, CheckCircle } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          camVIN Check Your Car's History in Seconds
        </h1>
        <p className="text-xl sm:text-2xl mb-4 text-blue-100">
          Safe Buying Starts Here!
        </p>
        <p className="text-lg sm:text-xl mb-12 text-blue-200 max-w-2xl mx-auto">
          Get comprehensive VIN reports for vehicles in Cameroon and Africa. 
          Uncover accidents, theft, salvage titles, and more.
        </p>

        <VINForm />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-white/10 rounded-full p-4 mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
            <p className="text-blue-100 text-sm">
              Protect yourself from scams and hidden vehicle problems
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white/10 rounded-full p-4 mb-4">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
            <p className="text-blue-100 text-sm">
              Get detailed reports in seconds, not days
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white/10 rounded-full p-4 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trusted Data</h3>
            <p className="text-blue-100 text-sm">
              Official sources and verified vehicle information
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

