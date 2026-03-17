import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Rezervime',
    question: 'Si mund të bëj një rezervim me Univers Travel Agency?',
    answer:
      'Ju mund të rezervoni një paketë udhëtimi direkt në faqen tonë duke shfletuar paketat dhe destinacionet e disponueshme, duke zgjedhur opsionin që ju përshtatet dhe duke përfunduar procesin e rezervimit në mënyrë të sigurt. Pasi rezervimi të konfirmohet, do të merrni një email konfirmimi me të gjitha detajet përkatëse, përfshirë itinerarin, informacionin mbi akomodimin dhe të dhënat e kontaktit për destinacionin tuaj. Gjithashtu, mund të kontaktoni ekipin tonë të shërbimit ndaj klientit me telefon ose email për asistencë të personalizuar.',
  },
  {
    category: 'Rezervime',
    question: 'A mund të rezervoj një paketë për grup ose familje?',
    answer:
      'Po. Univers Travel Agency ofron zgjidhje edhe për rezervime në grup ose për familje. Në varësi të numrit të udhëtarëve dhe destinacionit, mund të aplikohen tarifa speciale ose organizime të veçanta. Për grupe me gjashtë ose më shumë persona, ju rekomandojmë të kontaktoni ekipin tonë të rezervimeve të paktën 30 ditë përpara, në mënyrë që të kemi kohën e nevojshme për organizime të personalizuara, koordinimin e akomodimit dhe çdo procedurë të nevojshme për leje apo viza.',
  },
  {
    category: 'Rezervime',
    question: 'A konfirmohet rezervimi menjëherë pas pagesës?',
    answer:
      'Shumica e rezervimeve konfirmohen menjëherë pasi pagesa të përfundojë me sukses. Megjithatë, disa paketa, veçanërisht ato që përfshijnë partnerë të tretë, destinacione më të largëta ose disponueshmëri të kufizuar, mund të kërkojnë deri në 48 orë pune për konfirmimin përfundimtar. Ju do të njoftoheni me email për statusin e rezervimit tuaj. Nëse konfirmimi vonohet përtej kësaj periudhe, ju lutemi të kontaktoni ekipin tonë të mbështetjes.',
  },
  {
    category: 'Pagesa dhe çmime',
    question: 'Cilat metoda pagese pranoni?',
    answer:
      'Ne pranojmë kartat kryesore të kreditit dhe debitit, si Visa, MasterCard, American Express dhe Discover, si edhe transferta bankare online të sigurta. Të gjitha transaksionet përpunohen përmes sistemeve të pagesës në përputhje me standardet PCI-DSS, për të garantuar sigurinë e informacionit tuaj financiar. Ne nuk ruajmë të dhënat e kartës suaj në serverët tanë.',
  },
  {
    category: 'Pagesa dhe çmime',
    question: 'A ka tarifa ose kosto të fshehura?',
    answer:
      'Univers Travel Agency angazhohet për transparencë të plotë në çmime. Çmimi i paraqitur gjatë rezervimit përfshin të gjitha tarifat e shërbimit që aplikohen nga agjencia jonë. Megjithatë, disa shpenzime nuk përfshihen dhe mbeten përgjegjësi e udhëtarit, si taksat ndërkombëtare të nisjes, tarifat për viza dhe pasaportë, siguracioni i udhëtimit, shpenzimet personale, bakshishet dhe aktivitetet opsionale që nuk përmenden në përshkrimin e paketës. Këto do të shënohen qartë në detajet e paketës përpara rezervimit.',
  },
  {
    category: 'Pagesa dhe çmime',
    question: 'A ofroni pagesë me këste?',
    answer:
      'Po, për paketat me vlerë mbi 1,000 USD ofrojmë mundësinë e pagesës me këste. Në momentin e rezervimit kërkohet një parapagim prej 25%, i cili nuk kthehet, për të siguruar vendin tuaj. Pjesa e mbetur duhet të shlyhet plotësisht jo më vonë se 30 ditë përpara datës së nisjes. Nëse pagesa nuk përfundon brenda afatit, rezervimi mund të anulohet pa rimbursim të parapagimit.',
  },
  {
    category: 'Anulime dhe rimbursime',
    question: 'Cila është politika juaj e anulimit?',
    answer:
      'Kushtet e anulimit ndryshojnë sipas paketës dhe përshkruhen në termat specifikë të secilës ofertë. Si rregull i përgjithshëm: anulimet e bëra më shumë se 60 ditë para nisjes kanë të drejtë për rimbursim të plotë, minus një tarifë administrative prej 10%; anulimet e bëra ndërmjet 30 dhe 60 ditëve para nisjes përfitojnë 50% rimbursim; ndërsa anulimet brenda 30 ditëve nga nisja nuk rimbursohen. Disa oferta promocionale dhe paketat e minutës së fundit mund të kenë kushte më të rrepta, të cilat bëhen të ditura në momentin e rezervimit.',
  },
  {
    category: 'Anulime dhe rimbursime',
    question: 'Çfarë ndodh nëse Univers Travel Agency anulon udhëtimin tim?',
    answer:
      'Në rastin e rrallë kur Univers Travel Agency detyrohet të anulojë një udhëtim për arsye që varen nga ne, ju do t’ju ofrohet ose rimbursimi i plotë i shumës së paguar, ose mundësia për ta transferuar rezervimin në një datë tjetër ose në një paketë alternative me vlerë të barabartë. Ne do t’ju njoftojmë sa më herët të jetë e mundur dhe do të bëjmë çmos për të minimizuar çdo shqetësim. Për anulimet e shkaktuara nga rrethana të jashtëzakonshme, si fatkeqësi natyrore, pandemi ose kufizime qeveritare të udhëtimit, zbatohet politika jonë për forcat madhore dhe do t’ju ofrohen kredite udhëtimi të vlefshme për 24 muaj.',
  },
  {
    category: 'Anulime dhe rimbursime',
    question: 'Sa kohë duhet për të përpunuar një rimbursim?',
    answer:
      'Rimbursimet e miratuara përpunohen brenda 7 deri në 14 ditëve të punës nga momenti kur anulimi konfirmohet me shkrim. Rimbursimi kryhet në të njëjtën metodë pagese që është përdorur fillimisht. Në varësi të bankës ose institucionit financiar, mund të nevojiten edhe 3 deri në 5 ditë pune shtesë që shuma të shfaqet në llogarinë tuaj. Univers Travel Agency nuk mban përgjegjësi për vonesa të shkaktuara nga institucione të treta financiare.',
  },
  {
    category: 'Dokumente udhëtimi dhe viza',
    question: 'A më duhet vizë për destinacionin tim?',
    answer:
      'Kërkesat për vizë varen nga shtetësia juaj dhe nga vendi ku do të udhëtoni. Është përgjegjësi ekskluzive e udhëtarit të sigurohet që disponon të gjitha vizat, lejet dhe dokumentet e vlefshme të udhëtimit përpara nisjes. Univers Travel Agency ofron informacion të përgjithshëm mbi destinacionet vetëm si ndihmë orientuese dhe jo si këshillim ligjor apo emigracioni. Ju rekomandojmë fuqimisht të konsultoheni me ambasadën ose konsullatën zyrtare të vendit të destinacionit dhe të verifikoni kërkesat e hyrjes në kohë të mjaftueshme.',
  },
  {
    category: 'Dokumente udhëtimi dhe viza',
    question: 'Cilat dokumente duhet të kem me vete gjatë udhëtimit?',
    answer:
      'Të gjithë udhëtarët duhet të kenë një pasaportë të vlefshme, me të paktën gjashtë muaj vlefshmëri pas datës së planifikuar të kthimit. Në varësi të destinacionit, mund të kërkohen edhe dokumente shtesë, si vizë, konfirmim i fluturimit të kthimit, dëshmi akomodimi, dokumentacion i siguracionit të udhëtimit, certifikata vaksinimi dhe formularë hyrjeje. Univers Travel Agency do t’ju dërgojë një listë paraprake të personalizuar sipas rezervimit tuaj.',
  },
  {
    category: 'Siguracioni i udhëtimit',
    question: 'A përfshihet siguracioni i udhëtimit në paketë?',
    answer:
      'Siguracioni i udhëtimit nuk përfshihet automatikisht në paketat standarde. Megjithatë, ne këshillojmë fort që çdo udhëtar të pajiset me një siguracion të plotë, i cili mbulon urgjencat mjekësore, anulimin e udhëtimit, humbjen e bagazheve dhe përgjegjësinë personale. Univers Travel Agency bashkëpunon me ofrues të licencuar siguracionesh dhe mund t’ju ndihmojë në përzgjedhjen e policës gjatë rezervimit. Udhëtimi pa siguracion të përshtatshëm mbetet në përgjegjësinë e vetë udhëtarit.',
  },
  {
    category: 'Siguracioni i udhëtimit',
    question: 'Çfarë mbulon zakonisht siguracioni i udhëtimit?',
    answer:
      'Një policë e plotë siguracioni zakonisht mbulon shpenzimet mjekësore emergjente dhe hospitalizimin, evakuimin mjekësor dhe riatdhesimin, anulimin ose ndërprerjen e udhëtimit për arsye të mbuluara, humbjen, vjedhjen ose dëmtimin e bagazheve dhe sendeve personale, kompensimin për vonesa fluturimesh, aksidentet personale dhe përgjegjësinë civile. Kushtet ndryshojnë sipas ofruesit, ndaj ju rekomandojmë të lexoni me kujdes dokumentacionin përkatës përpara blerjes.',
  },
  {
    category: 'Itinerari dhe paketat',
    question: 'A mund ta personalizoj një paketë udhëtimi?',
    answer:
      'Po. Univers Travel Agency ofron planifikim të personalizuar për udhëtarët që kërkojnë një eksperiencë sipas preferencave të tyre. Mund të kërkoni zgjatje të qëndrimit, kategori alternative akomodimi, transferta private, ekskursione shtesë apo rregullime të veçanta ushqimore. Këto kërkesa varen nga disponueshmëria dhe mund të kenë kosto shtesë. Ju lutemi t’i paraqisni kërkesat për personalizim të paktën 21 ditë përpara nisjes.',
  },
  {
    category: 'Itinerari dhe paketat',
    question: 'Çfarë përfshihet zakonisht në një paketë standarde udhëtimi?',
    answer:
      'Paketat standarde zakonisht përfshijnë biletën vajtje-ardhje në klasë ekonomike nga qyteti i nisjes i përcaktuar, transfertat aeroportuale në destinacion, akomodimin sipas përshkrimit të paketës, mëngjesin e përditshëm nëse nuk specifikohet ndryshe, turet dhe aktivitetet e listuara në itinerar, si edhe shërbimin e një guida lokale të dedikuar. Elementet që nuk përfshihen paraqiten qartë në seksionin “Nuk përfshihet” në secilën paketë.',
  },
  {
    category: 'Shëndeti dhe siguria',
    question: 'A ka kërkesa shëndetësore për disa destinacione?',
    answer:
      'Po, disa destinacione mund të kërkojnë dëshmi vaksinimi për sëmundje të caktuara, si për shembull ethet e verdha ose COVID-19. Gjithashtu, disa rajone mund të jenë subjekt i njoftimeve shëndetësore, ndaj udhëtarët këshillohen të konsultohen me mjekun e familjes ose një specialist të mjekësisë së udhëtimit të paktën 6 deri në 8 javë përpara nisjes. Univers Travel Agency monitoron njoftimet shëndetësore për destinacionet dhe do t’ju informojë për çdo ndryshim të rëndësishëm që mund të ndikojë rezervimin tuaj.',
  },
  {
    category: 'Shëndeti dhe siguria',
    question: 'Çfarë duhet të bëj në rast emergjence gjatë udhëtimit?',
    answer:
      'Në rast emergjence, kontaktoni menjëherë shërbimet lokale të emergjencës, si policinë, ambulancën ose zjarrfikësen, duke përdorur numrat lokalë që do të gjeni në paketën tuaj të mirëseardhjes. Më pas, kontaktoni linjën e asistencës së siguracionit të udhëtimit dhe më tej linjën tonë të mbështetjes 24/7 në numrin +355 68 403 0204. Ekipi ynë është në dispozicion gjatë gjithë kohës për t’ju ndihmuar në raste urgjencash mjekësore, humbjeje dokumentesh apo situatash të tjera të rëndësishme.',
  },
  {
    category: 'Shërbimi ndaj klientit',
    question: 'Si mund të kontaktoj mbështetjen e Univers Travel Agency?',
    answer:
      'Ekipi ynë i mbështetjes është i disponueshëm nga e hëna në të premte, nga ora 09:00 deri në 18:00, në numrin +355 68 403 0204. Për çështje urgjente jashtë orarit zyrtar, linja jonë emergjente e udhëtimit është në dispozicion 24/7 në të njëjtin numër. Mund të na gjeni edhe në Instagram në @universstravel për njoftime dhe komunikim të shpejtë.',
  },
  {
    category: 'Shërbimi ndaj klientit',
    question: 'Si mund t’i shoh detajet e rezervimit tim pas konfirmimit?',
    answer:
      'Pasi të regjistroheni dhe të hyni në llogarinë tuaj në Univers Travel Agency, mund të shihni të gjitha detajet e rezervimit, itineraret, historikun e pagesave dhe komunikimet përkatëse te seksioni “Rezervimet e mia” në profilin tuaj. Nëse rezervimi është bërë si vizitor, detajet do të jenë të aksesueshme përmes linkut të konfirmimit të dërguar në email-in tuaj. Për çdo problem me llogarinë, ju lutemi të kontaktoni ekipin tonë të mbështetjes.',
  },
];

const categories = Array.from(new Set(faqs.map((f) => f.category)));

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Të gjitha');

  const filtered =
    activeCategory === 'Të gjitha'
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-red-500" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Pyetje të shpeshta</h1>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Këtu do të gjeni përgjigje për pyetjet më të zakonshme rreth
            shërbimeve tona të udhëtimit, procesit të rezervimit, politikave dhe
            informacioneve të tjera të rëndësishme.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('Të gjitha')}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeCategory === 'Të gjitha'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-red-400 hover:text-red-600'
            }`}
          >
            Të gjitha
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-red-400 hover:text-red-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((faq) => {
            const globalIndex = faqs.indexOf(faq);
            const isOpen = openIndex === globalIndex;

            return (
              <div
                key={globalIndex}
                className="bg-white shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-start gap-4"
                  onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                >
                  <div>
                    <span className="text-xs font-medium text-red-600 uppercase tracking-wide block mb-1">
                      {faq.category}
                    </span>
                    <span className="text-gray-900 font-medium text-base">
                      {faq.question}
                    </span>
                  </div>

                  <span className="flex-shrink-0 mt-1 text-gray-400">
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-red-50 border border-red-100 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Keni ende pyetje?
          </h2>

          <p className="text-gray-600 mb-4 text-sm">
            Ekipi ynë është i gatshëm t’ju ndihmojë për çdo paqartësi që nuk
            është trajtuar këtu.
          </p>

          <a
            href="tel:+355684030204"
            className="inline-block bg-red-600 text-white px-6 py-3 font-medium hover:bg-red-700 transition text-sm"
          >
            Na telefononi: +355 68 403 0204
          </a>
        </div>
      </div>
    </div>
  );
}