import { useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowRight, Bus, ChevronDown, Clock3, Menu, TrainFront, X } from 'lucide-react';
import kyotoDawn from './kyoto-dawn.jpg';

const navItems = [
  { label: 'The essentials', href: '#essentials' },
  { label: 'Eat well', href: '#eat' },
  { label: 'Local manners', href: '#manners' },
  { label: 'Getting around', href: '#getting-around' },
];

const landmarks = [
  {
    number: '01',
    name: 'Fushimi Inari Taisha',
    neighborhood: 'FUSHIMI · SOUTH KYOTO',
    note: 'Vermilion gates climb into a wooded mountain. Walk beyond the first famous stretch and the crowd thins; you can turn around whenever the path feels right.',
    best: 'Go early or later in the day',
    mark: '鳥居',
    tone: 'landmark-vermillion',
  },
  {
    number: '02',
    name: 'Kiyomizu-dera',
    neighborhood: 'HIGASHIYAMA · EAST',
    note: 'A hillside temple with a wide view over the city. The approach through old lanes is part of the visit—take the side streets slowly, not just the main slope.',
    best: 'Pair with a Higashiyama wander',
    mark: '清水',
    tone: 'landmark-moss',
  },
  {
    number: '03',
    name: 'Arashiyama',
    neighborhood: 'WEST KYOTO · RIVERSIDE',
    note: 'A whole district, not just a bamboo grove. Cross the river, follow a quieter lane, or linger by the water after the headline sights.',
    best: 'Make room for an unplanned walk',
    mark: '嵐山',
    tone: 'landmark-river',
  },
];

const itinerary = {
  '2 days': {
    title: 'A first taste',
    detail: 'Keep the map compact: one day around Higashiyama, one morning at Fushimi Inari, then leave an afternoon for a neighborhood you stumble into.',
    route: ['Higashiyama', 'Fushimi', 'Downtown'],
  },
  '3 days': {
    title: 'Room to breathe',
    detail: 'Add a day for Arashiyama or a quieter northern temple. Do fewer things than you think you can, and let the in-between moments count.',
    route: ['Higashiyama', 'Fushimi', 'Arashiyama'],
  },
  '5 days': {
    title: 'A slower rhythm',
    detail: 'Spread the big sights across the week. Add a market morning, a riverside evening, and time to return to a street that stayed with you.',
    route: ['East side', 'South', 'West side'],
  },
};

type ItineraryLength = keyof typeof itinerary;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<ItineraryLength>('3 days');

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="guide">
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="Kyoto, between the lines — home" onClick={closeMenu}>
          <span className="wordmark-stamp">京</span>
          <span>KYOTO, <i>between</i> the lines</span>
        </a>
        <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link" onClick={closeMenu}>{item.label}</a>
          ))}
          <a href="#plan" className="nav-plan" onClick={closeMenu}>Plan your days <ArrowRight size={14} /></a>
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          data-testid="button-menu-toggle"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <section className="hero grain" id="top" aria-labelledby="hero-title">
        <img className="hero-image" src={kyotoDawn} alt="A quiet Kyoto lane at dawn, its rain-darkened stones leading toward the hills" />
        <div className="hero-wash" />
        <div className="hero-content">
          <p className="eyebrow hero-kicker reveal">A field guide for your first time</p>
          <h1 id="hero-title" className="serif reveal reveal-delay-1">Kyoto asks you<br />to <em>look a little closer.</em></h1>
          <p className="hero-deck reveal reveal-delay-2">Beyond the postcard: a city of small thresholds, long walks, and the everyday rituals in between.</p>
          <a href="#essentials" className="hero-cta reveal reveal-delay-2">
            <span>Begin with the essentials</span><span className="round-arrow"><ArrowDown size={17} /></span>
          </a>
        </div>
        <div className="hero-aside"><span className="vertical-text">A GOOD PLACE TO BEGIN · 35°00′N 135°46′E</span></div>
        <div className="hero-caption"><span>HIGASHIYAMA, JUST BEFORE THE CITY WAKES</span><span>01 / 06</span></div>
      </section>

      <section className="intro-section" id="essentials">
        <div className="section-marker"><span className="eyebrow">01 — FIND YOUR BEARINGS</span><span className="marker-line" /></div>
        <div className="intro-grid">
          <h2 className="serif">Not a checklist.<br /><em>A way in.</em></h2>
          <div className="intro-copy">
            <p className="intro-lead">Kyoto is not a museum set. It is a living city, and its loveliest moments often happen between the famous ones.</p>
            <p>Come for the temples and torii gates, of course. Then notice the bicycle bell in a narrow lane, the quiet before a shop opens, the river breeze at the end of a long day. This guide is here to help you find both.</p>
            <a className="text-link" href="#plan">A note on planning well <ArrowDownRight size={16} /></a>
          </div>
        </div>
        <div className="intro-foot">
          <div><span className="stat-number serif">1,000+</span><span className="stat-label">years as Japan’s imperial capital</span></div>
          <p>Kyoto’s history lives alongside schools, corner shops, apartment blocks, and all the ordinary business of a city.</p>
          <span className="kanji-seal" aria-hidden="true">京<br />都</span>
        </div>
      </section>

      <section className="landmark-section">
        <div className="section-heading">
          <div><span className="eyebrow">02 — THE ICONS, WITH A LITTLE CONTEXT</span><h2 className="serif">Start here.<br /><em>Then wander.</em></h2></div>
          <p>These places earn their reputation. A little timing, patience, and curiosity can make them feel less like stops and more like encounters.</p>
        </div>
        <div className="landmark-list">
          {landmarks.map((place) => (
            <article className="landmark-row" key={place.number} data-testid={`card-landmark-${place.number}`}>
              <span className="landmark-number eyebrow">{place.number}</span>
              <div className={`landmark-art ${place.tone}`} aria-hidden="true">
                <span className="art-ring" /><span className="art-mark">{place.mark}</span>
                <span className="art-caption">{place.neighborhood}</span>
              </div>
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
        <p className="small-note">Sacred sites are places of worship first. Follow posted guidance, keep voices low, and ask before photographing people.</p>
      </section>

      <section className="neighborhood-section" aria-labelledby="neighborhood-title">
        <div className="neighborhood-head">
          <div><span className="eyebrow">03 — THE CITY BETWEEN SIGHTS</span><h2 id="neighborhood-title" className="serif">Pick a neighborhood.<br /><em>Let the day happen.</em></h2></div>
          <p>One of the best ways to see Kyoto is to stop crossing it. Choose one corner of the map and stay awhile.</p>
        </div>
        <div className="neighborhood-grid">
          <article className="neighborhood-card neighborhood-large">
            <div className="neighborhood-graphic graphic-lane"><span className="graphic-sun" /><span className="graphic-roof roof-one" /><span className="graphic-roof roof-two" /><span className="graphic-lane-label">東山</span></div>
            <div className="neighborhood-meta"><span className="eyebrow">EAST · OLD LANES, HILLSIDE AIR</span><span className="mono">35°00′N</span></div>
            <h3 className="serif">Higashiyama</h3>
            <p>Stone-paved approaches, temple gates, small craft shops. The early hours are gentler; step off the main shopping streets when you can.</p>
          </article>
          <article className="neighborhood-card">
            <div className="neighborhood-graphic graphic-river"><span className="river-line river-a" /><span className="river-line river-b" /><span className="river-bridge" /><span className="graphic-lane-label">鴨川</span></div>
            <div className="neighborhood-meta"><span className="eyebrow">DOWNTOWN · RIVER & BACKSTREETS</span><span className="mono">35°00′N</span></div>
            <h3 className="serif">Kamo River</h3>
            <p>Walk the riverbanks, browse side-street shops, and watch the city come out for its evening stroll.</p>
          </article>
          <article className="neighborhood-card">
            <div className="neighborhood-graphic graphic-market"><span className="market-awning" /><span className="market-counter" /><span className="market-stall" /><span className="graphic-lane-label">錦</span></div>
            <div className="neighborhood-meta"><span className="eyebrow">CENTER · MARKET & DAILY LIFE</span><span className="mono">35°00′N</span></div>
            <h3 className="serif">Nishiki & around</h3>
            <p>A lively covered market and a maze of nearby streets. Browse thoughtfully; many stalls are working shops, not tasting counters.</p>
          </article>
        </div>
      </section>

      <section className="food-section" id="eat">
        <div className="food-intro">
          <span className="eyebrow">04 — EAT WHAT THE CITY EATS</span>
          <h2 className="serif">A meal can be<br /><em>its own itinerary.</em></h2>
          <p>Kyoto’s food is shaped by season, craft, and the pleasure of paying attention. You do not need a reservation at a famous counter to eat well.</p>
          <a href="#plan" className="text-link">Make room for a meal <ArrowDownRight size={16} /></a>
        </div>
        <div className="food-notes">
          <article className="food-note">
            <span className="food-index">01</span><div><h3 className="serif">Yudōfu & shōjin ryōri</h3><p>Gentle tofu dishes and Buddhist temple-inspired vegetarian cooking. Look for them around temple neighborhoods; ask about ingredients if you have dietary needs.</p><span className="food-tag">SLOW LUNCH · EAST & NORTH</span></div>
          </article>
          <article className="food-note">
            <span className="food-index">02</span><div><h3 className="serif">Obanzai</h3><p>Home-style Kyoto cooking, often served as small seasonal sides. A neighborhood restaurant or casual counter is a lovely place to try it.</p><span className="food-tag">SEASONAL · EVERYDAY TABLE</span></div>
          </article>
          <article className="food-note">
            <span className="food-index">03</span><div><h3 className="serif">Matcha, wagashi & a pause</h3><p>Tea and a small sweet are less a sugar stop than a moment to sit. If a tea room is busy, a nearby kissaten makes a fine detour.</p><span className="food-tag">TEA BREAK · ALL OVER TOWN</span></div>
          </article>
          <article className="food-note">
            <span className="food-index">04</span><div><h3 className="serif">Market snacks</h3><p>Try one or two things that catch your eye, and buy from the stall rather than grazing as you walk. Many vendors prefer visitors to eat in designated spots.</p><span className="food-tag">GRAZE KINDLY · NISHIKI</span></div>
          </article>
        </div>
        <div className="food-aside"><span className="aside-jp serif">いただきます</span><span className="eyebrow">A SMALL MOMENT OF GRATITUDE BEFORE A MEAL</span></div>
      </section>

      <section className="manners-section" id="manners">
        <div className="manners-left">
          <span className="eyebrow">05 — BE A GOOD GUEST</span>
          <h2 className="serif">Respect is<br /><em>part of the view.</em></h2>
          <p>Kyoto welcomes visitors, and it is also home. A few thoughtful habits make the city more comfortable for everyone.</p>
          <span className="manners-glyph" aria-hidden="true">礼</span>
        </div>
        <div className="manners-list">
          <article><span className="manners-num">01</span><div><h3>Keep private streets private.</h3><p>Some narrow lanes are residential or have restricted access. Follow signs, stay on public routes, and do not enter homes or private gardens.</p></div></article>
          <article><span className="manners-num">02</span><div><h3>Make space on the path.</h3><p>Walk in smaller groups, avoid stopping in the middle of busy lanes, and keep doorways and shop entrances clear.</p></div></article>
          <article><span className="manners-num">03</span><div><h3>Ask before a photograph.</h3><p>Never photograph geiko or maiko without consent. Some streets prohibit photography; posted rules and people's privacy come first.</p></div></article>
          <article><span className="manners-num">04</span><div><h3>Follow the room you are in.</h3><p>At temples, shrines, and restaurants, look for signs and follow local cues. Remove shoes where requested; keep voices and phone calls low.</p></div></article>
        </div>
      </section>

      <section className="transit-section" id="getting-around">
        <div className="transit-top">
          <div><span className="eyebrow">06 — GETTING AROUND, GENTLY</span><h2 className="serif">The best route<br /><em>is not always the fastest.</em></h2></div>
          <p>Kyoto is spread out. Combine rail, bus, walking, and the occasional taxi rather than expecting one pass or one mode to do everything.</p>
        </div>
        <div className="transit-grid">
          <article className="transit-card"><span className="transit-icon"><TrainFront size={20} /></span><span className="eyebrow">RAIL & SUBWAY</span><h3 className="serif">For distance</h3><p>Useful across town and for longer hops. Check the current route and fare information with the operator before setting out.</p><a href="#plan" className="transit-link">Check your route <ArrowRight size={14} /></a></article>
          <article className="transit-card"><span className="transit-icon"><Bus size={20} /></span><span className="eyebrow">CITY BUS</span><h3 className="serif">For the last stretch</h3><p>Handy for areas farther from a station, but roads can be busy. Board and pay according to the instructions posted on your bus.</p><a href="#plan" className="transit-link">Leave extra time <ArrowRight size={14} /></a></article>
          <article className="transit-card"><span className="transit-icon transit-walk">01</span><span className="eyebrow">ON FOOT</span><h3 className="serif">For the best bits</h3><p>Many memorable discoveries happen between stops. Wear comfortable shoes and allow your map to become a suggestion.</p><a href="#neighborhood-title" className="transit-link">Choose a starting point <ArrowRight size={14} /></a></article>
        </div>
        <p className="transit-caveat">Transit routes, fares, passes, and service can change. Confirm details through official transport sources close to your travel date.</p>
      </section>

      <section className="planning-section" id="plan">
        <div className="planning-intro">
          <span className="eyebrow">A LAST NOTE BEFORE YOU GO</span>
          <h2 className="serif">Leave a little<br /><em>room in the day.</em></h2>
          <p>Build your days around a few anchors, then leave space for weather, appetite, and the lane you almost walked past.</p>
        </div>
        <div className="planning-panel">
          <div className="planning-topline"><span className="eyebrow">HOW LONG HAVE YOU GOT?</span><span className="eyebrow">A LOOSE STARTING POINT</span></div>
          <div className="day-tabs" role="tablist" aria-label="Choose trip length">
            {(Object.keys(itinerary) as ItineraryLength[]).map((days) => (
              <button type="button" role="tab" aria-selected={selectedDays === days} className={selectedDays === days ? 'day-tab active' : 'day-tab'} key={days} onClick={() => setSelectedDays(days)} data-testid={`tab-${days.replace(' ', '-')}`}>{days}</button>
            ))}
          </div>
          <div className="itinerary-content" role="tabpanel" aria-live="polite">
            <div className="itinerary-title"><span className="serif">{itinerary[selectedDays].title}</span><span className="itinerary-mark">京</span></div>
            <p>{itinerary[selectedDays].detail}</p>
            <div className="route-pills">{itinerary[selectedDays].route.map((stop, index) => <span key={stop}><b>{String(index + 1).padStart(2, '0')}</b>{stop}</span>)}</div>
          </div>
          <div className="planning-tip"><span className="eyebrow">BEFORE YOU GO</span><p>Check opening and access information with each place, especially around holidays and seasonal events. Carry some flexibility—and a light layer for changing weather.</p></div>
        </div>
      </section>

      <section className="faq-section">
        <span className="eyebrow">A FEW THINGS PEOPLE ASK</span>
        <div className="faq-layout">
          <h2 className="serif">Good to<br /><em>know.</em></h2>
          <div className="faq-list">
            <details><summary>When is a good time to visit? <ChevronDown size={18} /></summary><p>Each season has its own appeal and its own busy periods. Spring blossoms and autumn color draw many visitors; shoulder seasons can feel quieter, though weather and local events vary. Check seasonal conditions when planning.</p></details>
            <details><summary>Should I book everything ahead? <ChevronDown size={18} /></summary><p>Reserve popular restaurants or experiences when required, but avoid filling every hour. Some temples and gardens may have seasonal access or special arrangements—check their official information before you go.</p></details>
            <details><summary>Is Kyoto walkable? <ChevronDown size={18} /></summary><p>Individual neighborhoods are wonderfully walkable, but the city is larger than it first appears. Plan around clusters, use transit between them, and give yourself more time than the map suggests.</p></details>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a href="#top" className="footer-brand"><span className="wordmark-stamp">京</span><span className="serif">Come curious.<br /><em>Leave gently.</em></span></a>
        <div className="footer-center"><span className="eyebrow">A FIELD GUIDE TO KYOTO</span><p>For the first visit, and the one after that.</p></div>
        <a href="#top" className="back-top">Back to the beginning <ArrowDown size={14} className="up-arrow" /></a>
        <div className="footer-bottom"><span>INDEPENDENT VISITOR NOTES · UPDATED FOR CAREFUL TRAVEL</span><span>京都 · JAPAN</span></div>
      </footer>
    </main>
  );
}

export default App;
