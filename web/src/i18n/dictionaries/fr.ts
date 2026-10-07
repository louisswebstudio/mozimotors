/**
 * French dictionary — the reference: every other locale must provide exactly these keys
 * (en.ts / ar.ts are typed as `Dict`, so a missing or extra key fails the type-check).
 * Plain strings only (they're sent to the browser); use {placeholders} filled by fmt(),
 * and pl() objects for counts (Intl plural rules pick the form, incl. Arabic's six).
 * Non-breaking spaces ( ) before « ? ! : ; » keep French punctuation off new lines.
 */
import type { BodyType, Fuel, Gearbox, PhotoCategory } from "@/lib/types";

export type Plural = { other: string; zero?: string; one?: string; two?: string; few?: string; many?: string };
export const pl = (forms: Plural): Plural => forms;

export const fr = {
  meta: {
    title: "MoziMotors — Achetez ou vendez votre voiture d'occasion au Maroc",
    titleTemplate: "%s | MoziMotors",
    description:
      "Voitures d'occasion inspectées sur 140+ points, financement en ligne et reprise de votre véhicule sous 24h. Partout au Maroc.",
  },
  common: {
    priceFormat: "{n} DH",
    currency: "DH",
    perMonth: "/mois",
    perMonthFull: "{amount}/mois",
    from: "dès",
    or: "ou",
    cars: pl({ one: "{n} voiture", other: "{n} voitures" }),
    close: "Fermer",
    seeCars: "Voir les voitures",
    seeAllCars: "Voir toutes les voitures",
    sellMyCar: "Vendre ma voiture",
    estimateMyCar: "Estimer ma voiture",
    contactUs: "Nous contacter",
    whyUs: "Pourquoi MoziMotors",
    certified: "Certifiée",
    used: "Occasion",
    km: "{n} km",
  },
  nav: {
    label: "Navigation principale",
    home: "Accueil",
    buy: "Acheter",
    sell: "Vendre",
    why: "Pourquoi nous",
    contact: "Contact",
    homeAria: "MoziMotors, accueil",
    searchPlaceholder: "Essayez « Duster » ou « SUV »",
    searchLabel: "Rechercher une voiture",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    showShortcuts: "Afficher les raccourcis {label}",
    hideShortcuts: "Masquer les raccourcis {label}",
    contactTitle: "Nous contacter",
  },
  langs: {
    choose: "Choisir la langue",
    fr: "Français",
    en: "English",
    ar: "العربية",
  },
  buyMenu: {
    bodies: "Carrosserie",
    budget: "Budget",
    brands: "Marques",
    budgetHint: "La barre indique la part du stock couverte.",
    under: "Moins de {amount}",
    trust: ["Inspectées sur 140+ points", "Financement en ligne", "Livraison partout au Maroc"],
    seeAll: "Voir les {cars}",
  },
  vehicle: {
    body: {
      suv: "SUV", berline: "Berline", break: "Break", citadine: "Citadine", compacte: "Compacte", monospace: "Monospace",
      coupe: "Coupé", cabriolet: "Cabriolet", pickup: "Pick-up", utilitaire: "Utilitaire",
    } satisfies Record<BodyType, string>,
    fuel: { essence: "Essence", diesel: "Diesel", hybride: "Hybride", electrique: "Électrique" } satisfies Record<Fuel, string>,
    gearbox: { automatique: "Automatique", manuelle: "Manuelle" } satisfies Record<Gearbox, string>,
    gearboxShort: { automatique: "Auto", manuelle: "Manuelle" } satisfies Record<Gearbox, string>,
    owners: pl({ one: "1ère main", other: "{n}ème main" }),
  },
  card: {
    orFrom: "ou dès",
    details: "Voir le détail",
  },
  hero: {
    imageAlt: "Berline sombre garée face aux montagnes au lever du soleil",
    eyebrow: pl({ one: "{n} voiture prête à rouler", other: "{n} voitures prêtes à rouler" }),
    title: "La voiture d'occasion, sans le stress.",
    text: "Achetez une voiture certifiée ou vendez la vôtre en 24h. Prix justes, rapport d'expertise complet et accompagnement de A à Z, partout au Maroc.",
  },
  bodyCarousel: {
    title: "Trouvez votre voiture par carrosserie",
    types: ["SUV & Pick-up", "Berline", "Break", "Citadine", "Monospace", "Coupé", "Cabriolet", "Utilitaire"],
    prev: "Types précédents",
    next: "Types suivants",
  },
  featured: {
    eyebrow: "Sélection de la semaine",
    title: "Des voitures inspectées, prêtes à rouler",
    prev: "Voiture précédente",
    next: "Voiture suivante",
  },
  brands: {
    eyebrow: "Marques",
    title: "Parcourir par marque",
    link: "Voir tout le stock",
  },
  banners: [
    {
      imageAlt: "Berline électrique grise de profil devant une ville",
      title: "Vous cherchez votre prochaine voiture ?",
      text: "Des voitures inspectées sur 140+ points, prix affichés, sans frais cachés.",
      cta: "Voir les voitures",
    },
    {
      imageAlt: "Break bleu roulant devant des immeubles de bureaux",
      title: "Combien vaut votre voiture ?",
      text: "Estimation gratuite en 2 minutes et offre ferme sous 24h. Payé par virement.",
      cta: "Estimer ma voiture",
    },
  ],
  how: {
    eyebrow: "Comment ça marche",
    title: "De la recherche à la route, en quatre étapes",
    text: "Pas de pression, pas de jargon. Acheter une voiture d'occasion devrait toujours être aussi simple.",
    teamLabel: "Un conseiller dédié",
    steps: [
      { title: "Choisissez", text: "Parcourez nos voitures inspectées, avec prix affiché, photos HD et rapport d'expertise." },
      { title: "Financez", text: "Pré-approbation en ligne en quelques minutes auprès de nos partenaires, jusqu'à 84 mois." },
      { title: "Réservez", text: "Réservez en ligne, faites reprendre votre voiture actuelle et suivez votre dossier avec un conseiller." },
      { title: "Roulez", text: "Récupérez les clés au showroom ou faites-vous livrer partout au Maroc. Démarches incluses." },
    ],
  },
  financeTeaser: {
    title: "Votre prochaine voiture commence ici",
    bullets: [
      "Calculez votre budget en moins d'une minute",
      "Découvrez les voitures qui vous correspondent",
      "Profitez d'un financement simple, sans frais cachés",
    ],
  },
  financeWidget: {
    monthly: "Mensualité souhaitée",
    deposit: "Apport initial",
    noDeposit: "Sans apport",
    budget: "Votre budget voiture estimé",
    terms: "Sur {months} mois, taux indicatif {rate} %. Offre soumise à l'accord de l'organisme de crédit.",
    cta: "Voir les voitures dans mon budget",
  },
  trust: {
    eyebrow: "Les engagements MoziMotors",
    title: "La confiance, incluse dans le prix",
    text: "Tout ce qu'un achat d'occasion devrait toujours comprendre, sans supplément.",
    bullets: [
      "Inspection mécanique et carrosserie sur 140+ points",
      "Contrôle d'opposition auprès de la NARSA avant chaque vente",
      "Carte grise, assurance et démarches prises en charge",
    ],
    playVideo: "Lire la vidéo",
  },
  stats: {
    inspection: "Points d'inspection",
    rating: "Satisfaction clients",
    offer: "Pour une offre ferme",
    stock: "Voitures disponibles",
  },
  reviews: {
    title: "Les avis de nos clients",
    subtitle: "Des clients partout au Maroc, à l'achat comme à la vente.",
    clientIn: "Client à",
    verified: "Avis vérifié",
  },
  visit: {
    title: "Confort et performance vous attendent",
    subtitle: "Passez au showroom pour réserver votre prochaine voiture",
    officeLabel: "Showroom MoziMotors",
    callLabel: "Appelez-nous",
    emailLabel: "Envoyez un email",
    mapTitle: "Plan d'accès MoziMotors",
  },
  cta: {
    eyebrow: "Commencez maintenant",
    title: "Prêt à trouver votre prochaine voiture ?",
    text: "Parcourez toutes nos voitures inspectées ou parlez à un conseiller dès aujourd'hui.",
  },
  faq: {
    eyebrow: "Des questions ?",
    title: "Questions fréquentes",
    text: "Tout ce qu'il faut savoir avant d'acheter. Pas trouvé la réponse ? Notre équipe est à un clic.",
    items: [
      {
        q: "Comment sont inspectées vos voitures ?",
        a: "Chaque voiture passe un contrôle de plus de 140 points : mécanique, carrosserie et électronique. Vous recevez un rapport d'état détaillé avec photos des imperfections, historique d'entretien et kilométrage vérifié.",
      },
      {
        q: "Puis-je financer sans apport ?",
        a: "Oui, selon votre profil. Un apport améliore toutefois vos conditions et réduit vos mensualités.",
      },
      {
        q: "Combien de temps pour une réponse de financement ?",
        a: "Une réponse de principe sous 48h ouvrées après réception du dossier complet. La pré-approbation est gratuite et sans engagement.",
      },
      {
        q: "Pouvez-vous reprendre ma voiture actuelle ?",
        a: "Oui. Estimation gratuite en 2 minutes, inspection à domicile et offre ferme sous 24h. Vous êtes payé par virement, ou le montant est déduit de votre prochaine voiture.",
      },
      {
        q: "Y a-t-il des frais cachés ?",
        a: "Non. Le prix affiché est le prix payé. Contrôle d'opposition, mutation de carte grise et démarches sont inclus, sans mauvaise surprise.",
      },
    ],
  },
  faqPage: {
    metaTitle: "Questions fréquentes",
    metaDescription: "Achat, inspection, financement, vente de votre voiture, démarches : les réponses aux questions les plus posées sur MoziMotors.",
    eyebrow: "FAQ",
    title: "Toutes vos questions, nos réponses",
    aside: "Achat, financement, vente, démarches : tout ce qu'il faut savoir avant de vous lancer avec MoziMotors.",
    ctaTitle: "Vous ne trouvez pas votre réponse ?",
    ctaText: "Notre équipe vous répond rapidement par téléphone, WhatsApp ou email.",
    groups: [
      { title: "Acheter", items: [
        { q: "Comment sont inspectées vos voitures ?", a: "Chaque voiture passe un contrôle de plus de 140 points : mécanique, carrosserie, train roulant et électronique. Vous recevez un rapport d'expertise avec photos, l'historique d'entretien et le kilométrage vérifié." },
        { q: "Puis-je essayer la voiture avant d'acheter ?", a: "Oui. Vous pouvez faire un essai routier au showroom, avec un conseiller qui répond à vos questions." },
        { q: "Le prix affiché est-il négociable ?", a: "Nos prix sont affichés et justifiés d'après le marché et l'état réel de la voiture. Votre conseiller vous explique comment ils sont construits." },
        { q: "Livrez-vous partout au Maroc ?", a: "Oui, la livraison est possible partout au Maroc. Contactez-nous pour connaître les modalités selon votre ville." }
      ] },
      { title: "Financement", items: [
        { q: "Puis-je financer sans apport ?", a: "Oui, selon votre profil. Un apport améliore toutefois vos conditions et réduit vos mensualités." },
        { q: "Combien de temps pour une réponse de financement ?", a: "Une réponse de principe sous 48h ouvrées après réception du dossier complet. La pré-approbation est gratuite et sans engagement." },
        { q: "Quels documents faut-il fournir ?", a: "Une pièce d'identité, un justificatif de domicile et vos justificatifs de revenus. Votre conseiller vous confirme la liste exacte selon votre situation." }
      ] },
      { title: "Vendre", items: [
        { q: "Pouvez-vous reprendre ma voiture actuelle ?", a: "Oui. Estimation gratuite en 2 minutes, inspection au showroom ou à domicile et offre ferme sous 24h. Vous êtes payé par virement, ou le montant est déduit de votre prochaine voiture." },
        { q: "L'estimation est-elle payante ?", a: "Non. L'estimation et l'inspection sont gratuites et sans engagement." },
        { q: "Comment suis-je payé ?", a: "Par virement bancaire sécurisé, à la signature." }
      ] },
      { title: "Démarches & garanties", items: [
        { q: "Y a-t-il des frais cachés ?", a: "Non. Le prix affiché est le prix payé. Contrôle d'opposition, mutation de carte grise et démarches sont inclus, sans mauvaise surprise." },
        { q: "Vérifiez-vous que la voiture n'est pas grevée ?", a: "Oui. Nous effectuons un contrôle d'opposition auprès de la NARSA et vérifions la carte grise et l'historique avant chaque vente." },
        { q: "Qui s'occupe de la carte grise et de l'assurance ?", a: "Nous. Nous prenons en charge les formalités jusqu'à la remise des clés." }
      ] },
    ],
  },
  guides: {
    eyebrow: "Guides",
    title: "Nos conseils pour bien acheter",
    link: "Tous nos services",
    author: "Équipe MoziMotors",
    meta: "Guide",
    items: [
      { tag: "Achat", title: "Acheter une voiture d'occasion : prix, rapport d'expertise et essai" },
      { tag: "Vente", title: "Vendre sa voiture en 24h : estimation, inspection et paiement" },
      { tag: "Inspection", title: "Nos 140 points de contrôle, expliqués un par un" },
    ],
  },
  footer: {
    newsletterTitle: "Recevez les nouveaux arrivages",
    newsletterText: "Un message WhatsApp quand une voiture qui vous correspond arrive. Pas de spam.",
    newsletterPlaceholder: "Votre numéro WhatsApp",
    newsletterSubmit: "S'inscrire",
    newsletterDone: "C'est noté, on vous prévient dès qu'une voiture arrive.",
    newsletterError: "Numéro invalide, réessayez.",
    about:
      "La façon la plus simple et la plus sûre d'acheter ou de vendre une voiture d'occasion au Maroc. Inspection, financement et démarches : on s'occupe de tout.",
    homeAria: "MoziMotors — accueil",
    buyTitle: "Acheter",
    buyLinks: ["Toutes les voitures", "SUV", "Berlines", "Hybrides & électriques", "Moins de 150 000 DH"],
    servicesTitle: "Services",
    servicesLinks: ["Vendre ma voiture", "Inspection 140 points", "Contact", "FAQ"],
    contactTitle: "Nous contacter",
    copyright: "© {year} MoziMotors. Tous droits réservés.",
    bottomNav: "Liens du pied de page",
  },
  buy: {
    metaTitle: "Voitures d'occasion certifiées",
    metaDescription: "Toutes nos voitures d'occasion inspectées, finançables et livrables partout au Maroc.",
    title: "Voitures d'occasion",
    titleBody: "{body} d'occasion",
    eyebrow: pl({ one: "{n} voiture disponible", other: "{n} voitures disponibles" }),
    aside: "Inspectées sur 140+ points, prix affichés, financement possible.",
    results: pl({ one: "résultat", other: "résultats" }),
    emptyTitle: "Aucune voiture ne correspond",
    emptyText: "Élargissez vos critères ou laissez-nous votre recherche : on vous prévient dès qu'une voiture arrive.",
    reset: "Réinitialiser",
    createAlert: "Créer une alerte",
  },
  filters: {
    label: "Filtres",
    types: { "non-certifie": "Non certifié", certifie: "Certifié", financable: "Finançable", "sans-imperfection": "Sans imperfection" },
    dispo: { showroom: "Au showroom MoziMotors", particulier: "Particuliers" },
    sections: {
      type: "Type d'annonce", dispo: "Disponibilité", brandModel: "Marque / Modèle", price: "Prix", city: "Ville",
      year: "Année", km: "Kilométrage", fuel: "Carburant", gearbox: "Boîte de vitesses", body: "Carrosserie",
    },
    brandSearch: "Rechercher une marque ou un modèle",
    citySearch: "Rechercher une ville",
    noBrand: "Aucune marque trouvée.",
    noCity: "Aucune ville trouvée.",
    showModels: "Afficher les modèles {brand}",
    hideModels: "Masquer les modèles {brand}",
    priceUnder: "Moins de {a}",
    priceBetween: "{a} – {b}",
    priceOver: "Plus de {a}",
    kmUnder: "Moins de {km}",
    range: "Définir la plage",
    min: "Min",
    max: "Max",
    active: pl({ one: "{n} filtre actif", other: "{n} filtres actifs" }),
    clearAll: "Tout effacer",
    showResults: pl({ one: "Voir {n} résultat", other: "Voir {n} résultats" }),
    search: "Rechercher",
    searchPlaceholder: "Rechercher (ex : Golf, Tucson…)",
    sort: "Trier",
    sortOptions: { recent: "Plus récentes", "price-asc": "Prix croissant", "price-desc": "Prix décroissant", "km-asc": "Kilométrage" },
  },
  car: {
    metaDescription: "{car} {year}, {km}, {fuel}, {city}. Inspectée et certifiée MoziMotors.",
    breadcrumb: "Fil d'Ariane",
    featureGroups: { multimedia: "Multimédia", confort: "Confort", securite: "Sécurité", exterieur: "Extérieur" } as Record<string, string>,
    specs: {
      brand: "Marque", model: "Modèle", version: "Version", year: "Année", mileage: "Kilométrage", fuel: "Carburant",
      gearbox: "Boîte", body: "Carrosserie", drivetrain: "Transmission", fiscalPower: "Puissance fiscale", cylinders: "Cylindres",
      doors: "Portes", seats: "Places", owners: "Mains", origin: "Origine", city: "Ville", negotiable: "Prix négociable",
    },
    fiscalPowerValue: "{n}\u00A0CV",
    yes: "Oui",
    no: "Non",
    whyTitle: "Pourquoi cette voiture\u00A0?",
    highlights: {
      inspected: { t: "Inspectée 140+ points", d: "Contrôle complet par nos experts avant mise en vente." },
      lowKm: { t: "Faible kilométrage", d: "Seulement {km} au compteur." },
      priceDrop: { t: "Prix en baisse", d: "−{amount} par rapport au prix initial." },
      noDefects: { t: "Sans imperfection", d: "Aucun défaut esthétique relevé lors de l'expertise." },
      firstHand: { t: "Première main", d: "Un seul propriétaire depuis la mise en circulation." },
      lienCheck: { t: "Contrôle d'opposition", d: "Absence de gage vérifiée auprès de la NARSA." },
    },
    conditionEyebrow: "État du véhicule",
    conditionDefault: "Très bon état",
    imperfections: pl({ one: "{n} imperfection signalée dans le rapport.", other: "{n} imperfections signalées dans le rapport." }),
    noImperfections: "Aucune imperfection signalée.",
    report: "Rapport d'expertise",
    reportOnRequest: "Rapport disponible sur demande",
    checks: ["Aucun accident majeur", "Kilométrage vérifié", "Historique d'entretien"],
    overview: "Aperçu du véhicule",
    featuresTitle: "Caractéristiques",
    featuresUi: { search: "Rechercher une caractéristique", summary: "Résumé", seeAll: "Voir toutes les caractéristiques", seeLess: "Voir moins", noResults: "Aucune caractéristique trouvée." },
    equipment: "Équipements",
    description: "Description",
    simulate: "Simulez votre mensualité",
    visitUs: "Venez nous voir",
    mapTitle: "Plan d'accès — {address}",
    address: "Adresse",
    hours: "Horaires",
    phone: "Téléphone",
    directions: "Itinéraire",
    similarEyebrow: "Notre stock",
    similarTitle: "Voitures similaires",
    seeAll: "Voir tout",
    financeable: "Finançable",
    privateSeller: "Particulier",
    seeReport: "Voir le rapport d'expertise complet",
    seeCondition: "Voir l'état du véhicule",
  },
  carActions: {
    share: "Partager cette voiture",
    linkCopied: "Lien copié",
    book: "Prendre RDV",
    whatsapp: "WhatsApp",
    reference: "Réf.\u00A0{ref}",
    copyReference: "Copier la référence {ref}",
    referenceCopied: "Référence copiée",
    waMessage: "Bonjour, je suis intéressé(e) par la {car} (réf.\u00A0{ref}).",
    rdvTitle: "Prendre rendez-vous",
    rdvSubmit: "Confirmer le rendez-vous",
    rdvSuccess: "Merci\u00A0! Un conseiller vous appelle très vite pour confirmer votre rendez-vous.",
    slotLabel: "Quand souhaitez-vous venir\u00A0?",
    slots: ["Dès que possible", "En semaine", "Le samedi"],
  },
  gallery: {
    all: "Toutes",
    categories: {
      exterieur: "Extérieur", interieur: "Intérieur", moteur: "Moteur", "tableau-de-bord": "Tableau de bord", pneus: "Pneus", imperfections: "Imperfections",
    } satisfies Record<PhotoCategory, string>,
    photos: pl({ one: "{n} photo", other: "{n} photos" }),
    prev: "Photo précédente",
    next: "Photo suivante",
    category: "Catégorie de photos",
    categories_label: "Catégories de photos",
    showPhoto: "Afficher la photo {n}",
    thumb: "Photo {n} — {category}",
    fullscreen: "Plein écran",
  },
  loan: {
    deposit: "Apport",
    duration: "Durée",
    durationGroup: "Durée en mois",
    months: "{n}\u00A0mois",
    rate: "Taux annuel",
    ratePct: "{rate}\u00A0%",
    estimate: "Mensualité estimée",
    financedTotal: "{financed} financés · {total} au total",
    disclaimer: "Simulation indicative au taux de {rate}\u00A0%, hors assurance. Sous réserve d'acceptation du dossier.",
  },
  leadForm: {
    name: "Nom complet",
    phone: "Téléphone",
    phonePlaceholder: "06 00 00 00 00",
    email: "Email",
    message: "Message",
    choose: "Choisir…",
    send: "Envoyer",
    sentTitle: "Demande envoyée",
    success: "Merci\u00A0! Un conseiller vous rappelle très vite.",
    error: "Une erreur est survenue. Réessayez ou appelez-nous.",
    privacy: "Vos données sont utilisées uniquement pour traiter votre demande.",
  },
  why: {
    metaTitle: "Pourquoi MoziMotors",
    metaDescription: "Inspection 140+ points, rapport d'expertise, financement et démarches incluses\u00A0: la nouvelle façon d'acheter une voiture d'occasion au Maroc.",
    eyebrow: "Pourquoi nous",
    title: "L'occasion, avec les garanties du neuf",
    lead: "Nous avons repensé l'achat et la vente de voitures d'occasion autour d'une idée simple\u00A0: la transparence totale.",
    text: "Chaque voiture passe une inspection de plus de 140 points avant d'être mise en vente, avec un rapport d'expertise photo à l'appui. Le prix est affiché et justifié, et nous prenons en charge le financement comme les démarches administratives, jusqu'à la livraison partout au Maroc.",
    statLabel: "points d'inspection",
    mosaicAlt: ["Voiture inspectée par MoziMotors", "Contrôle technique en atelier"],
    inspectionEyebrow: "Inspection",
    inspectionTitle: "Ce que nos experts contrôlent",
    inspection: [
      { t: "Moteur & boîte", d: "Fuites, bruits, embrayage, passage des rapports, diagnostic électronique." },
      { t: "Carrosserie", d: "Mesure de peinture, alignement, traces de choc ou de réparation." },
      { t: "Train roulant", d: "Pneus, freins, amortisseurs, direction et géométrie." },
      { t: "Intérieur & électronique", d: "Équipements, multimédia, climatisation, voyants et capteurs." },
      { t: "Essai routier", d: "Comportement, freinage, tenue de route et confort à différentes vitesses." },
      { t: "Documents", d: "Carte grise, historique d'entretien, kilométrage et situation administrative." },
    ],
    compareEyebrow: "Comparatif",
    compareTitle: "MoziMotors vs. petites annonces",
    compareThem: "Annonces",
    compare: [
      "Inspection technique 140+ points",
      "Rapport d'expertise avec photos",
      "Vérification d'opposition (NARSA)",
      "Prix affiché et justifié",
      "Financement intégré",
      "Démarches administratives prises en charge",
      "Livraison partout au Maroc",
    ],
    labelEyebrow: "Le label MoziMotors",
    labelTitle: "Une voiture MoziMotors, c'est une voiture sûre",
    pillars: [
      { v: "140+", t: "points d'inspection", d: "Moteur, carrosserie, train roulant, électronique : rien n'est laissé au hasard." },
      { v: "Essai", t: "avant l'achat", d: "Prenez le volant, posez vos questions, décidez sans pression." },
      { v: "Simple", t: "financement", d: "Une solution adaptée à votre budget, avec une réponse rapide." },
    ],
    adminEyebrow: "Contrôle administratif",
    adminTitle: "Zéro fraude, zéro intermédiaire inutile",
    adminText: "Avant chaque vente, nous vérifions le dossier de la voiture pour que vous n'ayez aucune mauvaise surprise après l'achat.",
    adminBullets: [
      "Vérification d'opposition auprès de la NARSA",
      "Contrôle de la carte grise et de l'historique du véhicule",
      "Situation financière du véhicule vérifiée et purgée",
    ],
    supportEyebrow: "De A à Z",
    supportTitle: "Un accompagnement de bout en bout",
    support: [
      { t: "La mise en ligne", d: "Inspection, photos, rapport d'expertise et prix justifié : l'annonce est complète et fiable." },
      { t: "La vente", d: "Essai, négociation, financement et paiement sécurisé, avec un conseiller dédié." },
      { t: "Le transfert", d: "Carte grise, assurance et formalités prises en charge jusqu'à la remise des clés." },
    ],
    perksEyebrow: "Deux avantages",
    perksTitle: "Acheter sereinement, du premier essai au financement",
    perks: [
      { t: "Essai accompagné", d: "Un expert vous présente la voiture et répond à toutes vos questions pendant l'essai." },
      { t: "Financement sur mesure", d: "Simulez votre mensualité et obtenez une réponse rapide, sans frais cachés." },
    ],
  },
  contact: {
    metaTitle: "Contact",
    metaDescription: "Contactez l'équipe MoziMotors par téléphone, WhatsApp, email ou au showroom.",
    eyebrow: "On vous répond vite",
    title: "Parlons de votre projet",
    aside: "Achat, vente, financement ou simple question\u00A0: notre équipe vous répond rapidement.",
    formEyebrow: "Écrivez-nous",
    formTitle: "Comment pouvons-nous vous aider\u00A0?",
    formText: "Laissez-nous vos coordonnées et votre demande\u00A0: un conseiller vous rappelle dans la journée.",
    subject: "Sujet",
    subjects: ["Acheter une voiture", "Vendre ma voiture", "Financement", "Partenariat", "Autre"],
    visitEyebrow: "Visite ou appel",
    visitTitle: "Sans rendez-vous",
    visitText: "Passez au showroom aux heures d'ouverture, ou appelez-nous\u00A0: on prépare la voiture qui vous intéresse.",
    address: "Adresse",
    contact: "Contact",
    hours: "Horaires",
  },
  sell: {
    metaTitle: "Vendre ma voiture — inspection gratuite, offre ferme sous 24h",
    metaDescription: "Vendez votre voiture au juste prix\u00A0: inspection gratuite 140+ points, offre ferme sous 24h, paiement sécurisé et démarches incluses.",
    eyebrow: "Vendre",
    title: "Vendez votre voiture au meilleur prix.",
    text: "Inspection gratuite, offre ferme sous 24h, paiement sécurisé — sans engagement.",
    heroNote: "Gratuit · Sans engagement · Offre ferme sous 24h",
    heroAlt: "Voiture en vente chez MoziMotors",
    stats: ["points contrôlés", "pour votre offre ferme", "frais d'inspection", "pour faire la demande"],
    stepsEyebrow: "Comment ça marche",
    stepsTitle: "Vendre en 3 étapes",
    start: "Commencer",
    steps: [
      { t: "Décrivez votre voiture", d: "Ville, coordonnées, marque, modèle, kilométrage\u00A0: 2 minutes suffisent." },
      { t: "On programme l'inspection", d: "Au showroom ou à domicile, le jour et le créneau de votre choix." },
      { t: "Recevez une offre ferme", d: "Sous 24h après l'inspection. Vous êtes payé par virement à la signature." },
    ],
    formulasEyebrow: "Vendre avec MoziMotors",
    formulasTitle: "Deux formules, un seul objectif\u00A0: le meilleur prix",
    recommended: "Recommandé",
    formulas: [
      {
        tag: "Rachat immédiat",
        title: "MoziMotors rachète votre voiture",
        text: "Idéal si vous voulez vendre vite, sans attendre un acheteur ni gérer les visites.",
        points: ["Offre ferme sous 24h", "Paiement par virement à la signature", "Mutation et papiers gérés par nous"],
      },
      {
        tag: "Vente accompagnée",
        title: "On vend votre voiture pour vous",
        text: "Votre voiture inspectée, photographiée et publiée. Notre équipe gère les acheteurs et négocie le meilleur prix.",
        points: ["Le meilleur prix pour votre voiture", "Rapport d'inspection qui rassure les acheteurs", "Zéro paperasse pour vous"],
      },
    ],
    inspectionEyebrow: "Inspection 140+ points",
    inspectionTitle: "Pourquoi l'inspection change tout",
    inspectionCta: "Prendre RDV d'inspection",
    inspectionText: "Les acheteurs font confiance à une voiture inspectée\u00A0: elle se vend plus vite, et au bon prix.",
    inspection: [
      { t: "Essai routier", d: "Comportement, freinage et tenue de route." },
      { t: "Diagnostic électronique", d: "Lecture des calculateurs et des voyants." },
      { t: "Carrosserie & peinture", d: "Mesure de peinture, traces de choc ou de réparation." },
      { t: "Mécanique & train roulant", d: "Moteur, boîte, freins, pneus, direction." },
      { t: "Intérieur & équipements", d: "Multimédia, climatisation, capteurs." },
      { t: "Rapport détaillé", d: "Un rapport complet qui rassure l'acheteur." },
    ],
    prepareEyebrow: "Bien préparer votre vente",
    prepareTitle: "On vous accompagne à chaque étape",
    step: "Étape {n}",
    docsTitle: "À préparer pour vendre",
    docsText: "Réunissez ces documents pour une vente rapide et sans tracas.",
    docs: ["Carte grise du véhicule", "Carnet d'entretien", "Double des clés", "Détails du crédit en cours, le cas échéant"],
    docsNote: "Pas de panique\u00A0: notre équipe vous aide à réunir le reste.",
    whereTitle: "Où sommes-nous\u00A0?",
    showroomInspection: "Inspection au showroom",
    directions: "Itinéraire",
    homeInspection: "Inspection à domicile",
    cities: pl({ one: "{n} ville", other: "{n} villes" }),
    soon: "Bientôt disponible.",
    cityNotListed: "Votre ville n'est pas listée\u00A0? Vous pouvez quand même vendre\u00A0: un conseiller vous rappelle.",
    faqEyebrow: "Vendre",
    faqTitle: "Vos questions sur la vente",
    faqText: "Inspection, offre, paiement\u00A0: tout ce qu'il faut savoir avant de vendre votre voiture avec MoziMotors.",
    faq: [
      { q: "L'inspection est-elle vraiment gratuite\u00A0?", a: "Oui. La demande prend 2 minutes, l'inspection 140+ points est gratuite et sans engagement de vendre." },
      { q: "Où se déroule l'inspection\u00A0?", a: "Au showroom MoziMotors ou à domicile dans les villes couvertes, du lundi au samedi. Vous choisissez le jour et le créneau (matin ou après-midi) dans le formulaire." },
      { q: "Ma ville n'est pas couverte, puis-je quand même vendre\u00A0?", a: "Oui. Envoyez votre demande\u00A0: un conseiller vous rappelle pour vous proposer la meilleure solution, par exemple une inspection au showroom." },
      { q: "En combien de temps reçois-je une offre\u00A0?", a: "Vous recevez une offre ferme sous 24h après l'inspection. Vous choisissez ensuite entre le rachat immédiat et la vente accompagnée." },
      { q: "Comment et quand suis-je payé\u00A0?", a: "Par virement à la signature. Nous nous occupons de la mutation et de tous les papiers\u00A0: vous n'avez rien d'autre à faire." },
    ],
    ctaEyebrow: "Commencez maintenant",
    ctaTitle: "Prêt à vendre votre voiture en 2 minutes\u00A0?",
    ctaText: "Inspection gratuite, offre ferme sous 24h, paiement sécurisé.",
  },
  sellStart: {
    chooseCity: "Choisir votre ville",
  },
  sellWizard: {
    metaTitle: "Vendre ma voiture — demande d'inspection gratuite",
    metaDescription: "Décrivez votre voiture en 2 minutes et choisissez votre créneau d'inspection gratuite. Offre ferme sous 24h.",
    step: "Étape {n} sur 4",
    done: "Terminé",
    prevStep: "Étape précédente",
    heads: {
      city: { t: "Où se trouve votre voiture\u00A0?", s: "Nous vérifions si nos experts couvrent votre ville." },
      contact: { t: "Vos coordonnées", s: "Pour vous accompagner dans la vente de votre voiture." },
      vehicle: { t: "Décrivez votre véhicule", s: "Quelques informations pour préparer votre inspection gratuite." },
      slot: { t: "Choisissez votre créneau", s: "Le créneau souhaité pour l'inspection physique de votre voiture." },
      last: { t: "Dernière étape", s: "Un conseiller vous rappelle pour organiser la vente." },
    },
    doneTitle: "Demande envoyée",
    doneSubtitle: "Merci\u00A0! Votre demande est bien enregistrée.",
    doneWithDay: "Votre demande d'inspection pour le {day} est bien enregistrée\u00A0!",
    doneNoDay: "Votre demande de vente est bien enregistrée\u00A0!",
    doneText: "Un conseiller MoziMotors vous contactera prochainement pour confirmer l'heure exacte du rendez-vous et organiser l'inspection de votre véhicule avec l'un de nos experts.",
    bringTitle: "À apporter le jour de l'inspection\u00A0:",
    bringShort: "Apporter\u00A0:",
    bring: ["Carte grise", "Carnet d'entretien", "Double des clés"],
    backHome: "Retour à l'accueil",
    seeCars: "Voir nos voitures",
    sellAnother: "Vendre une autre voiture",
    resumed: "Nous avons repris votre demande en cours.",
    restart: "Recommencer",
    citySearch: "Rechercher votre ville…",
    citySearchLabel: "Rechercher votre ville",
    cities: "Villes",
    otherCity: "Autre ville",
    covShowroom: "Votre ville dispose du showroom MoziMotors\u00A0: inspection gratuite au showroom.",
    covHome: "Inspection gratuite à domicile disponible dans votre ville.",
    covNone: "Pas encore d'inspection dans votre ville — vous pouvez quand même vendre avec nous\u00A0: un conseiller vous rappelle.",
    continue: "Continuer",
    namePlaceholder: "Votre nom",
    phoneError: "Format\u00A0: 06XXXXXXXX ou +2126XXXXXXXX",
    emailOptional: "Email (optionnel)",
    emailPlaceholder: "vous@exemple.ma",
    emailError: "Adresse email invalide.",
    plate: "Plaque d'immatriculation (optionnel)",
    plateSerial: "Numéro de série",
    plateLetter: "Lettre",
    plateRegion: "Région",
    plateRegionLabel: "Code région",
    brand: "Marque",
    otherBrand: "Autre",
    model: "Modèle",
    modelPlaceholder: "Ex\u00A0: 3008, Duster…",
    year: "Année",
    version: "Finition / version",
    versionPlaceholder: "Je ne sais pas",
    fuel: "Carburant",
    gearbox: "Boîte de vitesses",
    gearboxShort: "Boîte",
    mileage: "Kilométrage",
    mileagePlaceholder: "Ex\u00A0: 85 000",
    condition: "État général",
    conditions: {
      excellent: { label: "Excellent", hint: "Aucun défaut visible" },
      bon: { label: "Bon", hint: "Quelques traces d'usage" },
      moyen: { label: "Moyen", hint: "Défauts ou réparations à prévoir" },
    },
    owner: "Je suis propriétaire de la carte grise",
    documents: "Documents disponibles (facultatif)",
    docs: { "Carte grise": "Carte grise", "Carnet d'entretien": "Carnet d'entretien", "Double des clés": "Double des clés", Procuration: "Procuration" } as Record<string, string>,
    requiredHint: "Complétez les champs marqués d'un *.",
    place: "Lieu de l'inspection",
    atShowroom: "Au showroom",
    atHome: "À domicile",
    chooseDay: "Choisissez un jour",
    slot: "Créneau",
    morning: "Matin",
    afternoon: "Après-midi",
    morningHours: "9h – 13h",
    afternoonHours: "14h – 19h",
    notCovered: "Nos experts ne couvrent pas encore {city}. Envoyez votre demande\u00A0: un conseiller vous rappelle pour vous proposer la meilleure solution (inspection au showroom de {showroom} ou vente à distance).",
    yourCity: "votre ville",
    submit: "Envoyer ma demande",
    footnote: "Gratuit et sans engagement. Vos données servent uniquement à traiter votre demande.",
    error: "Échec de l'envoi. Vérifiez vos informations et réessayez, ou appelez-nous.",
  },
  notFound: {
    title: "Cette page a pris la route sans nous.",
    text: "La voiture a peut-être déjà trouvé preneur.",
  },
  legal: {
    "terms": "Conditions générales",
    "privacy": "Politique de confidentialité",
    "cookies": "Cookies",
    "manage": "Gérer mes cookies",
    "updated": "Dernière mise à jour : 29 septembre 2026",
    "contactLead": "Une question sur ce document ? Écrivez-nous à",
    "banner": {
      "title": "Nous respectons votre vie privée",
      "text": "Nous utilisons des cookies pour faire fonctionner le site, mesurer son audience et améliorer votre expérience. Vous choisissez ce que vous acceptez.",
      "accept": "Tout accepter",
      "refuse": "Tout refuser",
      "customize": "Personnaliser",
      "learn": "En savoir plus"
    },
    "manager": {
      "title": "Gérer mes cookies",
      "text": "Choisissez les catégories de cookies que vous autorisez. Vous pouvez modifier ce choix à tout moment depuis le pied de page.",
      "save": "Enregistrer mes choix",
      "acceptAll": "Tout accepter",
      "refuseAll": "Tout refuser",
      "close": "Fermer",
      "alwaysOn": "Toujours actif",
      "cats": [
        {
          "name": "Essentiels",
          "text": "Indispensables au fonctionnement du site : langue, sécurité, mémorisation de votre choix de cookies."
        },
        {
          "name": "Mesure d'audience",
          "text": "Nous aident à comprendre quelles pages sont utiles, de façon agrégée, pour améliorer le site."
        },
        {
          "name": "Marketing",
          "text": "Permettent de vous proposer des publicités pertinentes et d'en mesurer l'efficacité."
        }
      ]
    },
    "docs": {
      "terms": {
        "metaTitle": "Conditions générales",
        "metaDescription": "Les règles d'utilisation du site MoziMotors et de nos services d'achat et de vente de voitures d'occasion.",
        "eyebrow": "Informations légales",
        "title": "Conditions générales d'utilisation",
        "intro": "Ces conditions encadrent l'utilisation du site MoziMotors et de nos services d'achat et de vente de voitures d'occasion au Maroc. En utilisant le site, vous les acceptez.",
        "sections": [
          {
            "h": "1. Notre service",
            "p": [
              "MoziMotors propose des voitures d'occasion inspectées à la vente et rachète des véhicules à des particuliers, après inspection et remise d'une offre ferme.",
              "Les informations présentées sur le site (photos, prix, kilométrage, équipements) sont fournies avec le plus grand soin, mais peuvent évoluer jusqu'à la conclusion de la vente."
            ]
          },
          {
            "h": "2. Achat d'un véhicule",
            "p": [
              "Les prix sont affichés en dirhams marocains (DH). Un véhicule n'est réservé qu'après confirmation par notre équipe et versement éventuel d'un acompte.",
              "Chaque véhicule est vendu avec le rapport d'inspection correspondant. Nous vous invitons à le consulter et à essayer la voiture avant de vous engager."
            ]
          },
          {
            "h": "3. Vente de votre véhicule",
            "p": [
              "La demande en ligne n'engage ni vous ni MoziMotors. L'inspection est gratuite ; à son issue, nous vous remettons une offre ferme valable 24 heures.",
              "Vous devez être le propriétaire du véhicule ou disposer d'un mandat, et nous fournir des informations exactes. Le paiement est effectué par virement à la signature."
            ]
          },
          {
            "h": "4. Financement",
            "p": [
              "Les simulations de mensualités sont indicatives et ne constituent pas une offre de crédit. Toute offre définitive est soumise à l'accord de l'organisme de financement partenaire."
            ]
          },
          {
            "h": "5. Responsabilité",
            "p": [
              "Nous mettons tout en œuvre pour que le site soit disponible et exact, mais nous ne pouvons garantir l'absence d'interruption ou d'erreur. Notre responsabilité ne saurait être engagée pour un dommage indirect lié à l'usage du site."
            ]
          },
          {
            "h": "6. Propriété intellectuelle",
            "p": [
              "Les textes, photos, logos et éléments graphiques du site appartiennent à MoziMotors ou à leurs auteurs. Toute reproduction sans autorisation écrite est interdite."
            ]
          },
          {
            "h": "7. Droit applicable",
            "p": [
              "Ces conditions sont soumises au droit marocain. En cas de litige, nous chercherons d'abord une solution amiable ; à défaut, les tribunaux compétents du Maroc seront saisis."
            ]
          }
        ]
      },
      "privacy": {
        "metaTitle": "Politique de confidentialité",
        "metaDescription": "Quelles données personnelles MoziMotors collecte, pourquoi, et comment exercer vos droits.",
        "eyebrow": "Informations légales",
        "title": "Politique de confidentialité",
        "intro": "Nous collectons le minimum de données nécessaire pour vous répondre et traiter vos demandes. Cette page explique lesquelles, pourquoi, et comment garder le contrôle.",
        "sections": [
          {
            "h": "1. Données collectées",
            "p": [
              "Lorsque vous remplissez un formulaire (vente de votre voiture, contact, alerte d'arrivage), nous recevons les informations que vous saisissez : nom, numéro de téléphone ou WhatsApp, ville, informations sur votre véhicule.",
              "Le site enregistre aussi des données techniques (pages visitées, type d'appareil) si vous acceptez les cookies de mesure d'audience."
            ]
          },
          {
            "h": "2. Utilisation",
            "p": [
              "Nous utilisons vos données pour répondre à vos demandes, planifier une inspection, vous remettre une offre, vous prévenir de l'arrivée d'une voiture qui vous correspond et améliorer nos services.",
              "Nous ne vendons jamais vos données personnelles."
            ]
          },
          {
            "h": "3. Partage",
            "p": [
              "Vos données sont accessibles uniquement à l'équipe MoziMotors et à des prestataires strictement nécessaires (hébergement, messagerie, financement si vous en faites la demande), tenus à la confidentialité."
            ]
          },
          {
            "h": "4. Durée de conservation",
            "p": [
              "Nous conservons vos données le temps nécessaire au traitement de votre demande, puis pendant la durée prévue par nos obligations légales. Vous pouvez demander leur suppression à tout moment."
            ]
          },
          {
            "h": "5. Vos droits",
            "p": [
              "Conformément à la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition.",
              "Pour l'exercer, contactez-nous en indiquant l'objet de votre demande."
            ]
          },
          {
            "h": "6. Sécurité",
            "p": [
              "Nous appliquons des mesures techniques et organisationnelles raisonnables pour protéger vos données contre l'accès non autorisé, la perte ou l'altération."
            ]
          }
        ]
      },
      "cookies": {
        "metaTitle": "Politique de cookies",
        "metaDescription": "Les cookies utilisés par MoziMotors, à quoi ils servent et comment les gérer.",
        "eyebrow": "Informations légales",
        "title": "Politique de cookies",
        "intro": "Un cookie est un petit fichier enregistré sur votre appareil lorsque vous visitez un site. Voici ceux que nous utilisons et comment les contrôler.",
        "sections": [
          {
            "h": "1. Cookies essentiels",
            "p": [
              "Ils sont nécessaires au fonctionnement du site : langue choisie, sécurité, mémorisation de vos préférences de cookies. Ils ne peuvent pas être désactivés."
            ]
          },
          {
            "h": "2. Mesure d'audience",
            "p": [
              "Ces cookies nous indiquent, de façon agrégée, quelles pages sont consultées et comment le site est utilisé. Ils ne sont déposés qu'avec votre accord."
            ]
          },
          {
            "h": "3. Marketing",
            "p": [
              "Ils servent à afficher des publicités adaptées et à en mesurer les résultats. Ils ne sont déposés qu'avec votre accord."
            ]
          },
          {
            "h": "4. Gérer vos choix",
            "p": [
              "Vous pouvez modifier votre consentement à tout moment avec le lien « Gérer mes cookies » en bas de chaque page. Vous pouvez aussi supprimer les cookies depuis les réglages de votre navigateur.",
              "Votre choix est conservé sur votre appareil pendant 12 mois."
            ]
          }
        ]
      }
    }
  },
  whatsappFab: "Nous écrire sur WhatsApp",
};

export type Dict = typeof fr;
