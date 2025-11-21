import { AlertTriangle, FileText, Shield, Eye } from 'lucide-react'

export default function WhyVINSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why VIN Check?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A VIN (Vehicle Identification Number) is your car's unique fingerprint. 
            It reveals hidden issues like accidents, theft, salvage titles, and ownership 
            history to protect you from scams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full p-3">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Avoid Hidden Problems</h3>
                <p className="text-gray-600">
                  Discover accidents, flood damage, and other issues that sellers might not disclose. 
                  Make informed decisions with complete vehicle history.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="bg-green-600 rounded-full p-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Protect Your Investment</h3>
                <p className="text-gray-600">
                  In Cameroon and Africa, many used cars have unreported problems. 
                  Our service uncovers title brands, odometer fraud, and more for informed decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="bg-purple-600 rounded-full p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Complete Documentation</h3>
                <p className="text-gray-600">
                  Get detailed reports with ownership history, service records, 
                  recalls, and market value estimates.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="bg-orange-600 rounded-full p-3">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                <p className="text-gray-600">
                  See everything about a vehicle before you buy. No surprises, 
                  no hidden costs, just complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

