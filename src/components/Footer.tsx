import { useState } from 'react';
import { Phone, MapPin, Check, Instagram, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubscribing(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email: email.trim().toLowerCase() });

      if (error && error.code !== '23505') throw error;

      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Gabim gjatë abonimit në newsletter:', err);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <button onClick={() => handleNavClick('/')} className="flex items-center mb-5">
              <img src="/logo.png" alt="Univers Travel Agency Logo" className="h-14 w-auto" />
            </button>

            <p className="text-sm leading-relaxed text-gray-500">
              Agjenci udhëtimesh me shërbim të plotë, me qendër në Tiranë, Shqipëri.
              Që prej vitit 2009, ofrojmë eksperienca të kuruara udhëtimi në Ballkan,
              Mesdhe dhe destinacione të tjera përtej rajonit.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
              Lidhje të shpejta
            </h3>

            <ul className="space-y-2.5">
              {[
                { label: 'Ballina', path: '/' },
                { label: 'Paketat', path: '/packages' },
                { label: 'Destinacionet', path: '/destinations' },
                { label: 'Ofertat', path: '/offers' },
                { label: 'Rreth nesh', path: '/about' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className="text-sm text-gray-500 hover:text-white transition text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
              Eksploro
            </h3>

            <ul className="space-y-2.5">
              {[
                { label: 'Blogu i udhëtimeve', path: '/blog' },
                { label: 'Na kontaktoni', path: '/contact' },
                { label: 'Pyetje të shpeshta', path: '/faq' },
                { label: 'Kushtet dhe termat', path: '/terms' },
                { label: 'Politika e privatësisë', path: '/privacy' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className="text-sm text-gray-500 hover:text-white transition text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
              Kontakti
            </h3>

            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                <a
                  href="tel:+355684030204"
                  className="text-sm text-gray-500 hover:text-white transition"
                >
                  +355 68 403 0204
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                <a
                  href="mailto:info@universstravel.com"
                  className="text-sm text-gray-500 hover:text-white transition"
                >
                  info@universstravel.com
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                <span className="text-sm text-gray-500">Univers City, Tiranë</span>
              </li>

              <li className="flex items-center gap-2.5">
                <Instagram className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                <a
                  href="https://www.instagram.com/universstravel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-white transition"
                >
                  @universstravel
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Univers Travel Agency. Të gjitha të drejtat janë të rezervuara.
            </p>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div>
                <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-0.5">
                  Qëndroni të informuar
                </h3>
                <p className="text-xs text-gray-600">
                  Abonohuni për të marrë përditësime mbi udhëtimet, oferta ekskluzive dhe guida për destinacione të veçanta.
                </p>
              </div>

              {subscribed ? (
                <div className="flex items-center gap-2 border border-green-800 bg-green-950/50 px-4 py-2.5">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-400 font-semibold text-sm">
                    U abonuat me sukses. Ju faleminderit!
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Shkruani adresën tuaj të email-it"
                    required
                    className="w-56 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition disabled:opacity-60 uppercase tracking-wide border-l-0"
                  >
                    {subscribing ? '...' : 'Abonohu'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}