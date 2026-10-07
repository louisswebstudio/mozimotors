import { pl, type Dict } from "./fr";

/** English dictionary — must match fr.ts key for key (enforced by the `Dict` type). */
export const en: Dict = {
  meta: {
    title: "MoziMotors — Buy or sell your used car in Morocco",
    titleTemplate: "%s | MoziMotors",
    description:
      "Used cars inspected on 140+ points, online financing and a firm offer for your car within 24h. Anywhere in Morocco.",
  },
  common: {
    priceFormat: "{n} MAD",
    currency: "MAD",
    perMonth: "/mo",
    perMonthFull: "{amount}/mo",
    from: "from",
    or: "or",
    cars: pl({ one: "{n} car", other: "{n} cars" }),
    close: "Close",
    seeCars: "Browse cars",
    seeAllCars: "See all cars",
    sellMyCar: "Sell my car",
    estimateMyCar: "Value my car",
    contactUs: "Contact us",
    whyUs: "Why MoziMotors",
    certified: "Certified",
    used: "Used",
    km: "{n} km",
  },
  nav: {
    label: "Main navigation",
    home: "Home",
    buy: "Buy",
    sell: "Sell",
    why: "Why us",
    contact: "Contact",
    homeAria: "MoziMotors, home",
    searchPlaceholder: "Try “Duster” or “SUV”",
    searchLabel: "Search for a car",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    showShortcuts: "Show {label} shortcuts",
    hideShortcuts: "Hide {label} shortcuts",
    contactTitle: "Contact us",
  },
  langs: {
    choose: "Choose language",
    fr: "Français",
    en: "English",
    ar: "العربية",
  },
  buyMenu: {
    bodies: "Body type",
    budget: "Budget",
    brands: "Brands",
    budgetHint: "The bar shows how much of our stock it covers.",
    under: "Under {amount}",
    trust: ["Inspected on 140+ points", "Online financing", "Delivery anywhere in Morocco"],
    seeAll: "See all {cars}",
  },
  vehicle: {
    body: {
      suv: "SUV", berline: "Sedan", break: "Estate", citadine: "City car", compacte: "Hatchback", monospace: "MPV",
      coupe: "Coupe", cabriolet: "Convertible", pickup: "Pickup", utilitaire: "Van",
    },
    fuel: { essence: "Petrol", diesel: "Diesel", hybride: "Hybrid", electrique: "Electric" },
    gearbox: { automatique: "Automatic", manuelle: "Manual" },
    gearboxShort: { automatique: "Auto", manuelle: "Manual" },
    owners: pl({ one: "1 owner", other: "{n} owners" }),
  },
  card: {
    orFrom: "or from",
    details: "View details",
  },
  hero: {
    imageAlt: "Dark sedan parked facing the mountains at sunrise",
    eyebrow: pl({ one: "{n} car ready to drive", other: "{n} cars ready to drive" }),
    title: "Used cars, without the stress.",
    text: "Buy a certified car or sell yours in 24h. Fair prices, a full inspection report and support from start to finish, anywhere in Morocco.",
  },
  bodyCarousel: {
    title: "Find your car by body type",
    types: ["SUV & Pickup", "Sedan", "Estate", "City car", "MPV", "Coupe", "Convertible", "Van"],
    prev: "Previous types",
    next: "Next types",
  },
  featured: {
    eyebrow: "This week's selection",
    title: "Inspected cars, ready to drive",
    prev: "Previous car",
    next: "Next car",
  },
  brands: {
    eyebrow: "Brands",
    title: "Browse by brand",
    link: "See all stock",
  },
  banners: [
    {
      imageAlt: "Grey electric sedan in profile in front of a city",
      title: "Looking for your next car?",
      text: "Cars inspected on 140+ points, prices on display, no hidden fees.",
      cta: "Browse cars",
    },
    {
      imageAlt: "Blue estate car driving past office buildings",
      title: "What's your car worth?",
      text: "Free valuation in 2 minutes and a firm offer within 24h. Paid by bank transfer.",
      cta: "Value my car",
    },
  ],
  how: {
    eyebrow: "How it works",
    title: "From search to the open road, in four steps",
    text: "No pressure, no jargon. Buying a used car should always be this simple.",
    teamLabel: "A dedicated advisor",
    steps: [
      { title: "Choose", text: "Browse our inspected cars, with prices on display, HD photos and an inspection report." },
      { title: "Finance", text: "Online pre-approval in minutes with our partners, up to 84 months." },
      { title: "Reserve", text: "Reserve online, trade in your current car and follow your file with an advisor." },
      { title: "Drive", text: "Collect the keys at the showroom or get it delivered anywhere in Morocco. Paperwork included." },
    ],
  },
  financeTeaser: {
    title: "Your next car starts here",
    bullets: [
      "Work out your budget in under a minute",
      "Discover the cars that suit you",
      "Enjoy simple financing, with no hidden fees",
    ],
  },
  financeWidget: {
    monthly: "Monthly payment",
    deposit: "Down payment",
    noDeposit: "No deposit",
    budget: "Your estimated car budget",
    terms: "Over {months} months, indicative rate {rate}%. Subject to approval by the lender.",
    cta: "See cars within my budget",
  },
  trust: {
    eyebrow: "MoziMotors commitments",
    title: "Trust, included in the price",
    text: "Everything a used-car purchase should always include, at no extra cost.",
    bullets: [
      "140+ point mechanical and bodywork inspection",
      "Lien check with NARSA before every sale",
      "Registration, insurance and paperwork taken care of",
    ],
    playVideo: "Play video",
  },
  stats: {
    inspection: "Inspection points",
    rating: "Customer satisfaction",
    offer: "For a firm offer",
    stock: "Cars available",
  },
  reviews: {
    title: "What our customers say",
    subtitle: "Customers all over Morocco, buying and selling.",
    clientIn: "Customer in",
    verified: "Verified review",
  },
  visit: {
    title: "Comfort and performance await",
    subtitle: "Visit our showroom to reserve your next car",
    officeLabel: "MoziMotors showroom",
    callLabel: "Call us",
    emailLabel: "Send us an email",
    mapTitle: "Map to MoziMotors",
  },
  cta: {
    eyebrow: "Get started",
    title: "Ready to find your next car?",
    text: "Browse all our inspected cars or talk to an advisor today.",
  },
  faq: {
    eyebrow: "Questions?",
    title: "Frequently asked questions",
    text: "Everything you need to know before you buy. Can't find the answer? Our team is one click away.",
    items: [
      {
        q: "How are your cars inspected?",
        a: "Every car goes through a check of more than 140 points: mechanics, bodywork and electronics. You get a detailed condition report with photos of any imperfections, the service history and verified mileage.",
      },
      {
        q: "Can I finance without a deposit?",
        a: "Yes, depending on your profile. A deposit does improve your terms and lowers your monthly payments.",
      },
      {
        q: "How long does a financing decision take?",
        a: "An agreement in principle within 48 working hours of receiving your complete file. Pre-approval is free and with no commitment.",
      },
      {
        q: "Can you take my current car in part exchange?",
        a: "Yes. Free valuation in 2 minutes, an inspection at your home and a firm offer within 24h. You're paid by bank transfer, or the amount comes off your next car.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No. The price shown is the price you pay. Lien check, registration transfer and paperwork are all included, with no nasty surprises.",
      },
    ],
  },
  faqPage: {
    metaTitle: "FAQ",
    metaDescription: "Buying, inspection, financing, selling your car, paperwork: answers to the most common questions about MoziMotors.",
    eyebrow: "FAQ",
    title: "All your questions, answered",
    aside: "Buying, financing, selling, paperwork: everything you need to know before you start with MoziMotors.",
    ctaTitle: "Can't find your answer?",
    ctaText: "Our team replies quickly by phone, WhatsApp or email.",
    groups: [
      { title: "Buying", items: [
        { q: "How are your cars inspected?", a: "Every car goes through a 140+ point check: mechanics, bodywork, suspension and electronics. You get an expert report with photos, the service history and verified mileage." },
        { q: "Can I test drive the car before buying?", a: "Yes. You can take a test drive from the showroom, with an advisor who answers your questions." },
        { q: "Is the listed price negotiable?", a: "Our prices are displayed and justified based on the market and the car's actual condition. Your advisor explains how they are built." },
        { q: "Do you deliver anywhere in Morocco?", a: "Yes, delivery is available anywhere in Morocco. Contact us for the details for your city." }
      ] },
      { title: "Financing", items: [
        { q: "Can I finance with no down payment?", a: "Yes, depending on your profile. A down payment does improve your terms and lowers your monthly payments." },
        { q: "How long for a financing answer?", a: "An answer in principle within 48 working hours of receiving the complete file. Pre-approval is free and non-binding." },
        { q: "Which documents do I need?", a: "An ID, proof of address and proof of income. Your advisor confirms the exact list for your situation." }
      ] },
      { title: "Selling", items: [
        { q: "Can you take my current car?", a: "Yes. Free estimate in 2 minutes, inspection at the showroom or at your home, and a firm offer within 24h. You are paid by bank transfer, or the amount is deducted from your next car." },
        { q: "Is the estimate paid?", a: "No. The estimate and the inspection are free and non-binding." },
        { q: "How do I get paid?", a: "By secure bank transfer, at signing." }
      ] },
      { title: "Paperwork & guarantees", items: [
        { q: "Are there any hidden fees?", a: "No. The displayed price is the price you pay. The lien check, registration transfer and paperwork are included, with no surprises." },
        { q: "Do you check the car isn't encumbered?", a: "Yes. We run a lien check with NARSA and verify the registration document and history before every sale." },
        { q: "Who handles registration and insurance?", a: "We do. We take care of the formalities until you get the keys." }
      ] },
    ],
  },
  guides: {
    eyebrow: "Guides",
    title: "Our advice for buying well",
    link: "All our services",
    author: "MoziMotors team",
    meta: "Guide",
    items: [
      { tag: "Buying", title: "Buying a used car: price, inspection report and test drive" },
      { tag: "Selling", title: "Selling your car in 24h: valuation, inspection and payment" },
      { tag: "Inspection", title: "Our 140 inspection points, explained one by one" },
    ],
  },
  footer: {
    newsletterTitle: "Get new arrivals first",
    newsletterText: "A WhatsApp message when a car that suits you arrives. No spam.",
    newsletterPlaceholder: "Your WhatsApp number",
    newsletterSubmit: "Sign up",
    newsletterDone: "Done — we'll let you know as soon as a car arrives.",
    newsletterError: "Invalid number, please try again.",
    about:
      "The simplest and safest way to buy or sell a used car in Morocco. Inspection, financing and paperwork: we take care of everything.",
    homeAria: "MoziMotors — home",
    buyTitle: "Buy",
    buyLinks: ["All cars", "SUVs", "Sedans", "Hybrid & electric", "Under 150,000 MAD"],
    servicesTitle: "Services",
    servicesLinks: ["Sell my car", "140-point inspection", "Contact", "FAQ"],
    contactTitle: "Contact us",
    copyright: "© {year} MoziMotors. All rights reserved.",
    bottomNav: "Footer links",
  },
  buy: {
    metaTitle: "Certified used cars",
    metaDescription: "All our inspected used cars, available with financing and delivery anywhere in Morocco.",
    title: "Used cars",
    titleBody: "Used cars: {body}",
    eyebrow: pl({ one: "{n} car available", other: "{n} cars available" }),
    aside: "Inspected on 140+ points, prices on display, financing available.",
    results: pl({ one: "result", other: "results" }),
    emptyTitle: "No cars match your search",
    emptyText: "Widen your criteria or leave us your search: we'll let you know as soon as a matching car arrives.",
    reset: "Reset",
    createAlert: "Create an alert",
  },
  filters: {
    label: "Filters",
    types: { "non-certifie": "Not certified", certifie: "Certified", financable: "Financeable", "sans-imperfection": "No imperfections" },
    dispo: { showroom: "At the MoziMotors showroom", particulier: "Private sellers" },
    sections: {
      type: "Listing type", dispo: "Availability", brandModel: "Make / Model", price: "Price", city: "City",
      year: "Year", km: "Mileage", fuel: "Fuel", gearbox: "Gearbox", body: "Body type",
    },
    brandSearch: "Search a make or model",
    citySearch: "Search a city",
    noBrand: "No make found.",
    noCity: "No city found.",
    showModels: "Show {brand} models",
    hideModels: "Hide {brand} models",
    priceUnder: "Under {a}",
    priceBetween: "{a} – {b}",
    priceOver: "Over {a}",
    kmUnder: "Under {km}",
    range: "Set a range",
    min: "Min",
    max: "Max",
    active: pl({ one: "{n} active filter", other: "{n} active filters" }),
    clearAll: "Clear all",
    showResults: pl({ one: "Show {n} result", other: "Show {n} results" }),
    search: "Search",
    searchPlaceholder: "Search (e.g. Golf, Tucson…)",
    sort: "Sort",
    sortOptions: { recent: "Newest", "price-asc": "Price: low to high", "price-desc": "Price: high to low", "km-asc": "Mileage" },
  },
  car: {
    metaDescription: "{car} {year}, {km}, {fuel}, {city}. Inspected and certified by MoziMotors.",
    breadcrumb: "Breadcrumb",
    featureGroups: { multimedia: "Multimedia", confort: "Comfort", securite: "Safety", exterieur: "Exterior" },
    specs: {
      brand: "Make", model: "Model", version: "Trim", year: "Year", mileage: "Mileage", fuel: "Fuel",
      gearbox: "Gearbox", body: "Body type", drivetrain: "Drivetrain", fiscalPower: "Tax horsepower", cylinders: "Cylinders",
      doors: "Doors", seats: "Seats", owners: "Owners", origin: "Origin", city: "City", negotiable: "Negotiable price",
    },
    fiscalPowerValue: "{n} CV",
    yes: "Yes",
    no: "No",
    whyTitle: "Why this car?",
    highlights: {
      inspected: { t: "140+ point inspection", d: "A full check by our experts before it goes on sale." },
      lowKm: { t: "Low mileage", d: "Only {km} on the clock." },
      priceDrop: { t: "Price reduced", d: "−{amount} from the original price." },
      noDefects: { t: "No imperfections", d: "No cosmetic defects found during the inspection." },
      firstHand: { t: "One owner", d: "A single owner since first registration." },
      lienCheck: { t: "Lien check", d: "Verified free of any lien with NARSA." },
    },
    conditionEyebrow: "Vehicle condition",
    conditionDefault: "Very good condition",
    imperfections: pl({ one: "{n} imperfection noted in the report.", other: "{n} imperfections noted in the report." }),
    noImperfections: "No imperfections reported.",
    report: "Inspection report",
    reportOnRequest: "Report available on request",
    checks: ["No major accident", "Verified mileage", "Service history"],
    overview: "Vehicle overview",
    featuresTitle: "Features",
    featuresUi: { search: "Search a feature", summary: "Summary", seeAll: "See all features", seeLess: "See less", noResults: "No feature found." },
    equipment: "Equipment",
    description: "Description",
    simulate: "Estimate your monthly payment",
    visitUs: "Come and see us",
    mapTitle: "Map — {address}",
    address: "Address",
    hours: "Opening hours",
    phone: "Phone",
    directions: "Directions",
    similarEyebrow: "Our stock",
    similarTitle: "Similar cars",
    seeAll: "See all",
    financeable: "Financeable",
    privateSeller: "Private seller",
    seeReport: "See the full inspection report",
    seeCondition: "See the vehicle's condition",
  },
  carActions: {
    share: "Share this car",
    linkCopied: "Link copied",
    book: "Book a visit",
    whatsapp: "WhatsApp",
    reference: "Ref. {ref}",
    copyReference: "Copy reference {ref}",
    referenceCopied: "Reference copied",
    waMessage: "Hello, I'm interested in the {car} (ref. {ref}).",
    rdvTitle: "Book a visit",
    rdvSubmit: "Confirm my visit",
    rdvSuccess: "Thank you! An advisor will call you very soon to confirm your visit.",
    slotLabel: "When would you like to come?",
    slots: ["As soon as possible", "On a weekday", "On Saturday"],
  },
  gallery: {
    all: "All",
    categories: {
      exterieur: "Exterior", interieur: "Interior", moteur: "Engine", "tableau-de-bord": "Dashboard", pneus: "Tyres", imperfections: "Imperfections",
    },
    photos: pl({ one: "{n} photo", other: "{n} photos" }),
    prev: "Previous photo",
    next: "Next photo",
    category: "Photo category",
    categories_label: "Photo categories",
    showPhoto: "Show photo {n}",
    thumb: "Photo {n} — {category}",
    fullscreen: "Full screen",
  },
  loan: {
    deposit: "Down payment",
    duration: "Term",
    durationGroup: "Term in months",
    months: "{n} months",
    rate: "Annual rate",
    ratePct: "{rate}%",
    estimate: "Estimated monthly payment",
    financedTotal: "{financed} financed · {total} in total",
    disclaimer: "Indicative simulation at a {rate}% rate, excluding insurance. Subject to approval of your application.",
  },
  leadForm: {
    name: "Full name",
    phone: "Phone",
    phonePlaceholder: "06 00 00 00 00",
    email: "Email",
    message: "Message",
    choose: "Choose…",
    send: "Send",
    sentTitle: "Request sent",
    success: "Thank you! An advisor will call you back very soon.",
    error: "Something went wrong. Please try again or give us a call.",
    privacy: "Your details are only used to handle your request.",
  },
  why: {
    metaTitle: "Why MoziMotors",
    metaDescription: "A 140+ point inspection, an inspection report, financing and paperwork included: the new way to buy a used car in Morocco.",
    eyebrow: "Why us",
    title: "Used cars, with the guarantees of new",
    lead: "We rethought buying and selling used cars around one simple idea: total transparency.",
    text: "Every car goes through an inspection of more than 140 points before it goes on sale, backed by a photo inspection report. The price is shown and justified, and we handle the financing and the paperwork, right through to delivery anywhere in Morocco.",
    statLabel: "inspection points",
    mosaicAlt: ["Car inspected by MoziMotors", "Technical check in the workshop"],
    inspectionEyebrow: "Inspection",
    inspectionTitle: "What our experts check",
    inspection: [
      { t: "Engine & gearbox", d: "Leaks, noises, clutch, gear changes, electronic diagnostics." },
      { t: "Bodywork", d: "Paint thickness, panel alignment, signs of impact or repair." },
      { t: "Running gear", d: "Tyres, brakes, shock absorbers, steering and alignment." },
      { t: "Interior & electronics", d: "Equipment, multimedia, air conditioning, warning lights and sensors." },
      { t: "Road test", d: "Handling, braking, road holding and comfort at different speeds." },
      { t: "Documents", d: "Registration, service history, mileage and administrative status." },
    ],
    compareEyebrow: "Comparison",
    compareTitle: "MoziMotors vs. classified ads",
    compareThem: "Classifieds",
    compare: [
      "140+ point technical inspection",
      "Inspection report with photos",
      "Lien check (NARSA)",
      "Price shown and justified",
      "Built-in financing",
      "Paperwork taken care of",
      "Delivery anywhere in Morocco",
    ],
    labelEyebrow: "The MoziMotors label",
    labelTitle: "A MoziMotors car is a car you can trust",
    pillars: [
      { v: "140+", t: "inspection points", d: "Engine, bodywork, suspension, electronics: nothing is left to chance." },
      { v: "Test", t: "drive before you buy", d: "Get behind the wheel, ask your questions, decide without pressure." },
      { v: "Easy", t: "financing", d: "A solution that fits your budget, with a quick answer." },
    ],
    adminEyebrow: "Administrative checks",
    adminTitle: "No fraud, no needless middlemen",
    adminText: "Before every sale we check the car's file so you get no unpleasant surprises after buying.",
    adminBullets: [
      "Lien check with NARSA",
      "Registration document and vehicle history verified",
      "Vehicle's financial status checked and cleared",
    ],
    supportEyebrow: "A to Z",
    supportTitle: "End-to-end support",
    support: [
      { t: "The listing", d: "Inspection, photos, expert report and a justified price: a complete, reliable listing." },
      { t: "The sale", d: "Test drive, negotiation, financing and secure payment, with a dedicated advisor." },
      { t: "The transfer", d: "Registration, insurance and paperwork handled until you get the keys." },
    ],
    perksEyebrow: "Two advantages",
    perksTitle: "Buy with peace of mind, from first test drive to financing",
    perks: [
      { t: "Guided test drive", d: "An expert presents the car and answers all your questions during the drive." },
      { t: "Tailored financing", d: "Simulate your monthly payment and get a quick answer, with no hidden fees." },
    ],
  },
  contact: {
    metaTitle: "Contact",
    metaDescription: "Contact the MoziMotors team by phone, WhatsApp, email or at the showroom.",
    eyebrow: "We reply fast",
    title: "Let's talk about your plans",
    aside: "Buying, selling, financing or just a question: our team gets back to you quickly.",
    formEyebrow: "Write to us",
    formTitle: "How can we help?",
    formText: "Leave us your details and your request: an advisor will call you back the same day.",
    subject: "Subject",
    subjects: ["Buying a car", "Selling my car", "Financing", "Partnership", "Other"],
    visitEyebrow: "Visit or call",
    visitTitle: "No appointment needed",
    visitText: "Drop by the showroom during opening hours, or give us a call: we'll get the car you're interested in ready.",
    address: "Address",
    contact: "Contact",
    hours: "Opening hours",
  },
  sell: {
    metaTitle: "Sell my car — free inspection, firm offer within 24h",
    metaDescription: "Sell your car at the right price: free 140+ point inspection, a firm offer within 24h, secure payment and paperwork included.",
    eyebrow: "Sell",
    title: "Sell your car at the best price.",
    text: "Free inspection, a firm offer within 24h, secure payment — no commitment.",
    heroNote: "Free · No commitment · Firm offer within 24h",
    heroAlt: "Car for sale at MoziMotors",
    stats: ["points checked", "for your firm offer", "inspection fee", "to submit your request"],
    stepsEyebrow: "How it works",
    stepsTitle: "Sell in 3 steps",
    start: "Get started",
    steps: [
      { t: "Describe your car", d: "City, contact details, make, model, mileage: 2 minutes is all it takes." },
      { t: "We schedule the inspection", d: "At the showroom or at your home, on the day and time slot you choose." },
      { t: "Get a firm offer", d: "Within 24h of the inspection. You're paid by bank transfer when you sign." },
    ],
    formulasEyebrow: "Sell with MoziMotors",
    formulasTitle: "Two options, one goal: the best price",
    recommended: "Recommended",
    formulas: [
      {
        tag: "Instant buyout",
        title: "MoziMotors buys your car",
        text: "Ideal if you want to sell fast, without waiting for a buyer or handling viewings.",
        points: ["Firm offer within 24h", "Paid by bank transfer when you sign", "Transfer and paperwork handled by us"],
      },
      {
        tag: "Assisted sale",
        title: "We sell your car for you",
        text: "Your car inspected, photographed and listed. Our team handles the buyers and negotiates the best price.",
        points: ["The best price for your car", "An inspection report that reassures buyers", "Zero paperwork for you"],
      },
    ],
    inspectionEyebrow: "140+ point inspection",
    inspectionTitle: "Why the inspection changes everything",
    inspectionCta: "Book an inspection",
    inspectionText: "Buyers trust an inspected car: it sells faster, and at the right price.",
    inspection: [
      { t: "Road test", d: "Handling, braking and road holding." },
      { t: "Electronic diagnostics", d: "Reading the ECUs and warning lights." },
      { t: "Bodywork & paint", d: "Paint thickness, signs of impact or repair." },
      { t: "Mechanics & running gear", d: "Engine, gearbox, brakes, tyres, steering." },
      { t: "Interior & equipment", d: "Multimedia, air conditioning, sensors." },
      { t: "Detailed report", d: "A complete report that reassures the buyer." },
    ],
    prepareEyebrow: "Prepare your sale",
    prepareTitle: "We're with you every step of the way",
    step: "Step {n}",
    docsTitle: "What to prepare",
    docsText: "Gather these documents for a quick, hassle-free sale.",
    docs: ["Vehicle registration", "Service book", "Spare key", "Details of any outstanding loan"],
    docsNote: "Don't worry: our team will help you gather the rest.",
    whereTitle: "Where are we?",
    showroomInspection: "Inspection at the showroom",
    directions: "Directions",
    homeInspection: "Inspection at your home",
    cities: pl({ one: "{n} city", other: "{n} cities" }),
    soon: "Coming soon.",
    cityNotListed: "Your city isn't listed? You can still sell: an advisor will call you back.",
    faqEyebrow: "Sell",
    faqTitle: "Your questions about selling",
    faqText: "Inspection, offer, payment: everything you need to know before selling your car with MoziMotors.",
    faq: [
      { q: "Is the inspection really free?", a: "Yes. The request takes 2 minutes, and the 140+ point inspection is free with no obligation to sell." },
      { q: "Where does the inspection take place?", a: "At the MoziMotors showroom or at your home in the cities we cover, Monday to Saturday. You pick the day and time slot (morning or afternoon) in the form." },
      { q: "My city isn't covered — can I still sell?", a: "Yes. Send your request: an advisor will call you back with the best option, such as an inspection at the showroom." },
      { q: "How soon will I get an offer?", a: "You get a firm offer within 24h of the inspection. You then choose between the instant buyout and the assisted sale." },
      { q: "How and when am I paid?", a: "By bank transfer when you sign. We handle the registration transfer and all the paperwork: there's nothing else for you to do." },
    ],
    ctaEyebrow: "Get started",
    ctaTitle: "Ready to sell your car in 2 minutes?",
    ctaText: "Free inspection, a firm offer within 24h, secure payment.",
  },
  sellStart: {
    chooseCity: "Choose your city",
  },
  sellWizard: {
    metaTitle: "Sell my car — free inspection request",
    metaDescription: "Describe your car in 2 minutes and pick your free inspection slot. Firm offer within 24h.",
    step: "Step {n} of 4",
    done: "Done",
    prevStep: "Previous step",
    heads: {
      city: { t: "Where is your car?", s: "We'll check whether our experts cover your city." },
      contact: { t: "Your details", s: "So we can help you sell your car." },
      vehicle: { t: "Describe your car", s: "A few details to prepare your free inspection." },
      slot: { t: "Choose your slot", s: "Your preferred time for the in-person inspection of your car." },
      last: { t: "Last step", s: "An advisor will call you back to arrange the sale." },
    },
    doneTitle: "Request sent",
    doneSubtitle: "Thank you! Your request has been received.",
    doneWithDay: "Your inspection request for {day} has been received!",
    doneNoDay: "Your sale request has been received!",
    doneText: "A MoziMotors advisor will contact you shortly to confirm the exact time and arrange the inspection of your car with one of our experts.",
    bringTitle: "Bring on the day of the inspection:",
    bringShort: "Bring:",
    bring: ["Vehicle registration", "Service book", "Spare key"],
    backHome: "Back to home",
    seeCars: "Browse our cars",
    sellAnother: "Sell another car",
    resumed: "We've restored your request in progress.",
    restart: "Start over",
    citySearch: "Search your city…",
    citySearchLabel: "Search your city",
    cities: "Cities",
    otherCity: "Other city",
    covShowroom: "Your city has the MoziMotors showroom: free inspection at the showroom.",
    covHome: "Free home inspection available in your city.",
    covNone: "No inspections in your city yet — you can still sell with us: an advisor will call you back.",
    continue: "Continue",
    namePlaceholder: "Your name",
    phoneError: "Format: 06XXXXXXXX or +2126XXXXXXXX",
    emailOptional: "Email (optional)",
    emailPlaceholder: "you@example.com",
    emailError: "Invalid email address.",
    plate: "Licence plate (optional)",
    plateSerial: "Serial number",
    plateLetter: "Letter",
    plateRegion: "Region",
    plateRegionLabel: "Region code",
    brand: "Make",
    otherBrand: "Other",
    model: "Model",
    modelPlaceholder: "E.g. 3008, Duster…",
    year: "Year",
    version: "Trim / version",
    versionPlaceholder: "I don't know",
    fuel: "Fuel",
    gearbox: "Gearbox",
    gearboxShort: "Gearbox",
    mileage: "Mileage",
    mileagePlaceholder: "E.g. 85,000",
    condition: "Overall condition",
    conditions: {
      excellent: { label: "Excellent", hint: "No visible defects" },
      bon: { label: "Good", hint: "Some signs of wear" },
      moyen: { label: "Fair", hint: "Defects or repairs needed" },
    },
    owner: "I'm the registered owner",
    documents: "Documents available (optional)",
    docs: { "Carte grise": "Registration", "Carnet d'entretien": "Service book", "Double des clés": "Spare key", Procuration: "Power of attorney" },
    requiredHint: "Please complete the fields marked with *.",
    place: "Inspection location",
    atShowroom: "At the showroom",
    atHome: "At your home",
    chooseDay: "Choose a day",
    slot: "Time slot",
    morning: "Morning",
    afternoon: "Afternoon",
    morningHours: "9am – 1pm",
    afternoonHours: "2pm – 7pm",
    notCovered: "Our experts don't cover {city} yet. Send your request: an advisor will call you back with the best option (inspection at our {showroom} showroom or a remote sale).",
    yourCity: "your city",
    submit: "Send my request",
    footnote: "Free and with no commitment. Your details are only used to handle your request.",
    error: "Sending failed. Check your details and try again, or give us a call.",
  },
  notFound: {
    title: "This page hit the road without us.",
    text: "The car may have already found a new owner.",
  },
  legal: {
    "terms": "Terms & conditions",
    "privacy": "Privacy policy",
    "cookies": "Cookies",
    "manage": "Manage cookies",
    "updated": "Last updated: September 29, 2026",
    "contactLead": "Questions about this document? Write to us at",
    "banner": {
      "title": "We respect your privacy",
      "text": "We use cookies to run the site, measure its audience and improve your experience. You choose what you accept.",
      "accept": "Accept all",
      "refuse": "Refuse all",
      "customize": "Customize",
      "learn": "Learn more"
    },
    "manager": {
      "title": "Manage cookies",
      "text": "Choose which cookie categories you allow. You can change this at any time from the footer.",
      "save": "Save my choices",
      "acceptAll": "Accept all",
      "refuseAll": "Refuse all",
      "close": "Close",
      "alwaysOn": "Always on",
      "cats": [
        {
          "name": "Essential",
          "text": "Required for the site to work: language, security, remembering your cookie choice."
        },
        {
          "name": "Analytics",
          "text": "Help us understand, in aggregate, which pages are useful so we can improve the site."
        },
        {
          "name": "Marketing",
          "text": "Let us show relevant ads and measure how well they perform."
        }
      ]
    },
    "docs": {
      "terms": {
        "metaTitle": "Terms & conditions",
        "metaDescription": "The rules for using the MoziMotors website and our used-car buying and selling services.",
        "eyebrow": "Legal",
        "title": "Terms and conditions of use",
        "intro": "These terms govern the use of the MoziMotors website and our used-car buying and selling services in Morocco. By using the site, you accept them.",
        "sections": [
          {
            "h": "1. Our service",
            "p": [
              "MoziMotors sells inspected used cars and buys vehicles from individuals, after an inspection and a firm offer.",
              "Information on the site (photos, prices, mileage, equipment) is provided with great care, but may change until a sale is concluded."
            ]
          },
          {
            "h": "2. Buying a vehicle",
            "p": [
              "Prices are shown in Moroccan dirhams (MAD). A vehicle is reserved only once our team confirms it and any deposit is paid.",
              "Every vehicle is sold with its inspection report. We encourage you to read it and test-drive the car before committing."
            ]
          },
          {
            "h": "3. Selling your vehicle",
            "p": [
              "The online request commits neither you nor MoziMotors. The inspection is free; afterwards we give you a firm offer valid for 24 hours.",
              "You must own the vehicle or hold a mandate, and give us accurate information. Payment is made by bank transfer at signing."
            ]
          },
          {
            "h": "4. Financing",
            "p": [
              "Monthly payment simulations are indicative and are not a credit offer. Any final offer is subject to approval by our partner lender."
            ]
          },
          {
            "h": "5. Liability",
            "p": [
              "We do our best to keep the site available and accurate, but cannot guarantee it will be free of interruption or error. We are not liable for indirect damage arising from use of the site."
            ]
          },
          {
            "h": "6. Intellectual property",
            "p": [
              "The site's texts, photos, logos and graphics belong to MoziMotors or their authors. Reproduction without written permission is prohibited."
            ]
          },
          {
            "h": "7. Governing law",
            "p": [
              "These terms are governed by Moroccan law. In case of a dispute we will first seek an amicable solution; failing that, the competent Moroccan courts will hear the matter."
            ]
          }
        ]
      },
      "privacy": {
        "metaTitle": "Privacy policy",
        "metaDescription": "What personal data MoziMotors collects, why, and how to exercise your rights.",
        "eyebrow": "Legal",
        "title": "Privacy policy",
        "intro": "We collect the minimum data needed to reply to you and process your requests. This page explains what, why, and how to stay in control.",
        "sections": [
          {
            "h": "1. Data we collect",
            "p": [
              "When you fill in a form (selling your car, contact, arrival alert) we receive what you enter: name, phone or WhatsApp number, city, details about your vehicle.",
              "The site also records technical data (pages visited, device type) if you accept analytics cookies."
            ]
          },
          {
            "h": "2. How we use it",
            "p": [
              "We use your data to answer your requests, schedule an inspection, give you an offer, tell you when a matching car arrives and improve our services.",
              "We never sell your personal data."
            ]
          },
          {
            "h": "3. Sharing",
            "p": [
              "Your data is available only to the MoziMotors team and to strictly necessary providers (hosting, messaging, financing if you ask for it), all bound by confidentiality."
            ]
          },
          {
            "h": "4. Retention",
            "p": [
              "We keep your data as long as needed to handle your request, then for the period required by our legal obligations. You can ask us to delete it at any time."
            ]
          },
          {
            "h": "5. Your rights",
            "p": [
              "Under Moroccan law 09-08 on the protection of individuals with regard to the processing of personal data, you have the right to access, rectify and object.",
              "To exercise them, contact us stating the purpose of your request."
            ]
          },
          {
            "h": "6. Security",
            "p": [
              "We apply reasonable technical and organisational measures to protect your data against unauthorised access, loss or alteration."
            ]
          }
        ]
      },
      "cookies": {
        "metaTitle": "Cookie policy",
        "metaDescription": "The cookies MoziMotors uses, what they are for and how to manage them.",
        "eyebrow": "Legal",
        "title": "Cookie policy",
        "intro": "A cookie is a small file saved on your device when you visit a site. Here is which ones we use and how to control them.",
        "sections": [
          {
            "h": "1. Essential cookies",
            "p": [
              "They are needed for the site to work: chosen language, security, remembering your cookie preferences. They cannot be turned off."
            ]
          },
          {
            "h": "2. Analytics",
            "p": [
              "These cookies tell us, in aggregate, which pages are viewed and how the site is used. They are set only with your consent."
            ]
          },
          {
            "h": "3. Marketing",
            "p": [
              "They are used to show relevant ads and measure their results. They are set only with your consent."
            ]
          },
          {
            "h": "4. Managing your choices",
            "p": [
              "You can change your consent at any time with the \"Manage cookies\" link at the bottom of every page. You can also delete cookies in your browser settings.",
              "Your choice is kept on your device for 12 months."
            ]
          }
        ]
      }
    }
  },
  whatsappFab: "Message us on WhatsApp",
};
