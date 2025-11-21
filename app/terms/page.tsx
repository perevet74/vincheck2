import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By using camVIN, you agree to be bound by these Terms of Service. 
                If you do not agree, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Service Description</h2>
              <p className="text-gray-700">
                camVIN provides vehicle history reports based on VIN (Vehicle 
                Identification Number) checks. We use data from third-party sources 
                including NHTSA and vehicle history databases.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Payment Terms</h2>
              <p className="text-gray-700">
                Payments are processed through MTN Mobile Money. All payments are 
                final unless there is a technical error on our part. Refunds are 
                available only for failed services due to technical issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Subscription Terms</h2>
              <p className="text-gray-700">
                Monthly subscriptions are billed monthly and automatically renew 
                unless cancelled. You can cancel your subscription at any time, 
                but no refunds are provided for the current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Data Accuracy</h2>
              <p className="text-gray-700">
                While we strive for accuracy, we cannot guarantee that all information 
                in reports is complete or error-free. Reports are based on available 
                data from third-party sources.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
              <p className="text-gray-700">
                camVIN is not liable for any decisions made based on our reports. 
                Users should verify information independently before making purchase 
                decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
              <p className="text-gray-700">
                For questions about these Terms, contact us at support@camairvin.com
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

