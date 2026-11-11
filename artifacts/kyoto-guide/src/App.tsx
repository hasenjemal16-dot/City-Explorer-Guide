import { useEffect, useRef, useState } from 'react';
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
  { label: 'Ask the guide', href: '#ask-guide' },
  { label: 'Dish gallery', href: '#gallery' },
  { label: 'Living culture', href: '#culture' },
  { label: 'Getting around', href: '#getting-around' },
  { label: 'Tips', href: '#tips' },
];

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1280;
const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

type DishPhoto = {
  id: number;
  title: string;
  caption: string;
  mimeType: string;
  inspectorNote: string | null;
  createdAt: string;
  imageUrl: string;
};

type InspirationPhoto = {
  id: string;
  imageUrl: string;
  rawUrl: string;
  altText: string;
  photographerName: string;
  photographerProfileUrl: string;
  downloadLocation: string;
};

type ChatSettings = {
  temperature: number;
  topP: number;
  maxOutputTokens: number;
};

type ChatEntry = {
  role: 'user' | 'assistant';
  content: string;
  answer?: {
    settings: ChatSettings;
    usage: {
      promptTokens: number;
      candidateTokens: number;
      totalTokens: number;
      truncated: boolean;
    };
    model: string;
  };
};

const defaultChatSettings: ChatSettings = {
  temperature: 1,
  topP: 0.95,
  maxOutputTokens: 300,
};

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not prepare the selected image.'));
      }
    };
    reader.readAsDataURL(blob);
  });
}

async function prepareDishImage(file: File): Promise<string> {
  if (!supportedImageTypes.includes(file.type)) {
    throw new Error('Choose a JPEG, PNG, or WebP image. GIF images are not supported.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Choose an image no larger than 3 MB.');
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('The selected file could not be opened as an image.');
  }

  try {
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Your browser could not prepare the selected image.');
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const resizedImage = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Your browser could not resize the selected image.'));
          }
        },
        file.type,
        file.type === 'image/png' ? undefined : 0.88,
      );
    });

    if (!supportedImageTypes.includes(resizedImage.type)) {
      throw new Error('Your browser could not encode this image format.');
    }
    if (resizedImage.size > MAX_IMAGE_BYTES) {
      throw new Error('The resized image is larger than 3 MB. Choose a smaller image.');
    }

    return await readAsDataUrl(resizedImage);
  } finally {
    bitmap.close();
  }
}

async function responseError(response: Response, fallback: string): Promise<string> {
  const body: unknown = await response.json().catch(() => null);
  if (
    body &&
    typeof body === 'object' &&
    'error' in body &&
    typeof body.error === 'string'
  ) {
    const reason =
      'reason' in body && typeof body.reason === 'string' ? body.reason : '';
    return reason ? `${body.error} ${reason}` : body.error;
  }
  return fallback;
}

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
  const [dishPhotos, setDishPhotos] = useState<DishPhoto[]>([]);
  const [dishTitle, setDishTitle] = useState('');
  const [dishCaption, setDishCaption] = useState('');
  const [dishFile, setDishFile] = useState<File | null>(null);
  const [dishLoading, setDishLoading] = useState(true);
  const [dishLoadError, setDishLoadError] = useState('');
  const [dishUploadError, setDishUploadError] = useState('');
  const [dishUploading, setDishUploading] = useState(false);
  const dishFileInput = useRef<HTMLInputElement>(null);
  const [inspirationPhotos, setInspirationPhotos] = useState<InspirationPhoto[]>([]);
  const [inspirationLoading, setInspirationLoading] = useState(true);
  const [inspirationError, setInspirationError] = useState('');
  const [inspirationActionError, setInspirationActionError] = useState('');
  const [inspirationActionLoadingId, setInspirationActionLoadingId] = useState<string | null>(null);
  const [selectedInspirationPhoto, setSelectedInspirationPhoto] = useState<InspirationPhoto | null>(null);
  const [chatDraft, setChatDraft] = useState('');
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>([]);
  const [chatSettings, setChatSettings] = useState<ChatSettings>(defaultChatSettings);
  const [chatSystemPrompt, setChatSystemPrompt] = useState('');
  const [chatPromptError, setChatPromptError] = useState('');
  const [chatError, setChatError] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [visitorResponse, setVisitorResponse] = useState(() => {
    try {
      return window.sessionStorage.getItem('addis-visitor-response') ?? '';
    } catch {
      return '';
    }
  });
  const [visitorResponseStatus, setVisitorResponseStatus] = useState('');
  const closeMenu = () => setMenuOpen(false);

  const loadInspirationPhotos = async () => {
    setInspirationLoading(true);
    setInspirationError('');
    try {
      const response = await fetch('/api/unsplash/dish-inspiration');
      if (!response.ok) {
        throw new Error(
          await responseError(response, 'Food inspiration could not load. Please try again.'),
        );
      }
      const photos = (await response.json()) as InspirationPhoto[];
      setInspirationPhotos(photos);
    } catch (error) {
      setInspirationError(
        error instanceof Error
          ? error.message
          : 'Food inspiration could not load. Please check your connection and try again.',
      );
    } finally {
      setInspirationLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/dishes')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await responseError(response, 'Could not load the dish gallery.'));
        }
        return (await response.json()) as DishPhoto[];
      })
      .then((photos) => {
        if (!cancelled) {
          setDishPhotos(photos);
          setDishLoadError('');
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDishLoadError(
            error instanceof Error ? error.message : 'Could not load the dish gallery.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDishLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void loadInspirationPhotos();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/chat/system-prompt')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await responseError(response, 'Could not load the guide instructions.'));
        }
        return (await response.json()) as { systemPrompt: string };
      })
      .then(({ systemPrompt }) => {
        if (!cancelled) {
          setChatSystemPrompt(systemPrompt);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setChatPromptError(
            error instanceof Error ? error.message : 'Could not load the guide instructions.',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

      <section className="ask-guide-section" id="ask-guide" aria-labelledby="ask-guide-title">
        <div className="ask-guide-heading">
          <div>
            <span className="eyebrow">05 — YOUR AI CITY GUIDE</span>
            <h2 id="ask-guide-title" className="serif">Curious about<br /><em>Addis?</em></h2>
          </div>
          <p>Ask about the city, its food, or planning a visit. This AI guide uses facts from this page and will tell you when it is unsure. Please do not share personal information.</p>
        </div>

        <div className="ask-guide-layout">
          <div className="ask-guide-chat">
            <div className="ask-guide-messages" aria-live="polite">
              {chatEntries.length === 0 && (
                <p className="ask-guide-empty">Try asking, “What should I eat first?”</p>
              )}
              {chatEntries.map((entry, index) => (
                <article
                  className={`ask-guide-message ${entry.role === 'user' ? 'from-visitor' : 'from-guide'}`}
                  key={`${entry.role}-${index}`}
                >
                  <span className="eyebrow">{entry.role === 'user' ? 'YOU' : 'AI CITY GUIDE'}</span>
                  <p>{entry.content}</p>
                  {entry.answer && (
                    <div className="ask-guide-answer-meta">
                      <span>
                        Settings: temperature {entry.answer.settings.temperature.toFixed(1)} · top-p {entry.answer.settings.topP.toFixed(2)} · max tokens {entry.answer.settings.maxOutputTokens}
                      </span>
                      <span>
                        Tokens: {entry.answer.usage.promptTokens} prompt · {entry.answer.usage.candidateTokens} answer · {entry.answer.usage.totalTokens} total · {entry.answer.model}
                      </span>
                      {entry.answer.usage.truncated && (
                        <strong>Your answer was cut off at the token limit. Increase max output tokens and ask again.</strong>
                      )}
                    </div>
                  )}
                </article>
              ))}
              {chatLoading && <p className="ask-guide-pending" role="status">Your guide is thinking…</p>}
            </div>

            <form
              className="ask-guide-form"
              onSubmit={async (event) => {
                event.preventDefault();
                const message = chatDraft.trim();
                if (!message || chatLoading) {
                  return;
                }

                setChatError('');
                setChatLoading(true);
                try {
                  const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      message,
                      history: chatEntries
                        .slice(-20)
                        .map(({ role, content }) => ({ role, content })),
                      settings: chatSettings,
                    }),
                  });
                  if (!response.ok) {
                    throw new Error(await responseError(response, 'Check your question and try again.'));
                  }

                  const answer = (await response.json()) as {
                    reply: string;
                    settings: ChatSettings;
                    usage: NonNullable<ChatEntry['answer']>['usage'];
                    model: string;
                  };
                  setChatEntries((entries) => [
                    ...entries,
                    { role: 'user', content: message },
                    {
                      role: 'assistant',
                      content: answer.reply,
                      answer: {
                        settings: answer.settings,
                        usage: answer.usage,
                        model: answer.model,
                      },
                    },
                  ]);
                  setChatDraft('');
                } catch (error) {
                  setChatError(
                    error instanceof Error ? error.message : 'The guide could not answer. Please try again.',
                  );
                } finally {
                  setChatLoading(false);
                }
              }}
            >
              <label className="ask-guide-label" htmlFor="ask-guide-question">Your question</label>
              <textarea
                id="ask-guide-question"
                value={chatDraft}
                onChange={(event) => {
                  setChatDraft(event.target.value);
                  setChatError('');
                }}
                placeholder="What should I eat first?"
                rows={3}
                maxLength={4000}
                required
              />
              <div className="ask-guide-form-footer">
                <p className="ask-guide-error" role="alert" aria-live="polite">{chatError}</p>
                <button className="ask-guide-submit" type="submit" disabled={chatLoading}>
                  {chatLoading ? 'Asking…' : 'Ask the guide'} <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>

          <aside className="prompt-lab" aria-labelledby="prompt-lab-title">
            <span className="eyebrow">TUNE THE RESPONSE</span>
            <h3 id="prompt-lab-title" className="serif">Prompt Lab</h3>
            <label className="prompt-slider">
              <span><span>Temperature</span><output>{chatSettings.temperature.toFixed(1)}</output></span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={chatSettings.temperature}
                onChange={(event) => setChatSettings((settings) => ({
                  ...settings,
                  temperature: Number(event.target.value),
                }))}
              />
              <small>Lower is more consistent; higher is more varied.</small>
            </label>
            <label className="prompt-slider">
              <span><span>Max output tokens</span><output>{chatSettings.maxOutputTokens}</output></span>
              <input
                type="range"
                min="32"
                max="1024"
                step="1"
                value={chatSettings.maxOutputTokens}
                onChange={(event) => setChatSettings((settings) => ({
                  ...settings,
                  maxOutputTokens: Number(event.target.value),
                }))}
              />
              <small>More tokens allow longer answers.</small>
            </label>
            <label className="prompt-slider">
              <span><span>Top-p</span><output>{chatSettings.topP.toFixed(2)}</output></span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={chatSettings.topP}
                onChange={(event) => setChatSettings((settings) => ({
                  ...settings,
                  topP: Number(event.target.value),
                }))}
              />
              <small>Adjusts the range of word choices.</small>
            </label>
            <details className="prompt-system-details">
              <summary>Show the system prompt <ChevronDown size={16} /></summary>
              {chatPromptError ? (
                <p className="prompt-system-error" role="alert">{chatPromptError}</p>
              ) : (
                <pre>{chatSystemPrompt || 'Loading the guide instructions…'}</pre>
              )}
            </details>
          </aside>
        </div>
      </section>

      <section className="dish-gallery-section" id="gallery" aria-labelledby="dish-gallery-title">
        <div className="dish-gallery-heading">
          <div>
            <span className="eyebrow">06 — FROM YOUR TABLE TO OURS</span>
            <h2 id="dish-gallery-title" className="serif">Favorite dishes,<br /><em>shared by you.</em></h2>
          </div>
          <p>Share a photo of kitfo, seasoned minced beef associated with southern Ethiopia. Our AI inspector checks each photo before it joins the gallery.</p>
        </div>

        <form
          className="dish-upload-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setDishUploadError('');
            if (!dishFile) {
              setDishUploadError('Choose a JPEG, PNG, or WebP photo to upload.');
              return;
            }

            setDishUploading(true);
            try {
              const image = await prepareDishImage(dishFile);
              const response = await fetch('/api/dishes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: dishTitle.trim(),
                  caption: dishCaption.trim(),
                  image,
                }),
              });
              if (!response.ok) {
                throw new Error(await responseError(response, 'The photo could not be uploaded.'));
              }

              const savedDish = (await response.json()) as DishPhoto;
              setDishPhotos((currentPhotos) => [savedDish, ...currentPhotos]);
              setDishLoadError('');
              setDishTitle('');
              setDishCaption('');
              setDishFile(null);
              if (dishFileInput.current) {
                dishFileInput.current.value = '';
              }
            } catch (error) {
              setDishUploadError(
                error instanceof Error ? error.message : 'The photo could not be uploaded.',
              );
            } finally {
              setDishUploading(false);
            }
          }}
        >
          <label>
            <span className="dish-upload-label">Dish name</span>
            <input
              type="text"
              value={dishTitle}
              onChange={(event) => setDishTitle(event.target.value)}
              placeholder="For example, kitfo"
              required
              maxLength={120}
            />
          </label>
          <label>
            <span className="dish-upload-label">Caption <span>(optional)</span></span>
            <textarea
              value={dishCaption}
              onChange={(event) => setDishCaption(event.target.value)}
              placeholder="Where did you enjoy it?"
              rows={3}
              maxLength={500}
            />
          </label>
          <label>
            <span className="dish-upload-label">Photo</span>
            <input
              ref={dishFileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                setDishFile(event.target.files?.[0] ?? null);
                setDishUploadError('');
              }}
              required
            />
            <span className="dish-upload-hint">JPEG, PNG, or WebP · up to 3 MB</span>
          </label>
          <div className="dish-upload-actions">
            <p className="dish-upload-message" role="alert" aria-live="polite">{dishUploadError}</p>
            <button type="submit" className="dish-upload-button" disabled={dishUploading}>
              {dishUploading ? 'Sharing photo…' : 'Share your dish'} <ArrowRight size={15} />
            </button>
          </div>
        </form>

        <div className="dish-gallery-grid" aria-live="polite">
          {dishLoading && <p className="dish-gallery-message">Loading the gallery…</p>}
          {!dishLoading && dishLoadError && (
            <p className="dish-gallery-message" role="alert">{dishLoadError}</p>
          )}
          {!dishLoading && !dishLoadError && dishPhotos.length === 0 && (
            <p className="dish-gallery-message">No photos yet. Be the first to share a favorite dish.</p>
          )}
          {dishPhotos.map((dish) => (
            <article className="dish-gallery-card" key={dish.id}>
              <img src={dish.imageUrl} alt={dish.title} loading="lazy" decoding="async" />
              <div className="dish-gallery-card-copy">
                <h3 className="serif">{dish.title}</h3>
                {dish.caption && <p>{dish.caption}</p>}
                {dish.inspectorNote && (
                  <p className="dish-inspector-note">{dish.inspectorNote}</p>
                )}
                <time dateTime={dish.createdAt}>
                  {new Date(dish.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="inspiration-section" id="dish-inspiration" aria-labelledby="inspiration-title">
        <div className="inspiration-heading">
          <div>
            <span className="eyebrow">07 — A LITTLE MORE INSPIRATION</span>
            <h2 id="inspiration-title" className="serif">The kitfo table,<br /><em>seen around the world.</em></h2>
          </div>
          <button
            type="button"
            className="inspiration-refresh"
            onClick={() => void loadInspirationPhotos()}
            disabled={inspirationLoading}
          >
            {inspirationLoading ? 'Loading inspiration…' : 'Refresh Inspiration'} <ArrowRight size={14} />
          </button>
        </div>
        <p className="inspiration-description">
          Food inspiration from Unsplash, searched for kitfo in Addis Ababa. Photos are shared with photographer credit.
        </p>
        {inspirationError && (
          <p className="inspiration-status" role="alert">{inspirationError}</p>
        )}
        {inspirationActionError && (
          <p className="inspiration-status" role="alert">{inspirationActionError}</p>
        )}
        {!inspirationLoading && !inspirationError && inspirationPhotos.length === 0 && (
          <p className="inspiration-status">No inspiration photos were found. Refresh to try the search again.</p>
        )}
        {inspirationLoading && inspirationPhotos.length === 0 && (
          <p className="inspiration-status" role="status">Finding food inspiration…</p>
        )}
        <div className="inspiration-grid">
          {inspirationPhotos.map((photo) => (
            <article className="inspiration-card" key={photo.id}>
              <button
                type="button"
                className="inspiration-photo-button"
                aria-label={`Expand photo by ${photo.photographerName}`}
                disabled={inspirationActionLoadingId === photo.id}
                onClick={async () => {
                  setInspirationActionError('');
                  setInspirationActionLoadingId(photo.id);
                  try {
                    const response = await fetch(
                      `/api/unsplash/photos/${encodeURIComponent(photo.id)}/download`,
                      { method: 'POST' },
                    );
                    if (!response.ok) {
                      throw new Error(
                        await responseError(response, 'This photo could not be opened. Please try again.'),
                      );
                    }
                    setSelectedInspirationPhoto(photo);
                  } catch (error) {
                    setInspirationActionError(
                      error instanceof Error
                        ? error.message
                        : 'This photo could not be opened. Please check your connection and try again.',
                    );
                  } finally {
                    setInspirationActionLoadingId(null);
                  }
                }}
              >
                <img src={photo.imageUrl} alt={photo.altText} loading="lazy" decoding="async" />
                <span>{inspirationActionLoadingId === photo.id ? 'Opening…' : 'Expand photo'}</span>
              </button>
              <p className="inspiration-credit">
                Photo by{' '}
                <a href={photo.photographerProfileUrl} target="_blank" rel="noreferrer">
                  {photo.photographerName}
                </a>{' '}
                on <a href="https://unsplash.com/?utm_source=city-explorer-guide&utm_medium=referral" target="_blank" rel="noreferrer">Unsplash</a>
              </p>
            </article>
          ))}
        </div>
        {selectedInspirationPhoto && (
          <div
            className="inspiration-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo by ${selectedInspirationPhoto.photographerName}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedInspirationPhoto(null);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setSelectedInspirationPhoto(null);
              }
            }}
          >
            <div className="inspiration-lightbox-content">
              <button
                type="button"
                className="inspiration-lightbox-close"
                onClick={() => setSelectedInspirationPhoto(null)}
                aria-label="Close expanded photo"
              >
                <X size={20} />
              </button>
              <img src={selectedInspirationPhoto.rawUrl} alt={selectedInspirationPhoto.altText} />
              <p>
                Photo by{' '}
                <a href={selectedInspirationPhoto.photographerProfileUrl} target="_blank" rel="noreferrer">
                  {selectedInspirationPhoto.photographerName}
                </a>{' '}
                on <a href="https://unsplash.com/?utm_source=city-explorer-guide&utm_medium=referral" target="_blank" rel="noreferrer">Unsplash</a>
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="manners-section" id="culture">
        <div className="manners-left">
          <span className="eyebrow">08 — CULTURE IS LIVED, NOT A DISPLAY</span>
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
          <div><span className="eyebrow">09 — MOVE WITH THE CITY</span><h2 className="serif">Make the journey<br /><em>part of the plan.</em></h2></div>
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
          <span className="eyebrow">10 — YOUR VISIT</span>
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
