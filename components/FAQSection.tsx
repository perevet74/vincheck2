'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'What is a VIN?',
    answer: 'A VIN (Vehicle Identification Number) is a unique 17-character code that identifies a specific vehicle. It acts like a fingerprint, containing information about the vehicle\'s manufacturer, model, year, and other details.',
  },
  {
    question: 'How do I find my VIN?',
    answer: 'You can find your VIN in several places: on the dashboard (visible through the windshield), on the driver\'s side door jamb, on vehicle registration documents, insurance cards, or on the engine block.',
  },
  {
    question: 'Is this service legal?',
    answer: 'Yes, VIN checking is completely legal. We use publicly available data from official sources like NHTSA and authorized vehicle history databases. This is a standard practice for vehicle verification.',
  },
  {
    question: 'How accurate is the information?',
    answer: 'Our reports use data from official sources including government databases, insurance companies, and authorized vehicle history providers. While we strive for accuracy, some information may be incomplete if not reported to these sources.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We currently accept MTN Mobile Money (MoMo) payments. You can pay 500 FCFA for a one-time report or 7,500 FCFA per month for unlimited reports.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Refunds are available if the VIN check fails due to technical issues on our end. However, if the report is successfully generated, refunds are not available as the service has been delivered.',
  },
  {
    question: 'How long does a report take?',
    answer: 'Free basic reports are generated instantly. Full history reports are also delivered immediately after payment confirmation. The entire process typically takes less than a minute.',
  },
  {
    question: 'Do you store my payment information?',
    answer: 'No, we do not store your payment information. All payments are processed securely through MTN Mobile Money. We only store your phone number for account management and subscription purposes.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about VIN checks and our service
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

