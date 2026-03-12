import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We are committed to protecting your personal information and your right to privacy.
          </p>
          <p className="text-gray-400 text-sm mt-4">Last updated: 1 March 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">1. Introduction and Scope</h2>
            <p className="mb-3">
              Univers Travel Agency LLC ("Univers Travel Agency", "we", "us", or "our") is committed to protecting the privacy and security of your personal information. This Privacy Policy ("Policy") explains how we collect, use, disclose, store, and safeguard your personal data when you visit our website at universTravel.com (the "Site"), create an account, make a booking, or otherwise interact with our services.
            </p>
            <p className="mb-3">
              This Policy applies to all personal data processed by Univers Travel Agency in connection with the services we provide, including data collected online through the Site, over the telephone, in person, or through written correspondence. It applies to all individuals whose data we process, including prospective clients, current clients, past clients, and visitors to the Site.
            </p>
            <p>
              Univers Travel Agency operates as both a data controller and, in certain circumstances, a data processor. We process personal data in compliance with applicable data protection laws, including the California Consumer Privacy Act (CCPA), the General Data Protection Regulation (GDPR) where applicable, and other relevant federal and state privacy laws in the United States.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">2. Personal Data We Collect</h2>
            <p className="mb-3">We collect personal data in various categories depending on your interaction with our services:</p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">2.1 Identity and Contact Data</h3>
            <p className="mb-3">
              This includes your full legal name, date of birth, gender, nationality, passport number and expiry date, email address, telephone number, postal address, and emergency contact information. This data is collected when you register an account, complete a booking, or contact our customer support team.
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">2.2 Financial Data</h3>
            <p className="mb-3">
              This includes payment card details (card number, expiry date, security code), billing address, and transaction history. Note that full payment card numbers are not stored on our systems; payment processing is handled exclusively by PCI-DSS Level 1 compliant third-party payment processors. We retain records of transaction amounts, dates, and methods for accounting and compliance purposes.
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">2.3 Travel and Booking Data</h3>
            <p className="mb-3">
              This includes booking history, itinerary details, accommodation preferences, dietary requirements, accessibility needs, special service requests, and co-traveller information for all passengers included in your booking.
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">2.4 Technical and Usage Data</h3>
            <p className="mb-3">
              This includes your IP address, browser type and version, device identifiers, operating system, time zone, geographic location (derived from IP address), pages visited, links clicked, session duration, referral URLs, and other diagnostic data collected automatically when you access the Site.
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">2.5 Communications Data</h3>
            <p>
              This includes records of your correspondence with us, including emails, telephone call logs (where calls are recorded for quality assurance purposes), live chat transcripts, and feedback or review submissions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">3. How We Collect Personal Data</h2>
            <p className="mb-3">We collect personal data through the following means:</p>
            <ul className="list-disc list-inside space-y-2 mb-3 text-sm pl-2">
              <li><span className="font-medium">Direct interactions:</span> When you register an account, complete a booking form, subscribe to marketing communications, enter a competition, complete a survey, contact our support team, or otherwise provide information directly to us.</li>
              <li><span className="font-medium">Automated technologies:</span> As you navigate the Site, we may automatically collect technical data through cookies, web beacons, server logs, and similar tracking technologies.</li>
              <li><span className="font-medium">Third parties:</span> We may receive data about you from analytics providers, advertising networks, social media platforms (where you log in using a social account), payment processors, identity verification services, and travel suppliers.</li>
              <li><span className="font-medium">Publicly available sources:</span> We may combine personal data with publicly available information such as government travel advisories, immigration databases where legally authorised, and public social media profiles where relevant to our service obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">4. Legal Basis for Processing</h2>
            <p className="mb-3">We process your personal data on the following legal bases:</p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2">
              <li><span className="font-medium">Contract performance:</span> Processing is necessary to fulfil our contractual obligations to you, including processing bookings, issuing confirmations, arranging travel services, and managing your account.</li>
              <li><span className="font-medium">Legal obligation:</span> Processing is required to comply with legal requirements, including tax reporting obligations, anti-money laundering regulations, and government-mandated passenger data sharing (such as Advance Passenger Information systems).</li>
              <li><span className="font-medium">Legitimate interests:</span> We process data for our legitimate business interests, including fraud prevention, security monitoring, business analytics, and service improvement, provided these interests are not overridden by your privacy rights.</li>
              <li><span className="font-medium">Consent:</span> Where required by law, we will obtain your explicit consent before processing your data for specific purposes, such as sending marketing communications or processing sensitive personal data (e.g., health information for accessibility requests).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">5. How We Use Your Personal Data</h2>
            <p className="mb-3">We use your personal data for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2">
              <li>Processing and managing your travel bookings and related services</li>
              <li>Verifying your identity and conducting security checks</li>
              <li>Processing payments and managing financial transactions</li>
              <li>Communicating booking confirmations, itineraries, and service updates</li>
              <li>Providing customer support and responding to enquiries and complaints</li>
              <li>Complying with legal, regulatory, and governmental requirements</li>
              <li>Sharing passenger data with airlines, hotels, immigration authorities, and other suppliers as required to fulfil your booking</li>
              <li>Conducting internal analytics to improve our services and website</li>
              <li>Sending marketing communications where you have opted in or where permitted by law</li>
              <li>Preventing fraud, money laundering, and other illegal activities</li>
              <li>Enforcing our Terms and Conditions and protecting our legal rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">6. Disclosure of Personal Data</h2>
            <p className="mb-3">
              Univers Travel Agency does not sell, rent, or lease your personal data to third parties for their own marketing purposes. We may share your personal data with the following categories of recipients:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2 mb-3">
              <li><span className="font-medium">Travel suppliers:</span> Airlines, hotels, cruise lines, car rental companies, tour operators, and ground transportation providers, to the extent necessary to fulfil your booking.</li>
              <li><span className="font-medium">Payment processors:</span> PCI-DSS compliant payment gateways and fraud prevention services.</li>
              <li><span className="font-medium">Government and regulatory authorities:</span> Immigration authorities, customs agencies, and law enforcement bodies where required by law or court order.</li>
              <li><span className="font-medium">Technology service providers:</span> Cloud hosting providers, email delivery services, customer relationship management platforms, and analytics services that process data on our behalf under appropriate data processing agreements.</li>
              <li><span className="font-medium">Professional advisors:</span> Legal counsel, accountants, auditors, and insurance providers under duties of confidentiality.</li>
              <li><span className="font-medium">Business transfers:</span> In the event of a merger, acquisition, or sale of Univers Travel Agency's assets, your data may be transferred to the successor entity subject to the same privacy protections.</li>
            </ul>
            <p>
              All third-party data processors are required to maintain the confidentiality and security of your personal data and are prohibited from using it for purposes beyond those specified in their contractual agreements with Univers Travel Agency.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">7. International Data Transfers</h2>
            <p className="mb-3">
              Given the international nature of travel services, your personal data may be transferred to and processed in countries outside the United States, including countries where data protection laws may provide a lower standard of protection than those in your home jurisdiction.
            </p>
            <p>
              Where data is transferred internationally, Univers Travel Agency ensures that appropriate safeguards are in place, including Standard Contractual Clauses approved by relevant authorities, adequacy decisions, or other lawful transfer mechanisms. By making a booking that involves international travel, you acknowledge that your data must be shared with entities in the destination country to fulfil your travel arrangements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">8. Data Retention</h2>
            <p className="mb-3">
              We retain personal data for as long as necessary to fulfil the purposes for which it was collected, to comply with our legal and regulatory obligations, to resolve disputes, and to enforce our agreements.
            </p>
            <p className="mb-3">Specific retention periods include:</p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2">
              <li>Booking and transaction records: 7 years from the date of travel (for tax and accounting compliance)</li>
              <li>Customer account data: Duration of active account plus 3 years following account closure</li>
              <li>Marketing preferences and consent records: Duration of consent plus 3 years</li>
              <li>Website usage and analytics data: 26 months from date of collection</li>
              <li>Customer service communications: 3 years from date of last interaction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">9. Cookies and Tracking Technologies</h2>
            <p className="mb-3">
              The Site uses cookies and similar tracking technologies to enhance your experience, analyse Site traffic, and deliver relevant content. Cookies are small text files placed on your device by your web browser when you visit the Site.
            </p>
            <p className="mb-3">We use the following categories of cookies:</p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2 mb-3">
              <li><span className="font-medium">Strictly Necessary Cookies:</span> Essential for the operation of the Site, including session management, authentication, and security functions.</li>
              <li><span className="font-medium">Analytics Cookies:</span> Collect anonymised information about how visitors use the Site to help us improve its performance and content.</li>
              <li><span className="font-medium">Functional Cookies:</span> Remember your preferences and settings to provide a personalised experience.</li>
              <li><span className="font-medium">Marketing Cookies:</span> Track your browsing activity to deliver relevant advertisements on third-party platforms. These are only placed with your consent.</li>
            </ul>
            <p>
              You may manage your cookie preferences through your browser settings or our Cookie Preference Centre. Please note that disabling certain cookies may affect the functionality of the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">10. Your Privacy Rights</h2>
            <p className="mb-3">
              Subject to applicable law, you have the following rights in relation to your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2 mb-3">
              <li><span className="font-medium">Right of Access:</span> You may request a copy of the personal data we hold about you.</li>
              <li><span className="font-medium">Right to Rectification:</span> You may request correction of inaccurate or incomplete personal data.</li>
              <li><span className="font-medium">Right to Erasure:</span> You may request deletion of your personal data where it is no longer necessary for the purposes for which it was collected, subject to legal retention obligations.</li>
              <li><span className="font-medium">Right to Restriction:</span> You may request that we restrict processing of your data in certain circumstances.</li>
              <li><span className="font-medium">Right to Data Portability:</span> You may request that we provide your personal data in a structured, machine-readable format for transfer to another service provider.</li>
              <li><span className="font-medium">Right to Object:</span> You may object to processing of your personal data for direct marketing or where processing is based on legitimate interests.</li>
              <li><span className="font-medium">Right to Withdraw Consent:</span> Where processing is based on your consent, you may withdraw consent at any time without affecting the lawfulness of processing carried out before withdrawal.</li>
              <li><span className="font-medium">California Rights (CCPA):</span> California residents have additional rights including the right to know what personal information is collected, the right to non-discrimination for exercising privacy rights, and the right to opt out of any sale of personal information.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at +355 68 403 0204. We will respond within 30 days of receipt of your request. Identity verification may be required before processing your request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">11. Data Security</h2>
            <p className="mb-3">
              Univers Travel Agency implements appropriate technical and organisational security measures to protect your personal data against unauthorised access, accidental loss, destruction, alteration, or disclosure. Our security measures include industry-standard SSL/TLS encryption for data transmitted via the Site, AES-256 encryption for stored sensitive data, access controls and multi-factor authentication for internal systems, regular security audits and penetration testing, and employee data protection training.
            </p>
            <p>
              Despite these measures, no data transmission over the internet or electronic storage system can be guaranteed as completely secure. In the event of a data breach that is likely to result in a high risk to your rights and freedoms, we will notify you and relevant supervisory authorities as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">12. Children's Privacy</h2>
            <p className="mb-3">
              The Site and our services are not directed to children under the age of 16. Univers Travel Agency does not knowingly collect personal data from individuals under 16 without verifiable parental or guardian consent.
            </p>
            <p>
              Personal data of minors included in family or group bookings is processed solely for the purpose of fulfilling travel arrangements and is handled with additional care. If you believe we have inadvertently collected personal data from a child under 16 without consent, please contact us immediately and we will take prompt steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">13. Marketing Communications</h2>
            <p className="mb-3">
              With your consent, Univers Travel Agency may send you marketing communications about our products, services, promotions, and travel inspiration. You may opt in to receive these communications during registration or at any time through your account settings.
            </p>
            <p>
              You may opt out of marketing communications at any time by updating your preferences in your account settings, or contacting us at +355 68 403 0204. Please note that opting out of marketing communications does not affect transactional communications related to your bookings, which are necessary for service delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">14. Automated Decision-Making and Profiling</h2>
            <p className="mb-3">
              Univers Travel Agency does not make decisions solely based on automated processing, including profiling, that produce legal or similarly significant effects on individuals. Where automated tools are used to assist in service delivery — such as personalised package recommendations or dynamic pricing — a human review process is maintained for any consequential decisions.
            </p>
            <p>
              You have the right to request human review of any automated decision that materially affects you. To exercise this right, please contact us using the details in Section 15 of this Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">15. Sensitive Personal Data</h2>
            <p className="mb-3">
              Certain categories of personal data are classified as "special category" data under applicable data protection law and require a higher standard of protection. These include data relating to health conditions, dietary restrictions reflecting religious beliefs, and accessibility requirements.
            </p>
            <p className="mb-3">
              Univers Travel Agency only collects and processes sensitive personal data where strictly necessary to fulfil your travel arrangements and with your explicit consent. For example, dietary requirements indicating religious observance or health-related dietary restrictions may be shared with accommodation providers and airlines solely to ensure appropriate meals are provided.
            </p>
            <p>
              Sensitive personal data is subject to additional access controls and is not retained beyond the period necessary to fulfil its purpose. We do not use sensitive personal data for profiling, marketing, or any purpose beyond direct service delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">16. Third-Party Websites and External Links</h2>
            <p className="mb-3">
              The Site may contain links to third-party websites, including travel suppliers, partner organisations, and information resources. These links are provided for convenience only and do not constitute an endorsement of the linked website or its content. Univers Travel Agency has no control over the privacy practices or content of third-party websites and is not responsible for their data handling.
            </p>
            <p>
              We encourage you to read the privacy policies of any third-party websites you visit. This Privacy Policy applies solely to data collected by Univers Travel Agency in connection with our Site and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">17. Passenger Name Records (PNR) and Government Disclosure</h2>
            <p className="mb-3">
              When booking international travel, Univers Travel Agency is legally required in certain circumstances to submit Passenger Name Record (PNR) data to government authorities, including border agencies and customs services, in both the departure and destination countries. PNR data typically includes your name, contact details, travel itinerary, booking reference, payment method information (without card numbers), travel agent details, and seat and baggage information.
            </p>
            <p className="mb-3">
              This disclosure is not optional and is mandated by international agreements and national aviation security laws in countries including (but not limited to) the United States, the United Kingdom, Canada, and EU member states. By making a booking that involves international air travel, you acknowledge and consent to such mandatory disclosure.
            </p>
            <p>
              Univers Travel Agency does not disclose passenger data to government authorities beyond what is legally required and resists requests for data that exceed legal mandates to the fullest extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">18. Data Protection Officer</h2>
            <p className="mb-3">
              Univers Travel Agency has designated a Data Protection Officer (DPO) responsible for overseeing compliance with this Policy and applicable data protection legislation. The DPO is the primary point of contact for data subjects wishing to exercise their rights or raise concerns about data processing practices.
            </p>
            <div className="bg-gray-50 rounded-lg p-5 text-sm space-y-1">
              <p><span className="font-medium text-gray-900">Data Protection Officer</span></p>
              <p>Univers Travel Agency</p>
              <p>Univers City, Tiranë, Albania</p>
              <p className="pt-2">Phone: +355 68 403 0204</p>
              <p>Email: info@universstravel.com</p>
              <p>Response time: Within 5 business days of receipt</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">19. Supervisory Authority Complaints</h2>
            <p className="mb-3">
              If you are located in the European Economic Area (EEA) and believe that our processing of your personal data infringes applicable data protection law, you have the right to lodge a complaint with your local supervisory authority. In Albania, the supervisory authority responsible for data protection enforcement is:
            </p>
            <div className="bg-gray-50 rounded-lg p-5 text-sm space-y-1 mb-4">
              <p><span className="font-medium text-gray-900">Information and Data Protection Commissioner (IDPC)</span></p>
              <p>Blv. "Zhan D'Ark", Nr. 10, Tiranë, Albania</p>
              <p>Website: idp.al</p>
              <p>Phone: +355 4 227 8560</p>
            </div>
            <p>
              You may also lodge a complaint with the supervisory authority in your country of habitual residence, place of work, or the place of the alleged infringement. We encourage you to contact us directly in the first instance so that we have the opportunity to address your concerns before a formal complaint is lodged.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">20. Changes to This Policy</h2>
            <p>
              Univers Travel Agency reserves the right to update or modify this Privacy Policy at any time to reflect changes in our data processing practices, legal requirements, or business operations. Material changes will be communicated by posting the updated Policy on the Site with a revised "Last Updated" date and, where appropriate, by sending an email notification to registered account holders. Your continued use of the Site following publication of changes constitutes acceptance of the revised Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">21. Contact and Complaints</h2>
            <p className="mb-3">
              For any questions, concerns, or requests regarding this Privacy Policy or our data processing practices, please contact our Data Privacy Officer:
            </p>
            <div className="bg-gray-50 rounded-lg p-5 text-sm space-y-1 mb-4">
              <p><span className="font-medium text-gray-900">Univers Travel Agency</span></p>
              <p>Univers City, Tiranë</p>
              <p>Albania</p>
              <p className="pt-2">Phone: +355 68 403 0204</p>
              <p>Email: info@universstravel.com</p>
              <p>Instagram: @universstravel</p>
            </div>
            <p>
              If you believe your privacy rights have been violated and your complaint has not been satisfactorily addressed by Univers Travel Agency, you have the right to lodge a complaint with the relevant data protection supervisory authority in your jurisdiction.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
