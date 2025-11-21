import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Jean Paul',
    location: 'Douala, Cameroon',
    rating: 5,
    text: 'camVIN saved me from buying a flood-damaged car. The report showed everything the seller tried to hide. Worth every franc!',
  },
  {
    name: 'Marie Claire',
    location: 'Yaoundé, Cameroon',
    rating: 5,
    text: 'As a car dealer, I use camVIN for every vehicle I consider. It helps me make better decisions and build trust with customers.',
  },
  {
    name: 'Samuel T.',
    location: 'Buea, Cameroon',
    rating: 5,
    text: 'The subscription is a game-changer. I check multiple cars monthly, and the unlimited reports make it incredibly affordable.',
  },
  {
    name: 'Amanda K.',
    location: 'Limbe, Cameroon',
    rating: 5,
    text: 'Fast, reliable, and detailed. The PDF report is perfect for sharing with my mechanic before making a purchase decision.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of car buyers and sellers across Cameroon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

