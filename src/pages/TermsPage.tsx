import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our services or making a booking.
          </p>
          <p className="text-gray-400 text-sm mt-4">Last updated: 1 March 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">1. Acceptance of Terms</h2>
            <p className="mb-3">
              By accessing the Univers Travel Agency website (the "Site"), creating an account, or making a booking, you ("Client", "you", or "your") acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions ("Terms"), our Privacy Policy, and any additional terms applicable to specific services or promotions. These Terms constitute a legally binding agreement between you and Univers Travel Agency LLC, a company incorporated under the laws of the State of New York ("Univers Travel Agency", "we", "us", or "our").
            </p>
            <p className="mb-3">
              If you do not agree to these Terms in their entirety, you must not access the Site, register an account, or purchase any services from Univers Travel Agency. We reserve the right to amend these Terms at any time without prior notice. Continued use of the Site following any amendment constitutes acceptance of the revised Terms.
            </p>
            <p>
              These Terms apply to all users of the Site, including without limitation users who are browsers, customers, merchants, and contributors of content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">2. Booking Agreement</h2>
            <p className="mb-3">
              A binding contract between Univers Travel Agency and the Client is formed upon Univers Travel Agency's written confirmation of a booking and receipt of the required deposit or full payment as applicable. The Client making the booking ("Lead Passenger") accepts these Terms on behalf of all persons named in the booking and is responsible for ensuring all members of their party are aware of and comply with these Terms.
            </p>
            <p className="mb-3">
              The Lead Passenger must be at least 18 years of age at the time of booking and must possess the legal capacity to enter into a binding contract. Bookings made on behalf of minors travelling without a parent or legal guardian must be accompanied by a completed Unaccompanied Minor Consent Form and are subject to additional verification procedures.
            </p>
            <p>
              Univers Travel Agency reserves the right to decline any booking at its sole discretion without being required to disclose reasons for such refusal. Bookings remain subject to availability and are not guaranteed until written confirmation is issued by Univers Travel Agency.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">3. Pricing and Payment</h2>
            <p className="mb-3">
              All prices displayed on the Site are quoted in United States Dollars (USD) unless otherwise stated and are inclusive of all Univers Travel Agency service charges. Prices are subject to change without notice until a booking is confirmed in writing and full or required deposit payment is received.
            </p>
            <p className="mb-3">
              A non-refundable deposit of 25% of the total booking value is required at the time of reservation unless the package is designated as "Full Payment Required". The remaining balance is due no later than 30 days prior to the scheduled departure date. For bookings made within 30 days of departure, full payment is required at the time of booking.
            </p>
            <p className="mb-3">
              Failure to remit payment by the due date will result in automatic cancellation of the booking without further notice. In such cases, the deposit and any amounts paid will be forfeited in accordance with the cancellation policy set out in Clause 5 of these Terms.
            </p>
            <p>
              Univers Travel Agency accepts payment via major credit and debit cards and bank transfers processed through PCI-DSS compliant third-party payment processors. Univers Travel Agency does not store payment card information on its systems. Any bank charges, currency conversion fees, or other transaction costs imposed by your financial institution are your sole responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">4. Package Inclusions and Exclusions</h2>
            <p className="mb-3">
              Each travel package includes the services specified in the package description published on the Site at the time of booking. Unless expressly stated otherwise, standard inclusions are: return economy-class airfare from the designated departure point, airport-to-hotel transfers, accommodation in the specified hotel category, daily breakfast, guided tours and excursions listed in the itinerary, and the services of a licensed local guide.
            </p>
            <p className="mb-3">
              The following items are expressly excluded from all packages unless specifically indicated: international or domestic departure taxes and airport improvement fees; visa, passport, and travel document fees; travel insurance premiums; personal expenses including laundry, telephone calls, room service, and minibar charges; meals and beverages not specified in the itinerary; optional excursions and activities; porterage and gratuities; and any costs arising from delays, diversions, or events beyond Univers Travel Agency's control.
            </p>
            <p>
              Univers Travel Agency reserves the right to substitute accommodation, airlines, or other service providers with alternatives of equivalent or superior standard without notice, provided that such substitution does not materially diminish the value of the package. In the event of a material substitution, clients will be informed and offered appropriate alternatives or compensation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">5. Cancellation and Refund Policy</h2>
            <p className="mb-3">
              All cancellation requests must be submitted in writing to Univers Travel Agency via phone at +355 68 403 0204 or via certified postal correspondence to our registered address. The date on which a cancellation request is received by Univers Travel Agency in writing constitutes the effective cancellation date.
            </p>
            <p className="mb-3">The following cancellation charges apply based on the number of days before the scheduled departure date:</p>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">Days Before Departure</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">Cancellation Charge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-200 px-4 py-3">More than 60 days</td><td className="border border-gray-200 px-4 py-3">Deposit only (non-refundable)</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-4 py-3">31–60 days</td><td className="border border-gray-200 px-4 py-3">50% of total booking cost</td></tr>
                  <tr><td className="border border-gray-200 px-4 py-3">15–30 days</td><td className="border border-gray-200 px-4 py-3">75% of total booking cost</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-4 py-3">14 days or fewer</td><td className="border border-gray-200 px-4 py-3">100% of total booking cost (no refund)</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mb-3">
              Promotional and non-refundable packages carry 100% cancellation charges from the date of booking and no refund will be issued under any circumstances.
            </p>
            <p>
              Approved refunds will be processed within 14 business days of written cancellation confirmation and credited to the original payment method. Univers Travel Agency is not liable for delays caused by third-party financial institutions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">6. Modifications and Amendments</h2>
            <p className="mb-3">
              Any changes requested by the Client to a confirmed booking (including changes to travel dates, passenger names, destinations, or accommodation) must be submitted in writing and are subject to availability, third-party supplier terms, and an administrative amendment fee of USD 75 per change per passenger. Univers Travel Agency will make reasonable efforts to accommodate amendment requests but cannot guarantee that such changes can be made.
            </p>
            <p>
              Univers Travel Agency reserves the right to modify itineraries, accommodation, transport, or other service components due to operational requirements, force majeure events, or circumstances beyond our reasonable control. Where modifications are significant, clients will be notified as promptly as practicable and offered the choice of accepting the modified arrangements, transferring to an alternative package of comparable value, or cancelling and receiving a full refund of monies paid.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">7. Force Majeure</h2>
            <p className="mb-3">
              Univers Travel Agency shall not be liable for any failure or delay in performance of its obligations under these Terms that results from events beyond its reasonable control, including but not limited to acts of God, natural disasters, earthquakes, floods, fires, pandemics, epidemics, governmental actions, war, armed conflict, civil unrest, terrorism, strikes, industrial disputes, transportation disruptions, or technical failures of infrastructure.
            </p>
            <p>
              In the event of a force majeure cancellation, Univers Travel Agency will issue travel credits equivalent to the full amount paid, valid for 24 months from the original departure date. Where a cash refund is requested under force majeure circumstances, it will be considered on a case-by-case basis and is subject to amounts recovered from third-party suppliers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">8. Travel Documents and Health Requirements</h2>
            <p className="mb-3">
              It is the sole and absolute responsibility of the Client to ensure that all members of the travel party hold valid passports (with at least six months' validity beyond the return date), appropriate visas, travel permits, vaccination certificates, and any other documentation required by the laws and regulations of the departure country, destination country, and any transit countries.
            </p>
            <p className="mb-3">
              Univers Travel Agency provides general destination information as a convenience and does not represent or warrant the accuracy or completeness of such information. This information does not constitute legal, immigration, or medical advice. Clients are solely responsible for independently verifying all entry requirements with the relevant consulates, embassies, and health authorities.
            </p>
            <p>
              Univers Travel Agency will not be liable for any loss, cost, or expense arising from a Client's failure to comply with travel document or health requirements, including denial of entry to the destination or transit country, and no refund will be issued in such circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">9. Travel Insurance</h2>
            <p className="mb-3">
              Univers Travel Agency strongly recommends that all Clients purchase comprehensive travel insurance covering medical emergencies, evacuation and repatriation, trip cancellation and interruption, baggage loss, and personal liability. Univers Travel Agency may offer travel insurance as an add-on service; however, this does not constitute a requirement to purchase insurance through Univers Travel Agency.
            </p>
            <p>
              Travelling without adequate insurance is at the Client's own risk. Univers Travel Agency shall have no liability for any loss, injury, death, or expense that would have been covered by a comprehensive travel insurance policy. Evidence of travel insurance may be required prior to departure for certain high-risk or remote destinations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">10. Limitation of Liability</h2>
            <p className="mb-3">
              To the fullest extent permitted by applicable law, Univers Travel Agency's total aggregate liability to any Client, whether in contract, tort (including negligence), statutory duty, or otherwise, arising out of or in connection with any booking, package, or service shall not exceed the total price paid by the Client for the relevant booking giving rise to the claim.
            </p>
            <p className="mb-3">
              Univers Travel Agency shall not be liable for any indirect, incidental, special, punitive, consequential, or exemplary damages, including but not limited to loss of profits, loss of revenue, loss of data, loss of opportunity, or loss of enjoyment, even if advised of the possibility of such damages.
            </p>
            <p>
              Univers Travel Agency acts as an agent for independent third-party service providers including airlines, hotels, ground transportation companies, and tour operators. Univers Travel Agency accepts no responsibility for the acts, omissions, or negligence of such third parties or for any injury, damage, loss, delay, additional expense, or irregularity arising from services provided by third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">11. Complaints and Dispute Resolution</h2>
            <p className="mb-3">
              Any complaint arising during travel must be reported immediately to the local Univers Travel Agency representative or the relevant service provider so that remedial action may be taken. Complaints not reported during travel cannot be addressed retroactively. Formal complaints must be submitted in writing to Univers Travel Agency within 28 days of the return date, accompanied by all relevant supporting documentation.
            </p>
            <p className="mb-3">
              Univers Travel Agency will acknowledge receipt of all written complaints within 5 business days and provide a substantive response within 28 days of receipt of all required documentation. In the event of an unresolved dispute, both parties agree to engage in good-faith mediation prior to initiating any legal proceedings.
            </p>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States. Any disputes that cannot be resolved by mediation shall be subject to the exclusive jurisdiction of the courts of New York County, New York.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">12. Intellectual Property</h2>
            <p className="mb-3">
              All content published on the Site, including but not limited to text, photographs, graphics, logos, icons, audio clips, video clips, digital downloads, data compilations, and software, is the property of Univers Travel Agency LLC or its content suppliers and is protected by United States and international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              No content from the Site may be reproduced, distributed, transmitted, displayed, published, broadcast, or otherwise commercially exploited without the prior express written permission of Univers Travel Agency. Unauthorised use of Site content may give rise to a claim for damages and may constitute a criminal offence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">13. Privacy</h2>
            <p>
              Your use of the Site and our services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By making a booking or creating an account, you consent to the collection, use, and disclosure of your personal information in accordance with our Privacy Policy. Please review our Privacy Policy carefully to understand our data handling practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">14. Client Conduct and Responsibilities</h2>
            <p className="mb-3">
              All clients are expected to behave in a manner that is lawful, respectful, and consistent with the cultural norms of the destination country. Univers Travel Agency reserves the right to remove from any tour, excursion, or accommodation any client whose conduct is deemed disruptive, threatening, abusive, or otherwise detrimental to other clients, staff, or local communities.
            </p>
            <p className="mb-3">
              In the event of such removal, no refund will be issued, and the client assumes full responsibility for any additional costs incurred, including return transportation and accommodation. Univers Travel Agency will not be liable for any consequential loss suffered by the client or third parties as a result of removal under this clause.
            </p>
            <p>
              Clients are solely responsible for compliance with the laws of the destination country, including customs regulations, visa conditions, and public order laws. Univers Travel Agency accepts no liability for fines, detentions, deportations, or other consequences arising from a client's failure to comply with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">15. Health, Medical Conditions, and Accessibility</h2>
            <p className="mb-3">
              Clients with pre-existing medical conditions, reduced mobility, pregnancy, or other health requirements must disclose these to Univers Travel Agency at the time of booking. While Univers Travel Agency will make reasonable efforts to accommodate specific needs, we cannot guarantee that all services, venues, or transport will be accessible or appropriate for all health conditions.
            </p>
            <p className="mb-3">
              Univers Travel Agency strongly recommends that clients consult a qualified medical professional prior to travel, particularly for destinations with altitude variations, tropical climates, or limited medical infrastructure. General health information provided by Univers Travel Agency is for guidance only and does not constitute medical advice.
            </p>
            <p>
              Clients requiring specific medications or medical equipment are solely responsible for ensuring that such items comply with import regulations in destination and transit countries and are carried in appropriate quantities. Univers Travel Agency accepts no liability for issues arising from undisclosed health conditions or the client's failure to carry required medication or documentation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">16. Photography, Media, and Privacy</h2>
            <p className="mb-3">
              Clients consent to being photographed or filmed by Univers Travel Agency staff or authorised partners during group tours and excursions. Such images and footage may be used for marketing, promotional, and training purposes across Univers Travel Agency's digital and print channels. Clients who do not consent to such use must inform Univers Travel Agency in writing prior to departure.
            </p>
            <p>
              Clients are responsible for complying with applicable privacy and photography laws in destination countries. Photography of military installations, government buildings, border crossings, or individuals without consent may be prohibited and could result in criminal liability. Univers Travel Agency accepts no responsibility for the legal consequences of a client's photographic or recording activities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">17. Package Transfers and Name Changes</h2>
            <p className="mb-3">
              In circumstances where a client is unable to travel, the booking may in some cases be transferred to another individual subject to the following conditions: the transfer request must be submitted in writing no fewer than 14 days prior to departure; the proposed transferee must meet all applicable visa, health, and documentation requirements; and an administrative transfer fee of USD 100 per person applies, in addition to any costs imposed by third-party suppliers.
            </p>
            <p>
              Not all components of a booking may be transferable. Airlines, in particular, may charge significant fees for passenger name changes or may prohibit them entirely. The original client remains financially responsible for any charges that cannot be transferred to the new client. Univers Travel Agency will advise on the feasibility and cost of any proposed transfer at the time of request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">18. Governing Law and Jurisdiction</h2>
            <p className="mb-3">
              Univers Travel Agency LLC is incorporated and operates under the laws of the Republic of Albania. These Terms are governed by Albanian commercial law and applicable EU regulations where relevant, including but not limited to EU Package Travel Directive 2015/2302 for clients booking packaged travel arrangements within the European Union.
            </p>
            <p className="mb-3">
              For clients resident in EU or EEA member states, the mandatory consumer protection provisions of the client's country of residence shall apply to the extent required by applicable law, and nothing in these Terms shall be construed to exclude or limit rights conferred by such provisions.
            </p>
            <p>
              Any disputes arising from or relating to these Terms or any booking made with Univers Travel Agency that cannot be resolved by direct negotiation or mediation shall be subject to the exclusive jurisdiction of the competent courts of Tirana, Albania, unless mandatory consumer protection law in the client's jurisdiction provides otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">19. Package Travel Directive Compliance (EU Clients)</h2>
            <p className="mb-3">
              For clients purchasing package travel arrangements subject to EU Directive 2015/2302, Univers Travel Agency provides the following statutory information and protections:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2 mb-3">
              <li>The traveller will receive all essential information about the package before concluding the package travel contract.</li>
              <li>There is always at least one trader who is liable for the proper performance of all travel services included in the contract.</li>
              <li>Travellers are provided with an emergency telephone number or details of a contact point where they can get in touch with the organiser or travel agent.</li>
              <li>Travellers may transfer the package to another person, on reasonable notice and possibly subject to additional costs, where the transferee meets all conditions applicable to the package.</li>
              <li>The price of the package may only be increased if specific costs rise (e.g., fuel prices), and if expressly stipulated in the contract, and in any event not later than 20 days before the start of the package. If the price increase exceeds 8% of the price of the package, the traveller may terminate the contract.</li>
              <li>Travellers may terminate the contract without paying any termination fee and receive a full refund of any payments if any of the essential elements of the package, other than the price, are changed significantly. If before the start of the package the trader responsible for the package cancels the package, travellers are entitled to a refund and compensation where appropriate.</li>
              <li>In exceptional circumstances — e.g., significant security problems at the destination which are likely to affect the package — travellers may terminate the contract before the start of the package without paying any termination fee.</li>
              <li>Additionally, travellers may at any time before the start of the package terminate the contract in return for an appropriate and justifiable termination fee.</li>
              <li>Univers Travel Agency has protection in place to refund payments and, where transport is included in the package, to ensure the repatriation of travellers in the event of its insolvency.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">20. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid, unlawful, or unenforceable by a court of competent jurisdiction, such provision shall be severed from these Terms to the minimum extent necessary, and the remainder of these Terms shall continue in full force and effect. The invalidity or unenforceability of any provision shall not affect the validity or enforceability of any other provision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">21. Entire Agreement</h2>
            <p>
              These Terms, together with the Privacy Policy, any applicable booking confirmation, package description, and special conditions communicated in writing at the time of booking, constitute the entire agreement between Univers Travel Agency and the Client with respect to the subject matter hereof, and supersede all prior and contemporaneous agreements, representations, warranties, and understandings of any nature, whether written or oral. No amendment to these Terms shall be binding unless made in writing and signed by an authorised representative of Univers Travel Agency.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">22. Contact Information</h2>
            <p className="mb-3">
              For questions, clarifications, or formal correspondence regarding these Terms and Conditions, please contact Univers Travel Agency LLC using the details below:
            </p>
            <div className="bg-gray-50 rounded-lg p-5 text-sm space-y-1">
              <p><span className="font-medium text-gray-900">Univers Travel Agency</span></p>
              <p>Univers City, Tiranë</p>
              <p>Albania</p>
              <p className="pt-2">Phone: +355 68 403 0204</p>
              <p>Email: info@universstravel.com</p>
              <p>Instagram: @universstravel</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
