import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">We're here to help. Whether you have a question about our products, need technical support, or want to partner with NovaTech.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email Us</p>
                    <p className="text-gray-500">support@novatech.com</p>
                    <p className="text-gray-500">sales@novatech.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-50 p-3 rounded-full text-purple-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Call Us</p>
                    <p className="text-gray-500">+1 (555) 123-4567</p>
                    <p className="text-gray-500">Mon-Fri, 9am - 6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-50 p-3 rounded-full text-green-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Headquarters</p>
                    <p className="text-gray-500">123 Innovation Drive<br/>Tech Valley, CA 94043</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" placeholder="Jane" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" placeholder="jane@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Order Status</option>
                    <option>Partnerships</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none" placeholder="How can we help you today?"></textarea>
                </div>

                <button type="button" className="w-full bg-indigo-600 text-white font-bold rounded-xl px-4 py-4 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  Send Message <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
