export interface ProductData {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  pricePrefix?: string;
  currency: string;
  features?: string[];
  note?: string;
  badge?: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel?: string;
  details: {
    title: string;
    content: string | string[];
  }[];
}

export const PRODUCTS: ProductData[] = [
  {
    slug: "lineseat",
    name: "Lineseat",
    subtitle: "Ergonomicky sedak",
    description:
      "Nase pomucka pro stabilni a funkcni sed v aute nebo v kancelari.",
    longDescription:
      "Lineseat je inovativni ergonomicky sedak, ktery vam pomuze udrzet spravne drzeni tela pri sezeni. At uz travite hodiny v kancelari nebo za volantem, Lineseat podporuje vasi pater a pomaha predchazet bolestem zad. Navrzeno fyzioterapeuty s 20letou zkusenosti.",
    image:
      "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=1280",
      "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1280",
      "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ],
    price: 2900,
    originalPrice: 3900,
    currency: "CZK",
    badge: "Akce",
    note: "Akce je platna do vyprodani zasob!",
    ctaPrimaryLabel: "Koupit",
    ctaSecondaryLabel: "O produktu",
    details: [
      {
        title: "Popis produktu",
        content:
          "Lineseat je ergonomicky sedak navrzeny pro podporu spravneho drzeni tela. Vhodny do kancelarskeho kresla i do auta. Pomaha eliminovat bolesti zad a zlepsuje pohodli pri dlouhodobem sezeni.",
      },
      {
        title: "Materialy",
        content: [
          "Vysokokvalitni pena s tvarovou pameti",
          "Protiskluzova spodni strana",
          "Pratelny potah na zip",
          "Rozmery: 45 x 40 x 8 cm",
        ],
      },
      {
        title: "Doprava a vraceni",
        content:
          "Doprava po cele CR zdarma. Zbozi lze vratit do 30 dnu od zakoupeni v originalnim obalu.",
      },
    ],
  },
  {
    slug: "correctfoot",
    name: "Correctfoot",
    subtitle: "Balancni desticka",
    description: "Balancni desticka pro trenink koncetin.",
    longDescription:
      "Correctfoot je profesionalni balancni desticka urcena pro trenink dolnich i hornich koncetin. Idealni pro rehabilitaci, prevenci zraneni a zlepseni propriocepce. Vybirejte ze dvou variant pro ruzne urovne pokrocilosti.",
    image:
      "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1280",
      "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1280",
      "https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ],
    price: 2900,
    pricePrefix: "od",
    currency: "CZK",
    note: "Vyber ze dvou variant.",
    ctaPrimaryLabel: "Koupit",
    ctaSecondaryLabel: "O produktu",
    details: [
      {
        title: "Popis produktu",
        content:
          "Correctfoot balancni desticka je navrzena ve spolupraci s fyzioterapeuty. Pomaha zlepsit stabilitu, propriocepci a koordinaci. Idealni pro rehabilitaci po zranenich kotnika a kolena.",
      },
      {
        title: "Varianty",
        content: [
          "Varianta Basic - pro zacatecniky a mirnou rehabilitaci",
          "Varianta Pro - pro pokrocile a intenzivni trenink",
          "Obe varianty vyrobeny z kvalitniho dreva",
          "Protiskluzovy povrch",
        ],
      },
      {
        title: "Doprava a vraceni",
        content:
          "Doprava po cele CR zdarma. Zbozi lze vratit do 30 dnu od zakoupeni v originalnim obalu.",
      },
    ],
  },
  {
    slug: "4core",
    name: "4CORE",
    subtitle: "Treninkovy program",
    description: "Online treninkovy program pro zlepseni kondice a zdravi.",
    longDescription:
      "4CORE je komplexni online treninkovy program vytvoreny fyzioterapeuty. Za 70 dni a pouhych 15 minut denne dosahne vase telo vyrazneho zlepseni. Program je pristupny dozivotne a muzete ho opakovat kdykoliv.",
    image:
      "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1280",
      "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1280",
      "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ],
    price: 4900,
    currency: "CZK",
    features: ["70 dni treninku", "15 minut denne"],
    note: "Dozivotni pristup!",
    ctaPrimaryLabel: "Koupit",
    ctaSecondaryLabel: "Vyzkouset",
    details: [
      {
        title: "Co program obsahuje",
        content: [
          "70 dnu strukturovaneho treninku",
          "Video navody ke kazdemu cviku",
          "Postupne zvysovani narocnosti",
          "Dozivotni pristup ke vsem materialam",
        ],
      },
      {
        title: "Pro koho je urcen",
        content:
          "Program je vhodny pro vsechny urovne zdatnosti. At uz jste uplny zacatecnik nebo pokrocily sportovec, 4CORE se prizpusobi vasemu tempu.",
      },
      {
        title: "Jak to funguje",
        content:
          "Po zakoupeni ziskate okamzity pristup do online platformy. Kazdy den obdrzite novy trenink s video navodem. Staci 15 minut denne.",
      },
    ],
  },
  {
    slug: "fyziotrenink",
    name: "Fyziotrenink",
    subtitle: "Kniha",
    description:
      "Aktualizovane vydani knihy Fyziotrenink - Pohyb jako lek.",
    longDescription:
      "Kniha Fyziotrenink - Pohyb jako lek je komplexni pruvodce spravnym pohybem a cvicenim. Aktualizovane vydani obsahuje nejnovejsi poznatky z fyzioterapie a sportovni mediciny. Idealni pro kazdeho, kdo chce zlepsit sve zdravi prostrednictvim pohybu.",
    image:
      "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=1280",
      "https://images.pexels.com/photos/5473188/pexels-photo-5473188.jpeg?auto=compress&cs=tinysrgb&w=1280",
      "https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ],
    price: 450,
    currency: "CZK",
    note: "Cena je vcetne dopravy!",
    ctaPrimaryLabel: "Koupit",
    ctaSecondaryLabel: "O knize",
    details: [
      {
        title: "O knize",
        content:
          "Fyziotrenink - Pohyb jako lek je prakticky pruvodce, ktery vam ukazuje, jak vyuzit pohyb jako nastroj pro zlepseni zdravi. Obsahuje desitky cviku s detailnimi popisy a ilustracemi.",
      },
      {
        title: "Obsah knihy",
        content: [
          "Zaklady funkcniho treninku",
          "Cviky pro spravne drzeni tela",
          "Rehabilitacni programy",
          "Prevence zraneni",
          "Treninkove plany pro ruzne urovne",
        ],
      },
      {
        title: "Doprava",
        content:
          "Kniha je zasilana postou s dorucenim do 3-5 pracovnich dnu. Cena jiz zahrnuje postovne a balne.",
      },
    ],
  },
];

export function getProductBySlug(slug: string): ProductData | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
