import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Politika e Privatësisë</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Ne angazhohemi për mbrojtjen e të dhënave tuaja personale dhe të
            drejtës suaj për privatësi.
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Përditësuar së fundmi: 1 mars 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm border border-gray-200 p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              1. Hyrje dhe fusha e zbatimit
            </h2>
            <p className="mb-3">
              Univers Travel Agency LLC (“Univers Travel Agency”, “ne”, “na”
              ose “joni”) angazhohet për mbrojtjen e privatësisë dhe sigurisë së
              të dhënave tuaja personale. Kjo Politikë e Privatësisë (“Politika”)
              shpjegon mënyrën se si ne mbledhim, përdorim, ndajmë, ruajmë dhe
              mbrojmë të dhënat tuaja personale kur vizitoni faqen tonë të
              internetit, krijoni një llogari, kryeni një rezervim ose
              ndërveproni ndryshe me shërbimet tona.
            </p>
            <p className="mb-3">
              Kjo Politikë zbatohet për të gjitha të dhënat personale që
              përpunohen nga Univers Travel Agency në lidhje me shërbimet që ne
              ofrojmë, përfshirë të dhënat e mbledhura online përmes faqes, me
              telefon, personalisht ose përmes korrespondencës me shkrim. Ajo
              zbatohet për të gjithë personat, të dhënat e të cilëve ne
              përpunojmë, përfshirë klientët potencialë, klientët aktualë,
              klientët e mëparshëm dhe vizitorët e faqes.
            </p>
            <p>
              Univers Travel Agency vepron si kontrollues i të dhënave dhe, në
              rrethana të caktuara, edhe si përpunues i tyre. Ne i përpunojmë të
              dhënat personale në përputhje me legjislacionin e zbatueshëm për
              mbrojtjen e të dhënave, përfshirë Rregulloren e Përgjithshme për
              Mbrojtjen e të Dhënave (GDPR), legjislacionin shqiptar në fuqi dhe
              çdo akt tjetër përkatës që mund të zbatohet sipas rastit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              2. Të dhënat personale që mbledhim
            </h2>
            <p className="mb-3">
              Ne mbledhim kategori të ndryshme të dhënash personale në varësi të
              mënyrës se si ndërveproni me shërbimet tona:
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">
              2.1 Të dhënat e identitetit dhe kontaktit
            </h3>
            <p className="mb-3">
              Këtu përfshihen emri dhe mbiemri i plotë, data e lindjes, gjinia,
              shtetësia, numri i pasaportës dhe data e skadencës, adresa e
              email-it, numri i telefonit, adresa postare dhe kontaktet e
              emergjencës. Këto të dhëna mblidhen kur krijoni një llogari,
              kryeni një rezervim ose kontaktoni ekipin tonë të mbështetjes.
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">
              2.2 Të dhënat financiare
            </h3>
            <p className="mb-3">
              Këtu përfshihen të dhënat e pagesës, adresa e faturimit dhe
              historiku i transaksioneve. Numrat e plotë të kartave të pagesës
              nuk ruhen në sistemet tona; përpunimi i pagesave kryhet
              ekskluzivisht nga ofrues të palëve të treta në përputhje me
              standardet e sigurisë PCI-DSS. Ne ruajmë të dhëna për shumën,
              datën dhe metodën e pagesës për qëllime kontabiliteti dhe
              përputhshmërie ligjore.
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">
              2.3 Të dhënat e udhëtimit dhe rezervimit
            </h3>
            <p className="mb-3">
              Këtu përfshihen historiku i rezervimeve, detajet e itinerarit,
              preferencat për akomodim, kërkesat ushqimore, nevojat për
              aksesueshmëri, kërkesat e veçanta për shërbime dhe informacioni për
              bashkëudhëtarët e përfshirë në rezervim.
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">
              2.4 Të dhënat teknike dhe të përdorimit
            </h3>
            <p className="mb-3">
              Këtu përfshihen adresa IP, lloji dhe versioni i shfletuesit,
              identifikuesit e pajisjes, sistemi operativ, zona kohore,
              vendndodhja gjeografike e përafërt, faqet e vizituara, lidhjet e
              klikuara, kohëzgjatja e sesionit, adresat referuese dhe të dhëna
              të tjera diagnostikuese të mbledhura automatikisht gjatë përdorimit
              të faqes.
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 mt-4">
              2.5 Të dhënat e komunikimit
            </h3>
            <p>
              Këtu përfshihen regjistrimet e korrespondencës suaj me ne, si
              email-et, regjistrat e thirrjeve telefonike, bisedat online dhe
              komentet ose vlerësimet që na dërgoni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              3. Si i mbledhim të dhënat personale
            </h2>
            <p className="mb-3">
              Ne i mbledhim të dhënat personale në mënyrat e mëposhtme:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-3 text-sm pl-2">
              <li>
                <span className="font-medium">Ndërveprime të drejtpërdrejta:</span>{' '}
                kur krijoni një llogari, plotësoni një formular rezervimi,
                abonoheni në komunikime promocionale, plotësoni anketa, kontaktoni
                mbështetjen tonë ose na jepni ndryshe informacion personal.
              </li>
              <li>
                <span className="font-medium">Teknologji të automatizuara:</span>{' '}
                gjatë lundrimit në faqe, ne mund të mbledhim automatikisht të
                dhëna teknike përmes cookies, web beacons, regjistrave të
                serverit dhe teknologjive të ngjashme të gjurmimit.
              </li>
              <li>
                <span className="font-medium">Palë të treta:</span> ne mund të
                marrim të dhëna për ju nga ofrues analitikë, rrjete reklamuese,
                platforma sociale, ofrues pagesash, shërbime verifikimi
                identiteti dhe partnerë të industrisë së udhëtimit.
              </li>
              <li>
                <span className="font-medium">Burime publike:</span> në raste të
                caktuara, mund të kombinojmë të dhënat personale me informacion
                publikisht të disponueshëm, kur kjo është e nevojshme dhe e
                ligjshme për ofrimin e shërbimit.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              4. Baza ligjore për përpunimin
            </h2>
            <p className="mb-3">
              Ne i përpunojmë të dhënat tuaja personale mbi bazat ligjore të
              mëposhtme:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2">
              <li>
                <span className="font-medium">Përmbushja e kontratës:</span>{' '}
                përpunimi është i nevojshëm për të përmbushur detyrimet tona
                kontraktore ndaj jush, përfshirë rezervimet, konfirmimet,
                organizimin e shërbimeve dhe menaxhimin e llogarisë suaj.
              </li>
              <li>
                <span className="font-medium">Detyrimi ligjor:</span> përpunimi
                kërkohet për të respektuar detyrimet ligjore, përfshirë kërkesat
                tatimore, kontabël, të sigurisë dhe detyrimet për ndarjen e të
                dhënave të pasagjerëve me autoritetet kur kjo kërkohet nga ligji.
              </li>
              <li>
                <span className="font-medium">Interesi legjitim:</span> ne mund
                të përpunojmë të dhëna për interesat tona të ligjshme biznesore,
                si parandalimi i mashtrimit, siguria, analizat e brendshme dhe
                përmirësimi i shërbimeve, për aq kohë sa këto interesa nuk
                cenojnë të drejtat tuaja për privatësi.
              </li>
              <li>
                <span className="font-medium">Pëlqimi:</span> kur kërkohet nga
                ligji, ne do të marrim pëlqimin tuaj të qartë për qëllime të
                caktuara, si komunikimet marketingu ose përpunimi i të dhënave të
                ndjeshme personale.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              5. Si i përdorim të dhënat tuaja personale
            </h2>
            <p className="mb-3">
              Ne i përdorim të dhënat tuaja personale për këto qëllime:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2">
              <li>Për përpunimin dhe menaxhimin e rezervimeve tuaja</li>
              <li>Për verifikimin e identitetit dhe kontrollet e sigurisë</li>
              <li>Për përpunimin e pagesave dhe menaxhimin e transaksioneve</li>
              <li>Për dërgimin e konfirmimeve, itinerareve dhe përditësimeve</li>
              <li>Për ofrimin e mbështetjes ndaj klientit</li>
              <li>Për respektimin e kërkesave ligjore dhe rregullatore</li>
              <li>
                Për ndarjen e të dhënave me linja ajrore, hotele, autoritete
                kufitare dhe partnerë të tjerë kur kjo është e nevojshme për
                realizimin e rezervimit
              </li>
              <li>
                Për analiza të brendshme që ndihmojnë në përmirësimin e faqes dhe
                shërbimeve tona
              </li>
              <li>
                Për dërgimin e komunikimeve promocionale, kur ju keni dhënë
                pëlqimin ose kur kjo lejohet nga ligji
              </li>
              <li>
                Për parandalimin e mashtrimit, pastrimit të parave dhe
                aktiviteteve të tjera të paligjshme
              </li>
              <li>
                Për zbatimin e Kushteve dhe Termave tona dhe mbrojtjen e të
                drejtave ligjore
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              6. Ndarja e të dhënave personale
            </h2>
            <p className="mb-3">
              Univers Travel Agency nuk i shet, nuk i jep me qira dhe nuk i
              transferon të dhënat tuaja personale te palë të treta për qëllimet
              e tyre të marketingut. Megjithatë, ne mund t’i ndajmë të dhënat
              tuaja me kategoritë e mëposhtme të përfituesve:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2 mb-3">
              <li>
                <span className="font-medium">Partnerë të udhëtimit:</span>{' '}
                linja ajrore, hotele, kompani transporti, operatorë turistikë
                dhe ofrues të tjerë, në masën e nevojshme për të përmbushur
                rezervimin tuaj.
              </li>
              <li>
                <span className="font-medium">Ofrues pagesash:</span> sisteme të
                sigurta pagesash dhe shërbime për parandalimin e mashtrimit.
              </li>
              <li>
                <span className="font-medium">
                  Autoritete qeveritare dhe rregullatore:
                </span>{' '}
                autoritete kufitare, doganore, ligjzbatuese ose institucione të
                tjera kur kjo kërkohet nga ligji ose me urdhër të autoriteteve
                kompetente.
              </li>
              <li>
                <span className="font-medium">Ofrues teknologjie:</span>{' '}
                ofrues të hostimit cloud, sisteme email-i, platforma CRM dhe
                shërbime analitike që përpunojnë të dhëna në emrin tonë sipas
                marrëveshjeve të duhura.
              </li>
              <li>
                <span className="font-medium">Këshilltarë profesionalë:</span>{' '}
                juristë, kontabilistë, auditorë dhe ofrues siguracionesh nën
                detyrimin e konfidencialitetit.
              </li>
              <li>
                <span className="font-medium">Transferime biznesi:</span> në
                rast bashkimi, blerjeje ose shitjeje të aseteve të kompanisë, të
                dhënat tuaja mund të transferohen te subjekti pasardhës, me të
                njëjtin nivel mbrojtjeje.
              </li>
            </ul>
            <p>
              Të gjithë përpunuesit e palëve të treta janë të detyruar të ruajnë
              konfidencialitetin dhe sigurinë e të dhënave tuaja personale dhe nuk
              lejohen t’i përdorin ato për qëllime të tjera përtej atyre të
              përcaktuara në marrëveshjet me Univers Travel Agency.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              7. Transferimet ndërkombëtare të të dhënave
            </h2>
            <p className="mb-3">
              Për shkak të natyrës ndërkombëtare të shërbimeve të udhëtimit, të
              dhënat tuaja personale mund të transferohen dhe përpunohen në vende
              jashtë Shqipërisë ose jashtë Zonës Ekonomike Europiane, ku niveli i
              mbrojtjes së të dhënave mund të jetë i ndryshëm nga ai i vendit
              tuaj.
            </p>
            <p>
              Kur kryhen transferime ndërkombëtare, Univers Travel Agency siguron
              që të ekzistojnë masa të përshtatshme mbrojtëse, si klauzola
              standarde kontraktore, vendime për përshtatshmëri ose mekanizma të
              tjerë të ligjshëm transferimi. Duke kryer një rezervim që përfshin
              udhëtim ndërkombëtar, ju pranoni që të dhënat tuaja mund të ndahen
              me subjekte në vendin e destinacionit për të realizuar shërbimet e
              rezervuara.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              8. Afatet e ruajtjes së të dhënave
            </h2>
            <p className="mb-3">
              Ne i ruajmë të dhënat personale për aq kohë sa është e nevojshme
              për të përmbushur qëllimet për të cilat janë mbledhur, për të
              respektuar detyrimet ligjore dhe rregullatore, për të zgjidhur
              mosmarrëveshje dhe për të zbatuar marrëveshjet tona.
            </p>
            <p className="mb-3">Periudhat tipike të ruajtjes përfshijnë:</p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2">
              <li>
                Të dhënat e rezervimeve dhe transaksioneve: 7 vjet nga data e
                udhëtimit
              </li>
              <li>
                Të dhënat e llogarisë së klientit: gjatë kohës që llogaria është
                aktive dhe deri në 3 vjet pas mbylljes së saj
              </li>
              <li>
                Preferencat e marketingut dhe regjistrat e pëlqimit: për aq kohë
                sa pëlqimi mbetet aktiv dhe deri në 3 vjet më pas
              </li>
              <li>
                Të dhënat analitike dhe të përdorimit të faqes: deri në 26 muaj
                nga data e mbledhjes
              </li>
              <li>
                Komunikimet me shërbimin ndaj klientit: deri në 3 vjet nga
                ndërveprimi i fundit
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              9. Cookies dhe teknologjitë e gjurmimit
            </h2>
            <p className="mb-3">
              Faqja përdor cookies dhe teknologji të ngjashme gjurmimi për të
              përmirësuar eksperiencën tuaj, për të analizuar trafikun dhe për të
              ofruar përmbajtje të përshtatshme. Cookies janë skedarë të vegjël
              teksti që vendosen në pajisjen tuaj nga shfletuesi kur vizitoni
              faqen.
            </p>
            <p className="mb-3">Ne përdorim kategoritë e mëposhtme të cookies:</p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2 mb-3">
              <li>
                <span className="font-medium">Cookies të domosdoshme:</span>{' '}
                të nevojshme për funksionimin e faqes, si menaxhimi i sesionit,
                autentikimi dhe siguria.
              </li>
              <li>
                <span className="font-medium">Cookies analitike:</span>{' '}
                mbledhin informacion të anonimizuar mbi mënyrën se si përdoret
                faqja, për të na ndihmuar ta përmirësojmë.
              </li>
              <li>
                <span className="font-medium">Cookies funksionale:</span>{' '}
                ruajnë preferencat dhe cilësimet tuaja për një eksperiencë më të
                personalizuar.
              </li>
              <li>
                <span className="font-medium">Cookies marketingu:</span>{' '}
                përdoren për të ndjekur aktivitetin tuaj online dhe për të
                shfaqur reklama më të përshtatshme në platforma të treta, vetëm
                me pëlqimin tuaj.
              </li>
            </ul>
            <p>
              Ju mund t’i menaxhoni preferencat për cookies përmes cilësimeve të
              shfletuesit tuaj ose mjeteve tona të menaxhimit të cookies. Çaktivizimi
              i disa cookies mund të ndikojë në funksionalitetin e faqes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              10. Të drejtat tuaja për privatësinë
            </h2>
            <p className="mb-3">
              Në varësi të ligjit të zbatueshëm, ju mund të keni këto të drejta
              në lidhje me të dhënat tuaja personale:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2 mb-3">
              <li>
                <span className="font-medium">E drejta e aksesit:</span> të
                kërkoni një kopje të të dhënave që mbajmë për ju.
              </li>
              <li>
                <span className="font-medium">E drejta e korrigjimit:</span> të
                kërkoni korrigjimin e të dhënave të pasakta ose të paplota.
              </li>
              <li>
                <span className="font-medium">E drejta e fshirjes:</span> të
                kërkoni fshirjen e të dhënave, kur kjo lejohet nga ligji dhe nuk
                bie ndesh me detyrimet tona ligjore të ruajtjes.
              </li>
              <li>
                <span className="font-medium">E drejta e kufizimit:</span> të
                kërkoni kufizimin e përpunimit në rrethana të caktuara.
              </li>
              <li>
                <span className="font-medium">E drejta e portabilitetit:</span>{' '}
                të merrni të dhënat tuaja në një format të strukturuar dhe të
                lexueshëm elektronikisht.
              </li>
              <li>
                <span className="font-medium">E drejta e kundërshtimit:</span>{' '}
                të kundërshtoni përpunimin për marketing të drejtpërdrejtë ose në
                raste kur përpunimi bazohet në interes të ligjshëm.
              </li>
              <li>
                <span className="font-medium">E drejta për të tërhequr pëlqimin:</span>{' '}
                kur përpunimi bazohet në pëlqimin tuaj, ju mund ta tërhiqni atë
                në çdo kohë.
              </li>
            </ul>
            <p>
              Për të ushtruar ndonjërën prej këtyre të drejtave, ju lutemi të na
              kontaktoni në numrin +355 68 403 0204 ose në adresën tonë zyrtare
              të email-it. Ne do t’i përgjigjemi kërkesës suaj brenda afateve të
              parashikuara nga ligji. Përpara përpunimit të kërkesës, mund të
              kërkohet verifikimi i identitetit tuaj.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              11. Siguria e të dhënave
            </h2>
            <p className="mb-3">
              Univers Travel Agency zbaton masa të përshtatshme teknike dhe
              organizative për të mbrojtur të dhënat tuaja personale nga aksesi i
              paautorizuar, humbja aksidentale, shkatërrimi, ndryshimi ose
              zbulimi i paautorizuar. Këto masa përfshijnë, ndër të tjera,
              enkriptimin e të dhënave në transmetim, kontrolle aksesi, masa
              autentikimi, monitorim të sistemeve dhe trajnime për stafin mbi
              mbrojtjen e të dhënave.
            </p>
            <p>
              Megjithatë, asnjë transmetim i të dhënave në internet dhe asnjë
              sistem ruajtjeje elektronike nuk mund të garantohet si plotësisht
              i sigurt. Në rast të një shkeljeje të sigurisë që paraqet rrezik të
              lartë për të drejtat dhe liritë tuaja, ne do t’ju njoftojmë ju dhe
              autoritetet përkatëse, sipas kërkesave të ligjit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              12. Privatësia e të miturve
            </h2>
            <p className="mb-3">
              Faqja dhe shërbimet tona nuk janë të destinuara për fëmijë nën
              moshën 16 vjeç. Univers Travel Agency nuk mbledh me vetëdije të
              dhëna personale nga persona nën këtë moshë pa pëlqimin e
              verifikueshëm të prindit ose kujdestarit ligjor.
            </p>
            <p>
              Të dhënat personale të të miturve të përfshirë në rezervime
              familjare ose në grup përpunohen vetëm për qëllimin e realizimit të
              shërbimeve të udhëtimit dhe trajtohen me kujdes të shtuar. Nëse
              besoni se kemi mbledhur pa dashje të dhëna personale të një të
              mituri pa pëlqimin e nevojshëm, ju lutemi na kontaktoni menjëherë
              dhe ne do të marrim masa për fshirjen e tyre.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              13. Komunikimet e marketingut
            </h2>
            <p className="mb-3">
              Me pëlqimin tuaj, Univers Travel Agency mund t’ju dërgojë
              komunikime marketingu mbi produktet, shërbimet, ofertat dhe
              frymëzime të lidhura me udhëtimet. Ju mund të zgjidhni t’i merrni
              këto komunikime gjatë regjistrimit ose në çdo moment përmes
              cilësimeve të llogarisë suaj.
            </p>
            <p>
              Ju mund të çabonoheni nga komunikimet promocionale në çdo kohë,
              duke përditësuar preferencat në llogarinë tuaj ose duke na
              kontaktuar. Çabonimi nga marketingu nuk ndikon në komunikimet
              transaksionale të lidhura me rezervimet tuaja, të cilat janë të
              nevojshme për ofrimin e shërbimit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              14. Vendimmarrja e automatizuar dhe profilizimi
            </h2>
            <p className="mb-3">
              Univers Travel Agency nuk merr vendime që prodhojnë pasoja ligjore
              ose efekte të rëndësishme për individët vetëm mbi bazën e
              përpunimit të automatizuar, përfshirë profilizimin. Kur përdoren
              mjete të automatizuara për të ndihmuar në ofrimin e shërbimit, si
              rekomandimet e personalizuara ose çmimet dinamike, ruhet gjithmonë
              mundësia e rishikimit njerëzor për vendimet me ndikim të rëndësishëm.
            </p>
            <p>
              Ju keni të drejtë të kërkoni rishikim njerëzor për çdo vendim të
              automatizuar që ndikon në mënyrë të konsiderueshme tek ju. Për këtë
              qëllim, mund të na kontaktoni duke përdorur të dhënat e kontaktit
              të përfshira në këtë Politikë.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              15. Të dhënat personale të ndjeshme
            </h2>
            <p className="mb-3">
              Disa kategori të të dhënave personale konsiderohen të ndjeshme sipas
              legjislacionit për mbrojtjen e të dhënave dhe kërkojnë standard më
              të lartë mbrojtjeje. Këtu mund të përfshihen të dhëna mbi gjendjen
              shëndetësore, kufizimet ushqimore që lidhen me bindje fetare ose
              nevoja për aksesueshmëri.
            </p>
            <p className="mb-3">
              Univers Travel Agency mbledh dhe përpunon të dhëna të ndjeshme
              vetëm kur kjo është rreptësisht e nevojshme për realizimin e
              shërbimeve të rezervuara dhe, kur kërkohet, me pëlqimin tuaj të
              qartë. Për shembull, kërkesat ushqimore ose nevojat e veçanta
              mund të ndahen me hotelet, linjat ajrore ose ofrues të tjerë vetëm
              për të garantuar shërbimin e duhur.
            </p>
            <p>
              Të dhënat e ndjeshme i nënshtrohen kontrolleve shtesë të aksesit
              dhe nuk ruhen më gjatë sesa është e nevojshme për qëllimin për të
              cilin janë mbledhur. Ato nuk përdoren për profilizim, marketing ose
              për qëllime të tjera përtej ofrimit të drejtpërdrejtë të
              shërbimit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              16. Faqe të palëve të treta dhe lidhje të jashtme
            </h2>
            <p className="mb-3">
              Faqja mund të përmbajë lidhje drejt faqeve të palëve të treta,
              përfshirë partnerë të udhëtimit, organizata bashkëpunuese dhe burime
              informative. Këto lidhje ofrohen vetëm për lehtësi dhe nuk
              përbëjnë miratim të përmbajtjes ose praktikave të tyre.
            </p>
            <p>
              Univers Travel Agency nuk ka kontroll mbi praktikat e privatësisë
              ose përmbajtjen e faqeve të palëve të treta dhe nuk mban
              përgjegjësi për mënyrën se si ato trajtojnë të dhënat tuaja. Ju
              inkurajojmë të lexoni politikat e privatësisë të çdo faqeje që
              vizitoni. Kjo Politikë zbatohet vetëm për të dhënat e mbledhura nga
              Univers Travel Agency në lidhje me faqen dhe shërbimet tona.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              17. Passenger Name Records (PNR) dhe zbulimi ndaj autoriteteve
            </h2>
            <p className="mb-3">
              Kur rezervoni udhëtime ndërkombëtare, Univers Travel Agency mund të
              jetë e detyruar ligjërisht, në rrethana të caktuara, të dërgojë të
              dhënat PNR (Passenger Name Record) tek autoritetet shtetërore,
              përfshirë autoritetet kufitare, doganore dhe të sigurisë, si në
              vendin e nisjes ashtu edhe në vendin e destinacionit.
            </p>
            <p className="mb-3">
              Të dhënat PNR zakonisht përfshijnë emrin tuaj, të dhënat e
              kontaktit, itinerarin, referencën e rezervimit, informacion mbi
              metodën e pagesës pa përfshirë numrin e plotë të kartës, detajet e
              agjentit të udhëtimit, vendin në avion dhe informacionin mbi
              bagazhet.
            </p>
            <p>
              Ky zbulim nuk është opsional kur kërkohet nga ligji ose marrëveshjet
              ndërkombëtare. Duke kryer një rezervim që përfshin udhëtim
              ndërkombëtar, ju pranoni që të dhënat e nevojshme mund të ndahen me
              autoritetet kompetente vetëm në masën e kërkuar nga ligji.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              18. Përgjegjësi për mbrojtjen e të dhënave
            </h2>
            <p className="mb-3">
              Univers Travel Agency ka caktuar një person përgjegjës për
              mbrojtjen e të dhënave, i cili mbikëqyr respektimin e kësaj
              Politike dhe të legjislacionit përkatës për mbrojtjen e të dhënave.
              Ky është personi kryesor i kontaktit për individët që dëshirojnë të
              ushtrojnë të drejtat e tyre ose të paraqesin shqetësime lidhur me
              praktikat tona të përpunimit.
            </p>
            <div className="bg-gray-50 p-5 text-sm space-y-1">
              <p>
                <span className="font-medium text-gray-900">
                  Përgjegjësi për Mbrojtjen e të Dhënave
                </span>
              </p>
              <p>Univers Travel Agency</p>
              <p>Univers City, Tiranë, Shqipëri</p>
              <p className="pt-2">Telefon: +355 68 403 0204</p>
              <p>Email: info@universstravel.com</p>
              <p>Koha e përgjigjes: brenda 5 ditëve të punës nga marrja</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              19. Ankesat pranë autoritetit mbikëqyrës
            </h2>
            <p className="mb-3">
              Nëse ndodheni në Zonën Ekonomike Europiane ose në Shqipëri dhe
              besoni se përpunimi i të dhënave tuaja personale nga ana jonë shkel
              ligjin e zbatueshëm për mbrojtjen e të dhënave, ju keni të drejtë
              të paraqisni ankesë pranë autoritetit mbikëqyrës kompetent.
            </p>
            <div className="bg-gray-50 p-5 text-sm space-y-1 mb-4">
              <p>
                <span className="font-medium text-gray-900">
                  Komisioneri për të Drejtën e Informimit dhe Mbrojtjen e të
                  Dhënave Personale
                </span>
              </p>
              <p>Blv. “Zhan D’Ark”, Nr. 10, Tiranë, Shqipëri</p>
              <p>Faqja zyrtare: idp.al</p>
              <p>Telefon: +355 4 227 8560</p>
            </div>
            <p>
              Ju gjithashtu mund të paraqisni ankesë pranë autoritetit kompetent
              të vendit ku banoni, punoni ose ku pretendoni se ka ndodhur
              shkelja. Megjithatë, ne ju inkurajojmë që fillimisht të na
              kontaktoni drejtpërdrejt, në mënyrë që të kemi mundësinë të
              trajtojmë shqetësimin tuaj.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              20. Ndryshimet në këtë politikë
            </h2>
            <p>
              Univers Travel Agency rezervon të drejtën ta përditësojë ose
              ndryshojë këtë Politikë Privatësie në çdo kohë, për të reflektuar
              ndryshime në praktikat tona të përpunimit, kërkesat ligjore ose
              operacionet e biznesit. Ndryshimet thelbësore do të komunikohen
              përmes publikimit të versionit të përditësuar në faqe me datën e
              re të përditësimit dhe, kur është e përshtatshme, përmes njoftimit
              me email për përdoruesit e regjistruar. Përdorimi i vazhdueshëm i
              faqes pas publikimit të ndryshimeve nënkupton pranimin e politikës
              së përditësuar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              21. Kontaktet dhe ankesat
            </h2>
            <p className="mb-3">
              Për çdo pyetje, shqetësim ose kërkesë në lidhje me këtë Politikë të
              Privatësisë ose mënyrën se si ne përpunojmë të dhënat personale,
              ju lutemi na kontaktoni në:
            </p>
            <div className="bg-gray-50 p-5 text-sm space-y-1 mb-4">
              <p>
                <span className="font-medium text-gray-900">
                  Univers Travel Agency
                </span>
              </p>
              <p>Univers City, Tiranë</p>
              <p>Shqipëri</p>
              <p className="pt-2">Telefon: +355 68 403 0204</p>
              <p>Email: info@universstravel.com</p>
              <p>Instagram: @universstravel</p>
            </div>
            <p>
              Nëse mendoni se të drejtat tuaja për privatësi janë shkelur dhe
              ankesa juaj nuk është trajtuar në mënyrë të kënaqshme nga Univers
              Travel Agency, ju keni të drejtë t’i drejtoheni autoritetit
              mbikëqyrës kompetent për mbrojtjen e të dhënave në juridiksionin
              tuaj.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}