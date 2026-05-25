import Link           from 'next/link'
import { BOOK_CATALOG, type BookEntry } from '@/lib/catalog'

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/80 backdrop-blur-md
      border-b border-black/5 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-violet-600 text-xl group-hover:scale-110 transition-transform">
            ✦
          </span>
          <span className="font-bold text-slate-900 text-lg tracking-tight">StoryWeave</span>
        </Link>

        <nav className="flex items-center gap-1">
          <a
            href="#how-it-works"
            className="hidden sm:block px-3 py-2 text-sm font-medium text-slate-500
              hover:text-violet-700 transition-colors rounded-lg hover:bg-violet-50"
          >
            How it works
          </a>
          <a
            href="#books"
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700
              text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Browse books
          </a>
        </nav>
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br
      from-violet-950 via-violet-900 to-indigo-900 pt-32 pb-24 px-4 sm:px-6">

      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full
        bg-violet-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full
        bg-indigo-400/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
          border border-white/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">
            Instant PDF · Personalised just for them
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white
          leading-tight tracking-tight mb-6">
          Every child deserves to be
          <br />
          <span className="text-transparent bg-clip-text
            bg-gradient-to-r from-violet-300 to-indigo-300">
            the hero of their own story.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10
          leading-relaxed">
          Choose a storybook, enter your child's name and personalise their character.
          We'll render a beautiful 24-page PDF starring them — ready to download
          in under a minute.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#books"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-violet-700
              font-bold text-lg shadow-xl hover:shadow-2xl
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Browse books ↓
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-white/30
              text-white font-semibold text-lg hover:bg-white/10 transition-colors duration-200"
          >
            How it works
          </a>
        </div>
      </div>

      {/* Social proof strip */}
      <div className="relative max-w-3xl mx-auto mt-16
        flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {[
          { stat: '500+',    label: 'Happy families'     },
          { stat: '< 60 s',  label: 'PDF delivery'       },
          { stat: '100%',    label: 'Happiness guarantee' },
          { stat: '24 pp',   label: 'Full-colour pages'  },
        ].map(({ stat, label }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-extrabold text-white">{stat}</p>
            <p className="text-xs text-white/60 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Book cover illustration ───────────────────────────────────────────────────

function BookCover({ book }: { book: BookEntry }) {
  return (
    <div
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden flex flex-col
        items-center justify-center select-none"
      style={{ background: `linear-gradient(135deg, ${book.coverFrom}, ${book.coverTo})` }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/10" />

      {/* Spine accent */}
      <div className="absolute left-0 inset-y-0 w-4 bg-black/20 rounded-r-sm" />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <span className="text-6xl drop-shadow-md leading-none">{book.coverEmoji}</span>
        <div>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-1.5"
            style={{ color: book.coverAccent + 'cc' }}
          >
            StoryWeave
          </p>
          <h3
            className="font-extrabold text-lg leading-tight"
            style={{ color: book.coverAccent }}
          >
            {book.title}
          </h3>
        </div>
      </div>

      {/* Page edge effect */}
      <div className="absolute right-1.5 inset-y-2 w-1.5 flex flex-col justify-between">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-1 bg-white/15 rounded-sm mx-px" />
        ))}
      </div>
    </div>
  )
}

// ── Book card ─────────────────────────────────────────────────────────────────

function BookCard({ book }: { book: BookEntry }) {
  return (
    <article className="group flex flex-col bg-white rounded-2xl shadow-sm
      ring-1 ring-black/5 overflow-hidden
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Cover */}
      <div className="p-5 pb-4">
        <BookCover book={book} />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-5 pb-5 gap-3">

        {/* Age + page count chips */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold bg-slate-100 text-slate-500
            rounded-full px-2.5 py-1">
            Ages {book.ageRange}
          </span>
          <span className="text-[11px] font-semibold bg-slate-100 text-slate-500
            rounded-full px-2.5 py-1">
            {book.pageCount} pages
          </span>
        </div>

        {/* Title + tagline */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-snug">
            {book.title}
          </h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            {book.tagline}
          </p>
        </div>

        {/* Themes */}
        <div className="flex flex-wrap gap-1.5">
          {book.themes.map(theme => (
            <span
              key={theme}
              className="text-[11px] font-semibold text-violet-700
                bg-violet-50 border border-violet-100 rounded-full px-2.5 py-0.5"
            >
              {theme}
            </span>
          ))}
        </div>

        {/* Spacer pushes CTA to bottom */}
        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3
          border-t border-slate-100 mt-auto">
          <div>
            <p className="text-xl font-extrabold text-slate-900">
              {book.priceFormatted}
            </p>
            <p className="text-[11px] text-slate-400">Digital PDF · instant download</p>
          </div>

          <Link
            href={`/customize/${book.id}`}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700
              text-white text-sm font-semibold
              shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
          >
            Personalise →
          </Link>
        </div>
      </div>
    </article>
  )
}

// ── Books section ─────────────────────────────────────────────────────────────

function BooksSection() {
  return (
    <section id="books" className="py-20 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-violet-600 uppercase mb-2">
            Our Collection
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Choose your adventure
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            Every book puts your child at the centre of the story.
            Pick a world — then make the hero uniquely theirs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOOK_CATALOG.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How it works ──────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    number: '01',
    emoji:  '🎨',
    title:  'Pick & personalise',
    body:   'Choose a story, type in your child\'s name, and design their character — hair, eyes, skin tone, and more.',
  },
  {
    number: '02',
    emoji:  '💳',
    title:  'Checkout securely',
    body:   'Pay with any card, Apple Pay, or Google Pay. Powered by Stripe — your details never touch our servers.',
  },
  {
    number: '03',
    emoji:  '📖',
    title:  'Download instantly',
    body:   'Your personalised 24-page PDF is generated in seconds and emailed to you — ready to read or print.',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest text-violet-600 uppercase mb-2">
            Simple process
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Ready in under a minute
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_STEPS.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">

              {/* Connector line */}
              {i < HOW_STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)]
                  right-[-calc(50%-3rem)] h-px bg-slate-200" />
              )}

              {/* Icon circle */}
              <div className="relative w-16 h-16 rounded-2xl bg-violet-50 border-2
                border-violet-100 flex items-center justify-center mb-5 text-3xl">
                {step.emoji}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full
                  bg-violet-600 text-white text-[10px] font-bold
                  flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:  'My daughter cried happy tears when she saw herself as the hero. Worth every penny.',
    author: 'Sarah M.',
    child:  'Mum of Lily, 5',
    stars:  5,
  },
  {
    quote:  'Perfect birthday gift. Ordered at 11pm, printed and wrapped by midnight. Magic.',
    author: 'James T.',
    child:  'Dad of Noah, 7',
    stars:  5,
  },
  {
    quote:  'The quality of the PDF is stunning — colours are so vivid. Printing it as a poster too!',
    author: 'Priya K.',
    child:  'Mum of Aiden, 4',
    stars:  5,
  },
]

function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-violet-950">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-violet-300 uppercase mb-2">
            Loved by families
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            What parents are saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.author}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>

              <blockquote className="text-white/80 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div>
                <p className="text-white font-semibold text-sm">{t.author}</p>
                <p className="text-white/50 text-xs">{t.child}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Guarantee banner ──────────────────────────────────────────────────────────

function GuaranteeBanner() {
  return (
    <section className="py-16 px-4 sm:px-6 bg-emerald-50 border-y border-emerald-100">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
          bg-emerald-100 border-2 border-emerald-200 text-3xl mb-5">
          ✓
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
          100% happiness guarantee
        </h2>
        <p className="text-slate-600 leading-relaxed max-w-xl mx-auto mb-7">
          If you're not completely thrilled with your book for any reason, we'll
          regenerate it at no extra cost — or give you a full refund, no questions asked.
        </p>
        <a
          href="#books"
          className="inline-flex items-center px-8 py-3.5 rounded-2xl
            bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base
            shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
            transition-all duration-200"
        >
          Get started →
        </a>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-10 px-4 sm:px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center
        justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-violet-400 text-lg">✦</span>
          <span className="font-bold text-white">StoryWeave</span>
        </div>

        <p className="text-slate-500 text-sm text-center">
          © {new Date().getFullYear()} StoryWeave. Personalised stories, delivered instantly.
        </p>

        <div className="flex items-center gap-5 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">🔒 Secure checkout</span>
          <span className="flex items-center gap-1.5">⚡ Instant PDF</span>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <BooksSection />
        <HowItWorks />
        <Testimonials />
        <GuaranteeBanner />
      </main>
      <Footer />
    </>
  )
}
