export const mockCourses = [
  {
    id: 'course_1',
    title: 'Základy Fyzioterapie',
    description: 'Úvod do fyzioterapie, anatomie pohybového systému a základní vyšetřovací techniky',
    image_url: '/demo-img.png',
    price: 1299,
    order_index: 0,
    is_published: true
  },
  {
    id: 'course_2',
    title: 'Terapie Páteře',
    description: 'Diagnostika a léčba bolestí zad, krční a bederní páteře pomocí manuálních technik',
    image_url: '/demo-img.png',
    price: 1599,
    order_index: 1,
    is_published: true
  },
  {
    id: 'course_3',
    title: 'Sportovní Fyzioterapie',
    description: 'Péče o sportovce, prevence zranění a rehabilitace po sportovních úrazech',
    image_url: '/demo-img.png',
    price: 1899,
    order_index: 2,
    is_published: true
  },
  {
    id: 'course_4',
    title: 'Neurologická Rehabilitace',
    description: 'Léčba pacientů po cévní mozkové příhodě, s Parkinsonovou chorobou a jinými neurologickými poruchami',
    image_url: '/demo-img.png',
    price: 2199,
    order_index: 3,
    is_published: true
  }
]

export const mockModules = [
  {
    id: 'module_1_1',
    course_id: 'course_1',
    title: 'Anatomie Pohybového Systému',
    description: 'Přehled kostní, svalové a kloubní soustavy',
    content: '<p>Naučíte se základní anatomii lidského těla se zaměřením na pohybový systém, kosti, svaly a klouby.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 50
  },
  {
    id: 'module_1_2',
    course_id: 'course_1',
    title: 'Vyšetřovací Metody',
    description: 'Základní vyšetření pacienta a diagnostika',
    content: '<p>Seznámíte se s vyšetřovacími metodami pro určení rozsahu pohybu, svalové síly a funkčních limitací.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 55
  },
  {
    id: 'module_1_3',
    course_id: 'course_1',
    title: 'Základní Terapeutické Techniky',
    description: 'Masáže, mobilizace a cvičení',
    content: '<p>Praktické základy terapeutických technik včetně měkkých technik, mobilizací a terapeutického cvičení.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 2,
    duration_minutes: 65
  },
  {
    id: 'module_2_1',
    course_id: 'course_2',
    title: 'Anatomie Páteře',
    description: 'Stavba páteře a její funkce',
    content: '<p>Detailní anatomie krční, hrudní a bederní páteře a jejich biomechanika.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 45
  },
  {
    id: 'module_2_2',
    course_id: 'course_2',
    title: 'Diagnostika Páteře',
    description: 'Vyšetření bolestí zad a krku',
    content: '<p>Naučíte se vyšetřovat pacienty s bolestmi páteře a určovat příčiny problémů.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 60
  },
  {
    id: 'module_2_3',
    course_id: 'course_2',
    title: 'Terapie Páteře',
    description: 'Manuální techniky a cvičení pro páteř',
    content: '<p>Praktické manuální techniky, mobilizace páteře a terapeutická cvičení pro pacienty.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 2,
    duration_minutes: 70
  },
  {
    id: 'module_3_1',
    course_id: 'course_3',
    title: 'Prevence Sportovních Zranění',
    description: 'Screeningové metody a preventivní programy',
    content: '<p>Naučíte se hodnotit riziko zranění u sportovců a vytvářet preventivní programy.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 55
  },
  {
    id: 'module_3_2',
    course_id: 'course_3',
    title: 'Akutní Péče a První Pomoc',
    description: 'Ošetření akutních sportovních zranění',
    content: '<p>První pomoc při sportovních úrazech, bandážování a okamžitá péče.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 50
  },
  {
    id: 'module_3_3',
    course_id: 'course_3',
    title: 'Rehabilitace Sportovců',
    description: 'Návrat do sportu po zranění',
    content: '<p>Progresivní rehabilitační programy a kritéria pro bezpečný návrat ke sportu.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 2,
    duration_minutes: 65
  },
  {
    id: 'module_4_1',
    course_id: 'course_4',
    title: 'Neurologie pro Fyzioterapeuty',
    description: 'Základy neurologie a neurologická vyšetření',
    content: '<p>Přehled neurologických onemocnění a specifická vyšetření pro fyzioterapeuty.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 60
  },
  {
    id: 'module_4_2',
    course_id: 'course_4',
    title: 'Rehabilitace po CMP',
    description: 'Léčba pacientů po cévní mozkové příhodě',
    content: '<p>Specifické postupy pro rehabilitaci hemiparezy, poruchy chůze a jemné motoriky.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 70
  },
  {
    id: 'module_4_3',
    course_id: 'course_4',
    title: 'Parkinsonova Choroba',
    description: 'Terapeutické přístupy u Parkinsonovy choroby',
    content: '<p>Specifická cvičení a techniky pro zlepšení mobility a kvality života u pacientů s Parkinsonovou chorobou.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 2,
    duration_minutes: 55
  }
]

const ENROLLMENTS_KEY = 'mock_enrollments'
const PROGRESS_KEY = 'mock_progress'

export interface MockEnrollment {
  id: string
  user_id: string
  course_id: string
  progress_percentage: number
  enrolled_at: string
  completed_at: string | null
}

export interface MockModuleProgress {
  id: string
  user_id: string
  module_id: string
  course_id: string
  watch_time_seconds: number
  last_watched_position: number
  is_completed: boolean
  completed_at: string | null
}

export const mockDatabase = {
  getEnrollments: (userId: string): MockEnrollment[] => {
    const stored = localStorage.getItem(ENROLLMENTS_KEY)
    if (!stored) return []

    try {
      const all = JSON.parse(stored)
      return all.filter((e: MockEnrollment) => e.user_id === userId)
    } catch {
      return []
    }
  },

  addEnrollment: (enrollment: Omit<MockEnrollment, 'id' | 'enrolled_at'>): void => {
    const stored = localStorage.getItem(ENROLLMENTS_KEY)
    const all = stored ? JSON.parse(stored) : []

    const newEnrollment: MockEnrollment = {
      ...enrollment,
      id: 'enroll_' + Math.random().toString(36).substr(2, 9),
      enrolled_at: new Date().toISOString()
    }

    all.push(newEnrollment)
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(all))
  },

  updateEnrollment: (userId: string, courseId: string, updates: Partial<MockEnrollment>): void => {
    const stored = localStorage.getItem(ENROLLMENTS_KEY)
    if (!stored) return

    try {
      const all = JSON.parse(stored)
      const index = all.findIndex((e: MockEnrollment) => e.user_id === userId && e.course_id === courseId)

      if (index !== -1) {
        all[index] = { ...all[index], ...updates }
        localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(all))
      }
    } catch {}
  },

  getModuleProgress: (userId: string, courseId?: string): MockModuleProgress[] => {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return []

    try {
      const all = JSON.parse(stored)
      return all.filter((p: MockModuleProgress) => {
        if (courseId) {
          return p.user_id === userId && p.course_id === courseId
        }
        return p.user_id === userId
      })
    } catch {
      return []
    }
  },

  upsertModuleProgress: (progress: Omit<MockModuleProgress, 'id'>): void => {
    const stored = localStorage.getItem(PROGRESS_KEY)
    const all = stored ? JSON.parse(stored) : []

    const existingIndex = all.findIndex(
      (p: MockModuleProgress) => p.user_id === progress.user_id && p.module_id === progress.module_id
    )

    if (existingIndex !== -1) {
      all[existingIndex] = {
        ...all[existingIndex],
        ...progress
      }
    } else {
      all.push({
        ...progress,
        id: 'progress_' + Math.random().toString(36).substr(2, 9)
      })
    }

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all))
  },

  getModuleProgressSingle: (userId: string, moduleId: string): MockModuleProgress | null => {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return null

    try {
      const all = JSON.parse(stored)
      return all.find((p: MockModuleProgress) => p.user_id === userId && p.module_id === moduleId) || null
    } catch {
      return null
    }
  }
}

export const mockAiTips = [
  "📚 Tip na učení: Vezměte si krátké přestávky každých 25-30 minut pro lepší koncentraci",
  "💡 Praktický tip: Cvičte naučené techniky na modelech nebo rodině pro získání jistoty",
  "🎯 Motivace: Konzistence je klíčem k úspěchu - věnujte učení alespoň 30 minut denně",
  "🔄 Opakování: Zrevidujte předchozí moduly pro lepší zapamatování anatomie a technik",
  "👥 Komunita: Sdílejte své zkušenosti a získejte zpětnou vazbu od ostatních fyzioterapeutů"
]

export interface ChatMessage {
  id: string
  question: string
  answer: string
  category: string
}

export const mockChatbotQA: ChatMessage[] = [
  {
    id: 'qa_1',
    question: 'Jaké jsou nejčastější příčiny bolesti dolní části zad?',
    answer: 'Nejčastější příčiny bolesti dolní části zad zahrnují: 1) Svalové přetížení a napětí, 2) Degenerativní změny meziobratlových disků, 3) Špatné držení těla a ergonomie, 4) Nedostatek pohybu a oslabení hlubokého stabilizačního systému, 5) Stres a psychosomatické faktory. Důležitá je komplexní diagnostika a individuální přístup k terapii.',
    category: 'páteř'
  },
  {
    id: 'qa_2',
    question: 'Jak často by měl pacient cvičit doma mezi terapiemi?',
    answer: 'Optimální frekvence domácího cvičení je 3-5x týdně, ideálně denně po 15-20 minut. Důležitější než délka je pravidelnost a kvalita provedení cviků. Začněte s jednoduchými cviky a postupně zvyšujte obtížnost. Pacient by měl mít jasné písemné nebo video instrukce pro domácí cvičení.',
    category: 'obecné'
  },
  {
    id: 'qa_3',
    question: 'Kdy je vhodné použít led a kdy teplo při zranění?',
    answer: 'Led (kryoterapie) používejte v akutní fázi (0-72 hodin) po zranění - snižuje otok, zánět a bolest. Aplikujte na 15-20 minut s přestávkami. Teplo je vhodné pro chronické obtíže, svalové napětí a ztuhlost - zvyšuje prokrvení a uvolňuje svaly. Nikdy neaplikujte teplo na akutní zranění nebo aktivní zánět!',
    category: 'terapie'
  },
  {
    id: 'qa_4',
    question: 'Co je to hluboký stabilizační systém páteře?',
    answer: 'Hluboký stabilizační systém (HSS) je soubor svalů, které stabilizují páteř a pánev: bránice, příčný břišní sval, pánevní dno a hluboké zádové svaly. Tyto svaly se aktivují PŘED pohybem a chrání páteř. Jejich oslabení vede k bolestem zad. Trénink HSS je základ každé terapie páteře.',
    category: 'páteř'
  },
  {
    id: 'qa_5',
    question: 'Jak se liší sportovní fyzioterapie od běžné?',
    answer: 'Sportovní fyzioterapie se zaměřuje na: 1) Prevenci zranění u sportovců, 2) Akutní péči na místě (první pomoc), 3) Rychlou a bezpečnou návratnost do sportu, 4) Specifické požadavky daného sportu, 5) Vyšší intenzitu rehabilitace, 6) Funkční testování a screening. Vyžaduje znalost biomechaniky sportu a specifických pohybových vzorců.',
    category: 'sport'
  },
  {
    id: 'qa_6',
    question: 'Co dělat při akutním svalovém křeči?',
    answer: 'Při akutním křeči: 1) Okamžitě zastavte aktivitu, 2) Jemně protáhněte stažený sval, 3) Masírujte oblast křeče, 4) Aplikujte teplo nebo teplý obklad, 5) Hydratujte se (voda s minerály), 6) Odpočívejte. Prevence: pravidelné protahování, dostatečná hydratace, vyvážená strava s dostatkem hořčíku a draslíku.',
    category: 'akutní péče'
  },
  {
    id: 'qa_7',
    question: 'Jaké jsou kontraindikace manuální terapie?',
    answer: 'Absolutní kontraindikace: nádorová onemocnění páteře, infekce, akutní zlomeniny, těžká osteoporóza, neurologické deficity, vaskulární komplikace. Relativní: akutní zánět, gravidita, antikoagulační terapie. Vždy důkladně vyšetřete pacienta a v případě pochybností konzultujte s lékařem. Bezpečnost pacienta je priorita!',
    category: 'terapie'
  },
  {
    id: 'qa_8',
    question: 'Jak hodnotit pokrok pacienta v rehabilitaci?',
    answer: 'Hodnocení pokroku: 1) Subjektivní (bolest - VAS škála, funkční omezení), 2) Objektivní (rozsah pohybu, svalová síla, funkční testy), 3) Standardizované dotazníky (ODI, DASH), 4) Funkční testy specifické pro aktivitu, 5) Cílová kritéria stanovená na začátku. Pravidelně revidujte terapeutický plán podle pokroku.',
    category: 'obecné'
  },
  {
    id: 'qa_9',
    question: 'Jaký je postup při syndromu karpálního tunelu?',
    answer: 'Konzervativní léčba zahrnuje: 1) Noční dlahy v neutrální pozici zápěstí, 2) Modifikace ergonomie pracoviště, 3) Neuromobilizace n. medianus, 4) Protažení a posílení svalů předloktí, 5) Fyzikální terapie (ultrazvuk, laser), 6) Edukace pacienta. Při neúspěchu konzervativní léčby zvažte chirurgické řešení.',
    category: 'terapie'
  },
  {
    id: 'qa_10',
    question: 'Co je důležité při rehabilitaci po cévní mozkové příhodě?',
    answer: 'Klíčové principy: 1) Včasný začátek - co nejdříve po stabilizaci, 2) Intenzivní a opakovaný trénink, 3) Funkčně orientované cvičení (ADL aktivity), 4) Prevence komplikací (kontraktury, proleženiny), 5) Facilitace pohybu postiženou stranou, 6) Nácvik rovnováhy a chůze, 7) Multidisciplinární přístup, 8) Psychologická podpora pacienta a rodiny.',
    category: 'neurologie'
  }
]
