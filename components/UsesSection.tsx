import { ShoppingCart, FileCheck, DollarSign, Globe } from 'lucide-react'

const uses = [
  {
    icon: ShoppingCart,
    title: 'Pre-Purchase Inspections',
    description: 'Before buying a used car, verify its history to avoid costly mistakes. Check for accidents, title issues, and odometer discrepancies.',
    color: 'blue',
  },
  {
    icon: FileCheck,
    title: 'Insurance Verification',
    description: 'Insurance companies use VIN checks to verify vehicle details and assess risk. Get accurate information for better rates.',
    color: 'green',
  },
  {
    icon: DollarSign,
    title: 'Resale Value Checks',
    description: 'Understand the true value of your vehicle. Get market estimates and see how history affects resale price.',
    color: 'purple',
  },
  {
    icon: Globe,
    title: 'Import/Export Verification',
    description: 'For importers and exporters, verify vehicle authenticity and compliance. Essential for cross-border transactions.',
    color: 'orange',
  },
]

export default function UsesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How VIN Checks Help You</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pre-purchase inspections, insurance verification, resale value checks, 
            and peace of mind for importers/exporters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {uses.map((use, index) => {
            const Icon = use.icon
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
            }

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${colorClasses[use.color as keyof typeof colorClasses]} rounded-full p-3 w-fit mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{use.title}</h3>
                <p className="text-gray-600 text-sm">{use.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

