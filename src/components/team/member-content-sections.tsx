import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from 'lucide-react'
import type { TeamMember } from '@/pages/team-member-page'

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

function PhotoGallery({ images }: { images: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const goNext = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % images.length)
  }
  const goPrev = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
  }

  return (
    <>
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Galerie
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, i) => (
            <motion.button
              key={url}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <img
                src={url}
                alt={`Galerie ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
            </motion.button>
          ))}
        </div>
      </motion.section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={images[lightboxIndex]}
              alt={`Galerie ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function LocationMap({ location }: { location: string }) {
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=14.2,49.95,14.6,50.15&layer=mapnik&marker=50.05,14.4`

  return (
    <motion.section
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Lokace
      </h2>
      <div className="overflow-hidden rounded-xl">
        <iframe
          title={`Mapa - ${location}`}
          width="100%"
          height="280"
          src={embedUrl}
          className="border-0"
        />
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <MapPin className="size-3.5" />
        {location}
      </div>
    </motion.section>
  )
}

export function MemberContentSections({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-12">
      <motion.section
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          O mne
        </h2>
        <p className="text-base leading-[1.9] text-neutral-600 dark:text-neutral-400">
          {member.bio}
        </p>
      </motion.section>

      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Specializace
        </h2>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {member.specializations.map((spec, i) => (
            <motion.span
              key={spec}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="text-base text-neutral-700 dark:text-neutral-300"
            >
              {spec}{i < member.specializations.length - 1 && (
                <span className="ml-2 text-neutral-300 dark:text-neutral-600">/</span>
              )}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {member.certifications.length > 0 && (
        <motion.section
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Certifikace
          </h2>
          <ul className="space-y-3">
            {member.certifications.map((cert, i) => (
              <motion.li
                key={cert}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex items-start gap-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                {cert}
              </motion.li>
            ))}
          </ul>
        </motion.section>
      )}

      {member.education.length > 0 && (
        <motion.section
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Vzdelani
          </h2>
          <ul className="space-y-3">
            {member.education.map((edu, i) => (
              <motion.li
                key={edu}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex items-start gap-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                {edu}
              </motion.li>
            ))}
          </ul>
        </motion.section>
      )}

      {member.gallery_images && member.gallery_images.length > 0 && (
        <PhotoGallery images={member.gallery_images} />
      )}

      <LocationMap location={member.location} />
    </div>
  )
}
