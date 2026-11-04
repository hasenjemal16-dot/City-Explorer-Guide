import { useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowRight, Bus, ChevronDown, Clock3, Menu, TrainFront, X } from 'lucide-react';

const addisHero = '/addis-hero.png';

const photoSources = {
  kitfo: {
    src: '/images/kitfo-user.png',
    alt: 'Kitfo in a bowl at the center of an Ethiopian platter with injera and side dishes',
    creator: 'Image provided by you',
  },
  injera: {
    src: '/images/injera-platter.jpg',
    alt: 'An Ethiopian fasting platter of injera and vegetable dishes',
    creator: 'Jbinthecity',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Ethiopian_fasting_platter.jpg',
  },
  coffee: {
    src: '/images/coffee-ceremony.jpg',
    alt: 'A traditional Ethiopian coffee set arranged on a woven basket',
    creator: 'ProtoplasmaKid',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Coffee_ceremony_of_Ethiopia_and_Eritrea_4.jpg',
  },
  merkato: {
    src: '/images/merkato.jpg',
    alt: 'A busy market street in Merkato, Addis Ababa',
    creator: 'Diego Delso',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Addis_Mercato,_Ad%C3%ADs_Abeba,_Etiop%C3%ADa,_2024-01-19,_DD_28.jpg',
  },
  museum: {
    src: '/images/national-museum.jpg',
    alt: 'The National Museum of Ethiopia in Addis Ababa',
    creator: 'Richard van Alphen',
    license: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:National_museum_of_Ethiopia_New_facility.JPG',
  },
  cathedral: {
    src: '/images/holy-trinity.jpg',
    alt: 'Holy Trinity Cathedral in Addis Ababa',
    creator: 'A. Davey',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Holy_Trinity_Cathedral,_Addis_Ababa_(3434312871).jpg',
  },
  entoto: {
    src: '/images/entoto.jpg',
    alt: 'A view over Addis Ababa from the green slopes of Entoto',
    creator: 'Ninaras',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Addis_Ababa_from_Entoto_Mountains.jpg',
  },
  piazza: {
    src: '/images/piazza.jpg',
    alt: 'A street scene in Addis Ababa’s Piazza district',
    creator: 'Adam Jones',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Street_Scene_-_Piazza_District_-_Addis_Ababa_-_Ethiopia_(8659539441).jpg',
  },
  bole: {
    src: '/images/bole.jpg',
    alt: 'A modern street in the Bole area of Addis Ababa',
    creator: 'AtsiG',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Ethiopia,addis_ababa_bole_street.jpg',
  },
};

type PhotoFigureProps = {
  src: string;
  alt: string;
  creator: string;
  license?: string;
  licenseUrl?: string;
  source?: string;
  className?: string;
};

function PhotoFigure({ src, alt, creator, license, licenseUrl, source, className = '' }: PhotoFigureProps) {
  return (
    <figure className={`photo-figure ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      <figcaption className="photo-credit">
        {source ? <a href={source} target="_blank" rel="noreferrer">{creator}</a> : creator}
        {license && (
          <>
            {' · '}
            {licenseUrl ? <a href={licenseUrl} target="_blank" rel="noreferrer">{license}</a> : license}
          </>
        )}
      </figcaption>
    </figure>
  );
}

const navItems = [
  { label: 'Start here', href: '#essentials' },
  { label: 'Eat & drink', href: '#eat' },
  { label: 'Living culture', href: '#culture' },
  { label: 'Getting around', href: '#getting-around' },
  { label: 'Tips', href: '#tips' },
];

const landmarks = [
  {
    number: '01',
    name: 'National Museum of Ethiopia',
    neighborhood: 'ARAT KILO · CENTRAL ADDIS',
    note: 'A thoughtful first stop for Ethiopia’s deep and varied histories. The museum is known for the hominin fossil Lucy; check current exhibitions and visitor information before you go.',
    best: 'Give the galleries unhurried time',
    photo: photoSources.museum,
  },
  {
    number: '02',
    name: 'Holy Trinity Cathedral',
    neighborhood: 'ARAT KILO · CENTRAL ADDIS',
    note: 'A significant Ethiopian Orthodox Tewahedo site and a place of worship, remembrance, and history. Dress respectfully, follow on-site guidance, and ask before taking photographs.',
    best: 'Visit with care and curiosity',
    photo: photoSources.cathedral,
  },
  {
    number: '03',
    name: 'Entoto hills',
    neighborhood: 'NORTH OF THE CITY · HIGHLAND EDGE',
    note: 'A higher, greener perspective over Addis and a way to feel the city’s highland setting. Conditions and access can vary; check locally and take the climb at your own pace.',
    best: 'Leave time to acclimate',
    photo: photoSources.entoto,
  },
];

const destinationCards = [
  {
    label: 'HISTORY · ARAT KILO',
    name: 'National Museum of Ethiopia',
    href: '#landmark-01',
    photo: photoSources.museum,
  },
  {
    label: 'LIVING HERITAGE · ARAT KILO',
    name: 'Holy Trinity Cathedral',
    href: '#landmark-02',
    photo: photoSources.cathedral,
  },
  {
    label: 'HIGHLAND EDGE · NORTH OF THE CITY',
    name: 'Entoto hills',
    href: '#landmark-03',
    photo: photoSources.entoto,
  },
];

const itinerary = {
  '2 days': {
    title: 'A first taste',
    detail: 'Start with one museum or historic site, then let a long meal and a coffee ceremony set the rhythm. Keep the second day open for a neighborhood walk and a view toward the highlands.',
    route: ['Central Addis', 'A long lunch', 'Coffee & a walk'],
  },
  '3 days': {
    title: 'Room to breathe',
    detail: 'Pair a day of city history with time in a neighborhood, then choose one outing toward the hills. Plan fewer stops than the map suggests; altitude and traffic both invite a slower pace.',
    route: ['Museums & memory', 'Neighborhood table', 'Entoto or a return'],
  },
  '5 days': {
    title: 'A slower rhythm',
    detail: 'Spread out the landmarks. Leave space for a market or gallery visit, a meal you can linger over, and conversations that lead somewhere unexpected. Confirm all practical details close to travel.',
    route: ['Central Addis', 'Markets & makers', 'Coffee, hills, repeat'],
  },
};

type ItineraryLength = keyof typeof itinerary;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<ItineraryLength>('3 days');
  const [visitorResponse, setVisitorResponse] = useState(() => {
    try {
      return window.sessionStorage.getItem('addis-visitor-response') ?? '';
    } catch {
      return '';
    }
  });
  const [visitorResponseStatus, setVisitorResponseStatus] = useState('');
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="guide">
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="Addis, with curiosity — home" onClick={closeMenu}>
          <span className="wordmark-stamp" aria-hidden="true">A</span>
          <span>ADDIS, <i>with</i> curiosity</span>
        </a>
        <nav id="main-navigation" className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link" onClick={closeMenu}>{item.label}</a>
          ))}
          <a href="#plan" className="nav-plan" onClick={closeMenu}>Shape your days <ArrowRight size={14} /></a>
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          data-testid="button-menu-toggle"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <section className="hero grain" id="top" aria-labelledby="hero-title">
        <img className="hero-image" src={addisHero} alt="First light over Addis Ababa, with the Ethiopian highlands beyond the city" />
        <div className="hero-wash" />
        <div className="hero-content">
          <p className="eyebrow hero-kicker reveal">A field guide for your first time</p>
          <h1 id="hero-title" className="serif reveal reveal-delay-1">Addis asks you<br />to <em>stay curious.</em></h1>
          <p className="hero-deck reveal reveal-delay-2">A first visit shaped by highland air, generous tables, layered histories, and the everyday life between the landmarks.</p>
          <a href="#essentials" className="hero-cta reveal reveal-delay-2">
            <span>Begin with the essentials</span><span className="round-arrow"><ArrowDown size={17} /></span>
          </a>
        </div>
        <div className="hero-aside"><span className="vertical-text">A GOOD PLACE TO BEGIN · 9°01′N 38°45′E</span></div>
        <div className="hero-caption"><span>ADDIS ABABA · LIGHT OVER THE HIGHLANDS</span><span>01 / ETHIOPIA</span></div>
      </section>

      <section className="destination-preview" aria-labelledby="destination-preview-title">
        <div className="destination-preview-heading">
          <div>
            <span className="eyebrow">A FEW GOOD PLACES TO BEGIN</span>
            <h2 id="destination-preview-title" className="serif">Meet the city<br /><em>one place at a time.</em></h2>
          </div>
          <a className="text-link" href="#landmarks">Explore all three landmarks <ArrowDownRight size={16} /></a>
        </div>
        <div className="destination-card-grid">
          {destinationCards.map((place, index) => (
            <article className="destination-card" key={place.href}>
              <PhotoFigure {...place.photo} className="destination-card-photo" />
              <div className="destination-card-copy">
                <span className="eyebrow">{place.label}</span>
                <a href={place.href} className="destination-card-link" data-testid={`link-landmark-preview-${String(index + 1).padStart(2, '0')}`}>
                  <h3 className="serif">{place.name}</h3>
                  <ArrowDownRight size={17} aria-hidden="true" />
                </a>
              </div>
              <span className="destination-card-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="intro-section" id="essentials">
        <div className="section-marker"><span className="eyebrow">01 — FIND YOUR BEARINGS</span><span className="marker-line" /></div>
        <div className="intro-grid">
          <h2 className="serif">Not a checklist.<br /><em>A way in.</em></h2>
          <div className="intro-copy">
            <p className="intro-lead">Addis Ababa is a capital with many tempos: a place to listen, look closely, and let a meal take the time it takes.</p>
            <p>Begin with a few landmarks, but leave room for conversation, coffee, and the city’s changing streetscape. Ethiopia is vast and diverse; this guide starts in Addis without pretending one city can stand for the whole country.</p>
            <a className="text-link" href="#plan">A note on planning well <ArrowDownRight size={16} /></a>
          </div>
        </div>
        <div className="intro-foot">
          <div><span className="stat-number serif">2,355 m</span><span className="stat-label">approximate elevation of Addis Ababa</span></div>
          <p>At high elevation, take time to acclimate, hydrate, and adjust your pace—especially on your first days.</p>
          <span className="kanji-seal" aria-hidden="true">AA</span>
        </div>
      </section>

      <section className="landmark-section" id="landmarks">
        <div className="section-heading">
          <div><span className="eyebrow">02 — LANDMARKS, WITH CONTEXT</span><h2 className="serif">Start here.<br /><em>Then wander.</em></h2></div>
          <p>These places open useful doors into the city’s histories and geography. Check current access details, then let the visit lead into a slower day.</p>
        </div>
        <div className="landmark-list">
          {landmarks.map((place) => (
            <article className="landmark-row" id={`landmark-${place.number}`} key={place.number} data-testid={`card-landmark-${place.number}`}>
              <span className="landmark-number eyebrow">{place.number}</span>
              <PhotoFigure {...place.photo} className="landmark-photo" />
              <div className="landmark-copy">
                <p className="eyebrow">{place.neighborhood}</p>
                <h3 className="serif">{place.name}</h3>
                <p>{place.note}</p>
                <span className="best-time"><Clock3 size={14} /> {place.best}</span>
              </div>
              <a className="landmark-arrow" href="#plan" aria-label={`Plan a visit to ${place.name}`}><ArrowDownRight size={20} /></a>
            </article>
          ))}
        </div>
        <p className="small-note">Museums, memorials, and sacred sites carry living meaning. Follow posted guidance, dress with care where requested, and ask before photographing people.</p>
      </section>

      <section className="neighborhood-section" aria-labelledby="neighborhood-title">
        <div className="neighborhood-head">
          <div><span className="eyebrow">03 — THE CITY BETWEEN SIGHTS</span><h2 id="neighborhood-title" className="serif">Pick a corner.<br /><em>Let the day happen.</em></h2></div>
          <p>Rather than cross the city for every stop, choose a pocket of Addis and notice what unfolds there.</p>
        </div>
        <div className="neighborhood-grid">
          <article className="neighborhood-card neighborhood-large">
            <PhotoFigure {...photoSources.piazza} className="neighborhood-photo neighborhood-photo-large" />
            <div className="neighborhood-meta"><span className="eyebrow">PIAZZA · CITY HISTORY & CAFÉS</span><span className="mono">CENTRAL</span></div>
            <h3 className="serif">Piazza</h3>
            <p>Walk the busy central streets, look for older façades among newer ones, and find a café for a pause. Let the city’s mix of eras speak for itself.</p>
          </article>
          <article className="neighborhood-card">
            <PhotoFigure {...photoSources.merkato} className="neighborhood-photo" />
            <div className="neighborhood-meta"><span className="eyebrow">MERKATO · COMMERCE & CRAFT</span><span className="mono">WEST</span></div>
            <h3 className="serif">Merkato</h3>
            <p>A vast, energetic trading district. Go with a local guide if that would help you navigate; ask before taking photographs and keep valuables secure.</p>
          </article>
          <article className="neighborhood-card">
            <PhotoFigure {...photoSources.bole} className="neighborhood-photo" />
            <div className="neighborhood-meta"><span className="eyebrow">BOLE · NEWER CITY & MEETING PLACES</span><span className="mono">SOUTH-EAST</span></div>
            <h3 className="serif">Bole</h3>
            <p>A modern, fast-changing part of town with restaurants, shops, and places to meet. Pick one destination and allow extra time for the journey.</p>
          </article>
        </div>
      </section>

      <section className="food-section" id="eat">
        <div className="food-intro">
          <span className="eyebrow">04 — COME HUNGRY, STAY AWHILE</span>
          <h2 className="serif">The table is<br /><em>part of the story.</em></h2>
          <p>Food is an invitation to slow down and ask questions. Recipes and customs vary across Ethiopia’s many communities; let your host or server guide you.</p>
          <a href="#plan" className="text-link">Make room for a meal <ArrowDownRight size={16} /></a>
        </div>
        <div className="food-notes">
          <article className="food-note featured-food">
            <span className="food-index">01</span><div><span className="featured-label">A FIRST-VISIT MUST-TASTE</span><h3 className="serif">Kitfo</h3><p>Seasoned minced beef, traditionally associated with southern Ethiopia. It may be served raw, lightly cooked, or cooked. Ask how it is prepared and choose what feels right for you; clarify ingredients and handling with the restaurant.</p><span className="food-tag">ASK HOW IT’S PREPARED · ORDER TO YOUR COMFORT</span></div>
            <PhotoFigure {...photoSources.kitfo} className="food-photo" />
          </article>
          <article className="food-note">
            <span className="food-index">02</span><div><h3 className="serif">Injera & wot</h3><p>Injera is a tangy, fermented flatbread often used to scoop up wot—sauced dishes that can feature lentils, vegetables, or meat. Recipes and spice levels vary; ask what is in a dish.</p><span className="food-tag">SHARED TABLE · MANY VARIATIONS</span></div>
            <PhotoFigure {...photoSources.injera} className="food-photo" />
          </article>
          <article className="food-note">
            <span className="food-index">03</span><div><h3 className="serif">The coffee ceremony</h3><p>Coffee is roasted, brewed, and served as part of a social ritual in many settings. If invited, settle in and follow your host’s lead; the ceremony is about company as much as the cup.</p><span className="food-tag">MAKE TIME · ACCEPT THE INVITATION</span></div>
            <PhotoFigure {...photoSources.coffee} className="food-photo" />
          </article>
          <article className="food-note">
            <span className="food-index">04</span><div><h3 className="serif">A table for everyone</h3><p>There are many plant-based dishes, including lentil and vegetable wot. Fasting practices differ by person and community; ask what is available rather than assuming.</p><span className="food-tag">ASK KINDLY · SHARE GENEROUSLY</span></div>
          </article>
        </div>
        <div className="food-aside"><span className="aside-jp serif"> buna </span><span className="eyebrow">A GOOD CUP IS A REASON TO STAY</span></div>
      </section>

      <section className="manners-section" id="culture">
        <div className="manners-left">
          <span className="eyebrow">05 — CULTURE IS LIVED, NOT A DISPLAY</span>
          <h2 className="serif">Arrive with<br /><em>room to listen.</em></h2>
          <p>Ethiopia is home to many peoples, languages, faiths, and ways of life. No single custom represents everyone. Be curious without asking any one person to speak for a whole country.</p>
          <span className="manners-glyph" aria-hidden="true">ETH</span>
        </div>
        <div className="manners-list">
          <article><span className="manners-num">01</span><div><h3>Meet the language landscape.</h3><p>Amharic is widely used in Addis, while Ethiopia is multilingual and home to many languages, including Afaan Oromo, Tigrinya, Somali, and others. Learn a greeting if you can, and follow the language your host prefers.</p></div></article>
          <article><span className="manners-num">02</span><div><h3>Faith is varied and personal.</h3><p>Ethiopian Orthodox Christianity, Islam, Protestant traditions, Catholicism, and other beliefs are part of the country’s religious life. Dress and behavior expectations differ by place; observe local guidance.</p></div></article>
          <article><span className="manners-num">03</span><div><h3>Ask before you photograph.</h3><p>People, worship, and daily work are not backdrops. Ask permission first, respect a no, and look for photography restrictions at religious or cultural sites.</p></div></article>
          <article><span className="manners-num">04</span><div><h3>Take your cue from your host.</h3><p>Greetings, meals, and hospitality vary. A warm hello and a little patience go a long way; if you are unsure, ask politely rather than assume.</p></div></article>
        </div>
      </section>

      <section className="transit-section" id="getting-around">
        <div className="transit-top">
          <div><span className="eyebrow">06 — MOVE WITH THE CITY</span><h2 className="serif">Make the journey<br /><em>part of the plan.</em></h2></div>
          <p>Addis is spread across hills and busy roads. Combine short walks with local transport or a taxi, and leave generous space between plans.</p>
        </div>
        <div className="transit-grid">
          <article className="transit-card"><span className="transit-icon"><TrainFront size={20} /></span><span className="eyebrow">LIGHT RAIL & RAIL</span><h3 className="serif">For a city crossing</h3><p>Rail can be useful where routes fit your plans. Confirm current routes, operating details, fares, and payment arrangements through official sources.</p><a href="#plan" className="transit-link">Check current details <ArrowRight size={14} /></a></article>
          <article className="transit-card"><span className="transit-icon"><Bus size={20} /></span><span className="eyebrow">BUS & TAXI</span><h3 className="serif">For local connections</h3><p>Options and arrangements vary. Ask a trusted local contact or your accommodation about current ways to reach a destination and agree on taxi terms before setting off.</p><a href="#plan" className="transit-link">Allow extra time <ArrowRight size={14} /></a></article>
          <article className="transit-card"><span className="transit-icon transit-walk">01</span><span className="eyebrow">ON FOOT</span><h3 className="serif">For noticing more</h3><p>Walk a compact area at an easy pace. Sidewalks, crossings, hills, and traffic differ from street to street; choose routes that suit your comfort.</p><a href="#neighborhood-title" className="transit-link">Choose a starting point <ArrowRight size={14} /></a></article>
        </div>
        <p className="transit-caveat">Routes, fares, operating hours, entry details, and travel requirements can change. Confirm them with current official sources and relevant providers before you go.</p>
      </section>

      <section className="visitor-tips-section" id="tips" aria-labelledby="tips-title">
        <div className="visitor-tips-heading">
          <span className="eyebrow">07 — YOUR VISIT</span>
          <h2 id="tips-title" className="serif">Make the visit<br /><em>your own.</em></h2>
        </div>
        <div className="visitor-prompt-layout">
          <form
            className="visitor-prompt-form"
            onSubmit={(event) => {
              event.preventDefault();
              const response = visitorResponse.trim();
              if (!response) {
                setVisitorResponseStatus('Write a few words before saving.');
                return;
              }
              try {
                window.sessionStorage.setItem('addis-visitor-response', response);
                setVisitorResponse(response);
                setVisitorResponseStatus('Saved in this browser tab only.');
              } catch {
                setVisitorResponseStatus('Could not save, but your response is still in the box.');
              }
            }}
          >
            <label className="visitor-prompt-label" htmlFor="visitor-response">What would you most like to experience in Addis?</label>
            <textarea
              id="visitor-response"
              rows={3}
              value={visitorResponse}
              onChange={(event) => {
                setVisitorResponse(event.target.value);
                setVisitorResponseStatus('');
              }}
              placeholder="A local market, Ethiopian food, the coffee ceremony, or something else?"
            />
            <div className="visitor-prompt-actions">
              <span className="visitor-prompt-note">Your response stays in this browser tab.</span>
              <button type="submit" className="visitor-prompt-button">Save my note</button>
            </div>
            <p className="visitor-prompt-status" role="status" aria-live="polite">{visitorResponseStatus}</p>
          </form>
          <aside className="visitor-quick-reminder">
            <span className="eyebrow">QUICK REMINDER</span>
            <p className="serif">Take it slowly. Group nearby stops. Check current details.</p>
          </aside>
        </div>
      </section>

      <section className="planning-section" id="plan">
        <div className="planning-intro">
          <span className="eyebrow">A LAST NOTE BEFORE YOU GO</span>
          <h2 className="serif">Leave a little<br /><em>room in the day.</em></h2>
          <p>Build around a few anchors, then make space for the altitude, an unhurried coffee, and the place you almost walked past.</p>
        </div>
        <div className="planning-panel">
          <div className="planning-topline"><span className="eyebrow">HOW LONG HAVE YOU GOT?</span><span className="eyebrow">A LOOSE STARTING POINT</span></div>
          <div className="day-tabs" role="tablist" aria-label="Choose trip length">
            {(Object.keys(itinerary) as ItineraryLength[]).map((days) => (
              <button type="button" role="tab" aria-selected={selectedDays === days} className={selectedDays === days ? 'day-tab active' : 'day-tab'} key={days} onClick={() => setSelectedDays(days)} data-testid={`tab-${days.replace(' ', '-')}`}>{days}</button>
            ))}
          </div>
          <div className="itinerary-content" role="tabpanel" aria-live="polite">
            <div className="itinerary-title"><span className="serif">{itinerary[selectedDays].title}</span><span className="itinerary-mark">AA</span></div>
            <p>{itinerary[selectedDays].detail}</p>
            <div className="route-pills">{itinerary[selectedDays].route.map((stop, index) => <span key={stop}><b>{String(index + 1).padStart(2, '0')}</b>{stop}</span>)}</div>
          </div>
          <div className="planning-tip"><span className="eyebrow">BEFORE YOU GO</span><p>Check official visitor, transport, and travel-advisory sources for current requirements and access. In Addis’s high elevation, give yourself time to acclimate and avoid overfilling your first days.</p></div>
        </div>
      </section>

      <section className="faq-section">
        <span className="eyebrow">A FEW THINGS PEOPLE ASK</span>
        <div className="faq-layout">
          <h2 className="serif">Good to<br /><em>know.</em></h2>
          <div className="faq-list">
            <details><summary>How should I handle the altitude? <ChevronDown size={18} /></summary><p>Addis Ababa sits high above sea level. Take it easy when you arrive, give yourself time to adjust, drink water, and seek medical advice if you feel unwell. Individual needs vary.</p></details>
            <details><summary>What should I know about kitfo? <ChevronDown size={18} /></summary><p>Kitfo is seasoned minced beef and can be served raw, lightly cooked, or cooked. Ask how it is prepared and choose the preparation that suits your comfort; ask about ingredients and handling too.</p></details>
            <details><summary>Do I need to plan every detail in advance? <ChevronDown size={18} /></summary><p>Anchor your day around a few places and confirm current opening or access information with official sources. Leave flexibility for traffic, changing conditions, and the pace of your own acclimatization.</p></details>
            <details><summary>Is one cultural etiquette rule right everywhere? <ChevronDown size={18} /></summary><p>No. Ethiopia is diverse, and expectations vary among communities, faiths, and places. Be attentive to posted guidance, take local cues, and ask respectfully when unsure.</p></details>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a href="#top" className="footer-brand"><span className="wordmark-stamp" aria-hidden="true">A</span><span className="serif">Come curious.<br /><em>Leave room.</em></span></a>
        <div className="footer-center"><span className="eyebrow">A FIELD GUIDE TO ADDIS & ETHIOPIA</span><p>For the first visit, and the one after that.</p></div>
        <a href="#top" className="back-top">Back to the beginning <ArrowDown size={14} className="up-arrow" /></a>
        <div className="footer-bottom"><span>INDEPENDENT VISITOR NOTES · CHECK CURRENT OFFICIAL SOURCES</span><span>ADDIS ABABA · ETHIOPIA</span></div>
      </footer>
    </main>
  );
}

export default App;
