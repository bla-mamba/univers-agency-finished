import { useState} from'react';
import { ChevronDown, ChevronUp, HelpCircle} from'lucide-react';

interface FAQItem {
 question: string;
 answer: string;
 category: string;
}

const faqs: FAQItem[] = [
 {
 category:'Booking & Reservations',
 question:'How do I make a booking with Univers Travel Agency?',
 answer:
'You can book a travel package directly through our website by browsing available packages and destinations, selecting your preferred option, and completing the secure checkout process. Once your booking is confirmed, you will receive a confirmation email with all relevant details including itinerary, accommodation information, and contact details for your destination. Alternatively, you may contact our customer service team by phone or email for personalized assistance.',
},
 {
 category:'Booking & Reservations',
 question:'Can I book a package for a group or family?',
 answer:
'Yes. Univers Travel Agency accommodates group and family bookings. Group rates and special arrangements may apply depending on the number of travellers and the destination. We recommend contacting our reservations team at least 30 days in advance for groups of six or more to allow sufficient time for customised arrangements, accommodation coordination, and any required permit or visa applications.',
},
 {
 category:'Booking & Reservations',
 question:'Is my booking confirmed immediately after payment?',
 answer:
'Most bookings are confirmed immediately upon successful payment processing. However, some packages — particularly those involving third-party suppliers, remote destinations, or limited availability — may require up to 48 business hours for final confirmation. You will receive an email notification regarding the status of your reservation. If confirmation is delayed beyond this period, please contact our support team.',
},
 {
 category:'Payments & Pricing',
 question:'What payment methods do you accept?',
 answer:
'We accept all major credit and debit cards (Visa, MasterCard, American Express, Discover), as well as secure online bank transfers. All transactions are processed through PCI-DSS compliant payment gateways to ensure the safety of your financial information. We do not store card details on our servers.',
},
 {
 category:'Payments & Pricing',
 question:'Are there any hidden fees or charges?',
 answer:
'Univers Travel Agency is committed to full price transparency. The price displayed at checkout includes all service fees charged by Univers Travel Agency. However, certain costs are not included and are the responsibility of the traveller: international departure taxes, visa and passport fees, travel insurance, personal expenses, gratuities, and any optional activities not specified in the package description. These will be clearly noted in the package details prior to booking.',
},
 {
 category:'Payments & Pricing',
 question:'Do you offer instalment payment plans?',
 answer:
'Yes, for packages valued above USD 1,000, we offer a structured instalment plan. A non-refundable deposit of 25% is required at the time of booking to secure your reservation. The remaining balance must be paid in full no later than 30 days prior to the scheduled departure date. Failure to complete payment by the due date may result in cancellation of your booking without refund of the deposit.',
},
 {
 category:'Cancellations & Refunds',
 question:'What is your cancellation policy?',
 answer:
'Cancellation terms vary depending on the package and are detailed in the specific package terms. As a general policy: cancellations made more than 60 days before departure are eligible for a full refund less a 10% administrative fee; cancellations between 30 and 60 days before departure receive a 50% refund; cancellations within 30 days of departure are non-refundable. Certain promotional packages and last-minute deals may carry stricter non-refundable terms, which will be disclosed at the time of booking.',
},
 {
 category:'Cancellations & Refunds',
 question:'What happens if Univers Travel Agency cancels my trip?',
 answer:
'In the unlikely event that Univers Travel Agency is required to cancel a trip due to circumstances within our control, you will be offered either a full refund of all monies paid or the option to transfer your booking to an alternative date or package of equivalent value. We will notify you as early as possible and work to minimise any inconvenience. For cancellations caused by force majeure events (natural disasters, pandemics, government travel restrictions, etc.), our force majeure policy applies and we will provide travel credits redeemable within 24 months.',
},
 {
 category:'Cancellations & Refunds',
 question:'How long does a refund take to process?',
 answer:
'Approved refunds are processed within 7–14 business days of the cancellation being confirmed in writing. The refund will be issued to the original payment method. Depending on your bank or card issuer, it may take an additional 3–5 business days for the credit to appear in your account. Univers Travel Agency is not responsible for delays caused by third-party financial institutions.',
},
 {
 category:'Travel Documents & Visas',
 question:'Do I need a visa for my destination?',
 answer:
'Visa requirements depend on your nationality and the destination country. It is the sole responsibility of the traveller to ensure they hold all required visas, permits, and valid travel documents prior to departure. Univers Travel Agency provides general destination information as a courtesy, but this does not constitute legal or immigration advice. We strongly recommend consulting the official embassy or consulate of your destination country and verifying entry requirements well in advance.',
},
 {
 category:'Travel Documents & Visas',
 question:'What travel documents do I need to carry?',
 answer:
'All travellers must carry a valid passport with at least six months of validity beyond the intended return date. Additional requirements may include visas, return flight confirmation, proof of accommodation, travel insurance documentation, vaccination certificates (where applicable), and any entry forms required by the destination country. Univers Travel Agency will provide a pre-departure checklist specific to your booking.',
},
 {
 category:'Travel Insurance',
 question:'Is travel insurance included in my package?',
 answer:
"Travel insurance is not automatically included in standard packages. However, we strongly advise all travellers to purchase comprehensive travel insurance covering medical emergencies, trip cancellation, loss of baggage, and personal liability. Univers Travel Agency partners with accredited insurance providers and can facilitate insurance purchase at the time of booking. Travelling without adequate insurance is done at the traveller's own risk.",
},
 {
 category:'Travel Insurance',
 question:'What does travel insurance typically cover?',
 answer:
'A comprehensive travel insurance policy typically covers emergency medical expenses and hospitalisation, medical evacuation and repatriation, trip cancellation or interruption due to covered causes, loss, theft, or damage of baggage and personal belongings, flight delay compensation, accidental death and dismemberment, and personal liability. Policy terms vary by provider; we recommend reviewing the product disclosure statement carefully before purchasing.',
},
 {
 category:'Itinerary & Packages',
 question:'Can I customise a travel package?',
 answer:
'Yes. Univers Travel Agency offers bespoke itinerary planning for travellers seeking a tailored experience. You may request customisations such as extended stays, alternative accommodation categories, private transfers, additional excursions, and special dietary arrangements. Customisation requests are subject to availability and may incur additional charges. Please submit customisation requests at least 21 days prior to departure to allow adequate time for arrangement.',
},
 {
 category:'Itinerary & Packages',
 question:'What is included in a standard travel package?',
 answer:
'Standard packages typically include return economy-class airfare from the designated departure city, airport transfers at the destination, accommodation as specified (hotel category indicated in package details), daily breakfast unless otherwise stated, guided tours and activities listed in the itinerary, and the services of a dedicated local guide. Items not included are detailed in the"Exclusions" section of each package listing.',
},
 {
 category:'Health & Safety',
 question:'Are there any health requirements for certain destinations?',
 answer:
'Some destinations require proof of vaccination against specific diseases (e.g., yellow fever, COVID-19). Additionally, certain regions may carry health advisories, and travellers should consult a travel medicine specialist or their GP at least 6–8 weeks before departure for advice on recommended vaccinations and prophylactic medications. Univers Travel Agency monitors destination health advisories and will notify you of any material changes affecting your booking.',
},
 {
 category:'Health & Safety',
 question:'What should I do in case of an emergency during my trip?',
 answer:
'In the event of an emergency, contact local emergency services immediately (police, ambulance, fire) using the local emergency numbers provided in your welcome pack. Following this, contact your travel insurance emergency assistance line and then our 24/7 traveller support hotline at +355 68 403 0204. Our support team is available around the clock to assist with medical emergencies, lost documents, and other critical situations.',
},
 {
 category:'Customer Service',
 question:'How can I contact Univers Travel Agency customer support?',
 answer:
'Our customer support team is available Monday through Friday, 9:00 AM to 6:00 PM, by phone at +355 68 403 0204. For urgent matters outside business hours, our emergency travel line is available 24/7 at +355 68 403 0204. Find us on Instagram @universstravel for updates and inquiries.',
},
 {
 category:'Customer Service',
 question:'How do I access my booking details after confirmation?',
 answer:
'Once registered and logged into your Univers Travel Agency account, you can view all booking details, itineraries, payment history, and correspondence under the"My Bookings" section of your profile. If you made a booking as a guest, your booking details will be accessible via the confirmation link sent to your registered email address. For account-related issues, please contact our support team.',
},
];

const categories = Array.from(new Set(faqs.map((f) => f.category)));

export default function FAQPage() {
 const [openIndex, setOpenIndex] = useState<number | null>(null);
 const [activeCategory, setActiveCategory] = useState<string>('All');

 const filtered = activeCategory ==='All' ? faqs : faqs.filter((f) => f.category === activeCategory);

 return (
 <div className="min-h-screen bg-gray-50">
 <div className="bg-gray-900 text-white py-16">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <div className="flex justify-center mb-4">
 <HelpCircle className="h-12 w-12 text-red-500" />
 </div>
 <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
 <p className="text-gray-300 text-lg max-w-2xl mx-auto">
 Find answers to the most common questions about our travel services, booking process, policies, and more.
 </p>
 </div>
 </div>

 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
 <div className="flex flex-wrap gap-2 mb-10">
 <button
 onClick={() => setActiveCategory('All')}
 className={`px-4 py-2 text-sm font-medium transition ${
 activeCategory ==='All'
 ?'bg-red-600 text-white'
 :'bg-white text-gray-600 border border-gray-300 hover:border-red-400 hover:text-red-600'
}`}
 >
 All
 </button>
 {categories.map((cat) => (
 <button
 key={cat}
 onClick={() => setActiveCategory(cat)}
 className={`px-4 py-2 text-sm font-medium transition ${
 activeCategory === cat
 ?'bg-red-600 text-white'
 :'bg-white text-gray-600 border border-gray-300 hover:border-red-400 hover:text-red-600'
}`}
 >
 {cat}
 </button>
 ))}
 </div>

 <div className="space-y-3">
 {filtered.map((faq, index) => {
 const globalIndex = faqs.indexOf(faq);
 const isOpen = openIndex === globalIndex;
 return (
 <div key={globalIndex} className="bg-white shadow-sm border border-gray-200 overflow-hidden">
 <button
 className="w-full text-left px-6 py-5 flex justify-between items-start gap-4"
 onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
 >
 <div>
 <span className="text-xs font-medium text-red-600 uppercase tracking-wide block mb-1">
 {faq.category}
 </span>
 <span className="text-gray-900 font-medium text-base">{faq.question}</span>
 </div>
 <span className="flex-shrink-0 mt-1 text-gray-400">
 {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
 </span>
 </button>
 {isOpen && (
 <div className="px-6 pb-5">
 <div className="border-t border-gray-100 pt-4">
 <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
 </div>
 </div>
 )}
 </div>
 );
})}
 </div>

 <div className="mt-12 bg-red-50 border border-red-100 p-8 text-center">
 <h2 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h2>
 <p className="text-gray-600 mb-4 text-sm">
 Our support team is ready to assist you with any queries not covered here.
 </p>
 <a
 href="tel:+355684030204"
 className="inline-block bg-red-600 text-white px-6 py-3 font-medium hover:bg-red-700 transition text-sm"
 >
 Call Us: +355 68 403 0204
 </a>
 </div>
 </div>
 </div>
 );
}
