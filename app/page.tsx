// app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ---------- content data ---------- */

const NAV = ["Home", "Our Story", "Ingredients", "Benefits", "Shop", "Reviews", "Contact"];

const INGREDIENTS = [
  { name: "Aloe Vera", img: "/images/ingredient-aloe.jpg", copy: "Known for its soothing and moisture-focused qualities." },
  { name: "Rosemary", img: "/images/ingredient-rosemary.jpg", copy: "A refreshing botanical ingredient traditionally associated with hair-care rituals." },
  { name: "Amla", img: "/images/ingredient-amla.jpg", copy: "A traditional South Asian herbal ingredient used in natural hair-care routines." },
  { name: "Shikakai", img: "/images/ingredient-shikakai.jpg", copy: "A classic botanical cleansing ingredient traditionally used for hair care." },
];

const BENEFITS = [
  { title: "GENTLE CLEANSE", copy: "A simple cleansing experience for your everyday routine." },
  { title: "BOTANICAL CARE", copy: "Inspired by naturally derived herbal ingredients." },
  { title: "FRESH FEEL", copy: "Leaves hair feeling clean and refreshed." },
  { title: "MINDFUL BEAUTY", copy: "A simpler approach to everyday personal care." },
];

const STEPS = [
  { n: "01 — WET", copy: "Thoroughly wet your hair." },
  { n: "02 — MASSAGE", copy: "Apply a suitable amount and gently massage into the scalp and hair." },
  { n: "03 — RINSE", copy: "Rinse thoroughly and repeat if desired." },
];

const REVIEWS = [
  { name: "Sample Customer A", rating: 5, text: "Beautiful packaging and such a refreshing herbal feel. I love the overall concept of HERBELLE." },
  { name: "Sample Customer B", rating: 5, text: "A lovely, simple everyday ritual. The botanical scent feels calming." },
  { name: "Sample Customer C", rating: 4, text: "Elegant bottle and a gentle, fresh feel after washing." },
  { name: "Sample Customer D", rating: 5, text: "I like that the brand keeps things simple and nature-inspired." },
];

const FAQS = [
  { q: "What is HERBELLE Organic Herbal Shampoo?", a: "A botanical-inspired shampoo made for a fresh, simple, everyday hair-care ritual." },
  { q: "What ingredients are used?", a: "Botanical ingredients inspired by traditional herbal hair care, including aloe vera, rosemary, amla and shikakai. Please refer to the bottle label for the full ingredient list." },
  { q: "How often can I use the shampoo?", a: "It is designed for everyday hair-care routines. Use as often as suits your hair and preferences." },
  { q: "What hair types is it intended for?", a: "HERBELLE is intended for everyday use. If you have a sensitive scalp or allergies, check the label and patch-test first." },
  { q: "How should I store the shampoo?", a: "Keep the bottle tightly closed, in a cool, dry place away from direct sunlight." },
  { q: "How can I place an order?", a: "Add the shampoo to your cart, or tap \"Order via WhatsApp\" to send us your order directly." },
  { q: "Do you offer Cash on Delivery?", a: "Payment options are confirmed when we reply to your WhatsApp order. [Update once final payment methods are set.]" },
  { q: "How long does delivery take?", a: "Delivery time depends on your city. We'll share an estimate when we confirm your order. [Update with final timelines.]" },
];

const PRODUCT_NAME = "HERBELLE Organic Herbal Shampoo";
const PRICE = 599; // set a real price to show totals instead of "Rs. 599"
const WHATSAPP_NUMBER = "923379378174";

const money = (n: number) => (PRICE ? `Rs. ${(n * PRICE).toLocaleString()}` : "Rs. 599");

function buildWhatsAppMessage(cart: number) {
  const qty = cart > 0 ? cart : 1;
  const items = `${qty} × ${PRODUCT_NAME}`;
  const total = PRICE ? money(qty) : "Rs. 599 (price to be confirmed)";
  return encodeURIComponent(
    `Hello HERBELLE! I'd like to place an order:\n\n${items}\nTotal: ${total}\n\nPlease confirm my order and delivery details.`
  );
}

function whatsappLink(cart: number) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(cart)}`;
}

/* ---------- small reusable bits ---------- */

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}
    >
      {children}
    </div>
  );
}

function Logo({ className = "w-16" }: { className?: string }) {
  return (
    <div className={`relative aspect-square ${className}`}>
      <Image src="/images/herbelle-logo.png" alt="HERBELLE" fill className="object-contain" />
    </div>
  );
}

type Errors = Record<string, string>;

/* ---------- page ---------- */

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState(0);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const gallery = ["/images/product-front.jpg", "/images/product-back.jpg", "/images/lifestyle.jpg"];

  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [contactErrors, setContactErrors] = useState<Errors>({});
  const [contactDone, setContactDone] = useState(false);

  function validateContact() {
    const e: Errors = {};
    if (!contact.name.trim()) e.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(contact.email.trim())) e.email = "Enter a valid email address.";
    if (!contact.message.trim()) e.message = "Write a message.";
    setContactErrors(e);
    return Object.keys(e).length === 0;
  }

  function submitContact(e: React.FormEvent) {
    e.preventDefault();
    if (!validateContact()) return;
    setContactDone(true);
  }

  const bottleShot = (src: string, extra = "") => (
    <div
      className={`relative w-[min(300px,62vw)] aspect-[2/3] rounded-t-[190px] rounded-b-[22px] shadow-[0_30px_50px_rgba(36,77,43,0.3)] overflow-hidden ${extra}`}
    >
      <Image src={src} alt="HERBELLE product bottle" fill className="object-cover" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F3E8] text-[#1F2A20] font-[family-name:var(--font-sans)] overflow-x-hidden">
      {/* header */}
      <header className="sticky top-0 z-50 bg-[#F8F3E8]/90 backdrop-blur-md border-b border-[#244D2B]/10">
        <div className="max-w-[1240px] mx-auto h-[78px] flex items-center gap-6 px-6">
          <a href="#home" aria-label="HERBELLE home">
            <Logo className="w-16" />
          </a>
          <nav
            className={`md:flex md:gap-7 md:mx-auto md:static md:translate-y-0 md:bg-transparent md:border-0 md:flex-row
              ${menuOpen ? "translate-y-0" : "-translate-y-[130%] md:translate-y-0"}
              fixed md:relative top-[78px] left-0 right-0 flex flex-col bg-[#F8F3E8] border-b border-[#244D2B]/10 px-6 pb-6 transition-transform duration-300 text-sm font-medium`}
          >
            {NAV.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenuOpen(false)}
                className="py-3.5 md:py-0 border-b md:border-0 border-[#244D2B]/10 hover:text-[#4F7A45]"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5 ml-auto md:ml-0">
            <button
              aria-label="Search"
              onClick={() => alert("Search will be available once more products are added.")}
              className="w-11 h-11 rounded-full grid place-items-center text-[#244D2B]"
            >
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 stroke-current fill-none stroke-[1.6]">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
            </button>
            <button
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative w-11 h-11 rounded-full grid place-items-center text-[#244D2B]"
            >
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 stroke-current fill-none stroke-[1.6]">
                <path d="M5 8h14l-1 12H6zM9 8a3 3 0 016 0" />
              </svg>
              <span className="absolute top-0.5 right-0 bg-[#244D2B] text-[#F8F3E8] text-[11px] min-w-[18px] h-[18px] rounded-full grid place-items-center font-semibold">
                {cart}
              </span>
            </button>
            <a
              href={whatsappLink(cart)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex min-h-[48px] items-center px-7 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#244D2B] text-[#F8F3E8] hover:bg-[#4F7A45] transition"
            >
              Order now
            </a>
            <button
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-11 h-11 rounded-full grid place-items-center text-[#244D2B]"
            >
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 stroke-current fill-none stroke-[1.6]">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="home">
        {/* hero */}
        <section className="relative pt-14 px-6 py-24 bg-[radial-gradient(circle_at_80%_30%,#FFFDF8,#F8F3E8_65%)] overflow-hidden">
          <div className="absolute -right-32 top-5 w-[520px] opacity-[0.07] pointer-events-none">
            <Logo className="w-full" />
          </div>
          <div className="max-w-[1160px] mx-auto grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-center relative z-10">
            <div>
              <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">
                Organic herbal hair care
              </span>
              <h1 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2.8rem,6vw,5rem)] leading-[1.1] text-[#244D2B] mb-4">
                Nature&rsquo;s Care, Beautifully Bottled.
              </h1>
              <p className="text-lg max-w-[480px] mb-1">
                Discover a gentle, plant-inspired hair-care ritual crafted with carefully selected herbal ingredients
                for naturally beautiful-looking hair.
              </p>
              <div className="flex gap-3.5 flex-wrap mt-7">
                <a
                  href="#shop"
                  className="min-h-[48px] inline-flex items-center px-7 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#244D2B] text-[#F8F3E8] hover:bg-[#4F7A45] transition hover:-translate-y-0.5"
                >
                  Shop now
                </a>
                <a
                  href="#ingredients"
                  className="min-h-[48px] inline-flex items-center px-7 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#244D2B] text-[#244D2B] hover:-translate-y-0.5 transition"
                >
                  Explore ingredients
                </a>
              </div>
            </div>
            <div className="relative h-[560px] grid place-items-center">
              <div className="absolute w-[440px] max-w-[90%] aspect-square rounded-full bg-[radial-gradient(circle,#E5EBDA,#A8B89A_120%)] opacity-60" />
              {bottleShot(gallery[0], "z-10 animate-[bob_6s_ease-in-out_infinite_alternate] drop-shadow-[0_26px_22px_rgba(0,0,0,0.28)]")}
              <span className="absolute left-0 top-[34%] bg-[#FFFDF8] border border-[#244D2B]/10 rounded-full px-4.5 py-2 text-xs font-semibold text-[#244D2B] shadow-lg">
                🌿 Plant Inspired
              </span>
              <span className="absolute right-0 top-[52%] bg-[#FFFDF8] border border-[#244D2B]/10 rounded-full px-4.5 py-2 text-xs font-semibold text-[#244D2B] shadow-lg">
                Small Batch
              </span>
              <span className="absolute left-[8%] bottom-[8%] bg-[#FFFDF8] border border-[#244D2B]/10 rounded-full px-4.5 py-2 text-xs font-semibold text-[#244D2B] shadow-lg">
                Made With Care
              </span>
            </div>
          </div>
        </section>

        {/* trust bar */}
        <div className="bg-[#244D2B] text-[#F8F3E8] py-5 px-6">
          <ul className="max-w-[1160px] mx-auto flex flex-wrap justify-between gap-4 text-sm tracking-wide list-none m-0 p-0">
            <li>🌿 Botanical Ingredients</li>
            <li>💧 Gentle Hair Care</li>
            <li>🍃 Nature Inspired</li>
            <li>✨ Made With Care</li>
          </ul>
        </div>

        {/* story */}
        <section id="our-story" className="py-24 px-6">
          <div className="max-w-[1160px] mx-auto grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative aspect-[4/5] rounded-t-[200px] rounded-b-3xl overflow-hidden shadow-2xl bg-[#A8B89A]">
                <Image src="/images/lifestyle.jpg" alt="HERBELLE lifestyle" fill className="object-cover object-[60%_20%]" />
              </div>
            </Reveal>
            <Reveal>
              <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">
                Our story
              </span>
              <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#244D2B] mb-4">
                Beauty Inspired by Nature
              </h2>
              <p>
                HERBELLE was created with a simple idea: everyday hair care can be gentle, beautiful and inspired by
                nature. Our goal is to bring carefully selected herbal ingredients into a simple and enjoyable
                hair-care ritual.
              </p>
              <a
                href="#contact"
                className="inline-flex min-h-[48px] items-center px-7 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#244D2B] text-[#244D2B] hover:-translate-y-0.5 transition mt-2"
              >
                Discover our story
              </a>
            </Reveal>
          </div>
        </section>

        {/* ingredients */}
        <section id="ingredients" className="py-24 px-6 bg-[#FFFDF8]">
          <Reveal className="max-w-[1160px] mx-auto text-center">
            <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">
              Ingredients
            </span>
            <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#244D2B] mb-4">
              Powered by Nature
            </h2>
            <p className="max-w-[560px] mx-auto">
              Carefully selected botanical ingredients inspired by traditional herbal hair care.
            </p>
          </Reveal>
          <div className="max-w-[1160px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
            {INGREDIENTS.map((ing) => (
              <Reveal key={ing.name}>
                <div className="bg-[#FFFDF8] rounded-[22px] p-3.5 pb-6 shadow-md border border-[#244D2B]/10 hover:-translate-y-1.5 hover:shadow-xl transition">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                    <Image src={ing.img} alt={ing.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold text-[#244D2B] px-2.5 mb-1">
                    {ing.name}
                  </h3>
                  <p className="text-sm px-2.5">{ing.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* product / shop */}
        <section id="shop" className="py-24 px-6 bg-[#FFFDF8] relative overflow-hidden">
          <div className="max-w-[1160px] mx-auto grid md:grid-cols-2 gap-16 relative z-10">
            <Reveal>
              <div className="aspect-square rounded-[26px] bg-[radial-gradient(circle,#EDF1E4,#A8B89A_130%)] grid place-items-center overflow-hidden">
                {bottleShot(gallery[galleryIdx], "scale-90")}
              </div>
              <div className="flex gap-3 mt-3.5">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    aria-pressed={galleryIdx === i}
                    aria-label={`View image ${i + 1}`}
                    onClick={() => setGalleryIdx(i)}
                    className={`relative w-[72px] h-[72px] rounded-2xl overflow-hidden border-2 ${
                      galleryIdx === i ? "border-[#244D2B]" : "border-transparent"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">
                The shampoo
              </span>
              <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#244D2B] mb-2">
                Meet Your HERBELLE Shampoo
              </h2>
              <h3 className="text-xl mb-2">{PRODUCT_NAME}</h3>
              <p>
                A botanical-inspired shampoo created for a fresh, simple and nature-inspired everyday hair-care
                experience.
              </p>
              <div className="text-[#8A6A4A] font-medium tracking-wide">250 ML</div>
              <div className="font-[family-name:var(--font-serif)] font-semibold text-3xl text-[#244D2B] mb-1">
                {money(1)}
              </div>
              <div className="inline-flex items-center border border-[#244D2B]/15 rounded-full overflow-hidden my-1.5 mb-5">
                <button
                  aria-label="Decrease"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-[46px] h-[46px] text-xl text-[#244D2B]"
                >
                  −
                </button>
                <span className="min-w-9 text-center font-semibold">{qty}</span>
                <button
                  aria-label="Increase"
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="w-[46px] h-[46px] text-xl text-[#244D2B]"
                >
                  +
                </button>
              </div>
              <div className="flex gap-3.5 flex-wrap">
                <button
                  onClick={() => {
                    setCart((c) => Math.min(20, c + qty));
                    setCartOpen(true);
                  }}
                  className="min-h-[48px] inline-flex items-center px-7 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#244D2B] text-[#F8F3E8] hover:bg-[#4F7A45] transition"
                >
                  Add to cart
                </button>
                <a
                  href={whatsappLink(qty)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] inline-flex items-center px-7 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#244D2B] text-[#244D2B] transition"
                >
                  Buy now
                </a>
              </div>
              <ul className="list-none p-0 mt-6 space-y-1 text-[#244D2B]">
                <li>✓ Herbal-inspired formula</li>
                <li>✓ Carefully selected ingredients</li>
                <li>✓ Small-batch concept</li>
                <li>✓ Everyday hair-care ritual</li>
              </ul>
            </Reveal>
          </div>
        </section>

        {/* benefits */}
        <section id="benefits" className="py-24 px-6">
          <Reveal className="max-w-[1160px] mx-auto text-center">
            <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">
              Benefits
            </span>
            <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#244D2B]">
              Why Choose HERBELLE?
            </h2>
          </Reveal>
          <div className="max-w-[1160px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
            {BENEFITS.map((b) => (
              <Reveal key={b.title}>
                <div className="bg-[#FFFDF8] rounded-[22px] p-8 shadow-md border border-[#244D2B]/10 hover:-translate-y-1.5 hover:shadow-xl transition">
                  <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold text-[#244D2B] tracking-wide mb-1">
                    {b.title}
                  </h3>
                  <p className="text-sm">{b.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        const STEPS = [
  { n: "01 — WET", copy: "Thoroughly wet your hair.", img: "/images/step-wet.jpg" },
  { n: "02 — MASSAGE", copy: "Apply a suitable amount and gently massage into the scalp and hair.", img: "/images/step-massage.jpg" },
  { n: "03 — RINSE", copy: "Rinse thoroughly and repeat if desired.", img: "/images/step-rinse.jpg" },
];
{/* how to use */}
<section className="py-24 px-6 bg-[#FFFDF8]">
  <Reveal className="max-w-[1160px] mx-auto text-center">
    <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">
      How to use
    </span>
    <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#244D2B]">
      Three simple steps
    </h2>
  </Reveal>
  <div className="max-w-[1160px] mx-auto grid md:grid-cols-3 gap-10 mt-12 text-center">
    {STEPS.map((s) => (
      <Reveal key={s.n}>
        <div className="relative w-[130px] h-[130px] mx-auto mb-5 rounded-full overflow-hidden border-2 border-[#A8B89A] shadow-md">
          <Image src={s.img} alt={s.n} fill className="object-cover" sizes="130px" />
        </div>
        <div className="font-[family-name:var(--font-serif)] font-semibold text-[#8A6A4A] tracking-widest mb-1">
          {s.n}
        </div>
        <p>{s.copy}</p>
      </Reveal>
    ))}
  </div>
</section>
        </section>

        {/* reviews */}
        <section id="reviews" className="py-24 px-6">
          <Reveal className="max-w-[1160px] mx-auto text-center">
            <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">
              Reviews
            </span>
            <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#244D2B] mb-3">
              What Our Customers Say
            </h2>
            <p className="text-xs text-[#8A6A4A] max-w-[560px] mx-auto">
              Sample placeholder reviews for development — not real customer testimonials. Replace the REVIEWS array
              with verified reviews.
            </p>
          </Reveal>
          <div className="max-w-[1160px] mx-auto mt-10 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 [scrollbar-width:none]">
            {REVIEWS.map((r) => (
              <figure
                key={r.name}
                className="flex-none w-[min(380px,86%)] snap-start bg-[#FFFDF8] border border-[#244D2B]/10 rounded-[22px] p-7 shadow-md m-0"
              >
                <div className="text-[#B98B3E] tracking-widest">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
                <p className="font-[family-name:var(--font-serif)] italic font-medium text-xl my-3">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 font-semibold text-[#244D2B]">
                  <span className="w-11 h-11 rounded-full bg-[#A8B89A] text-[#244D2B] grid place-items-center font-[family-name:var(--font-serif)] text-xl">
                    {r.name.slice(-1)}
                  </span>
                  {r.name}
                </div>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-[#244D2B] text-[#F8F3E8] text-center py-32 px-6 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-[120%] opacity-[0.09] grayscale invert mix-blend-screen">
            <Logo className="w-full" />
          </div>
          <Reveal className="relative z-10 max-w-[1160px] mx-auto">
            <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#F8F3E8] mb-4">
              Bring Nature Into Your Hair-Care Ritual.
            </h2>
            <p className="max-w-[520px] mx-auto mb-7 opacity-90">
              Discover HERBELLE Organic Herbal Shampoo and make your everyday routine a little more natural.
            </p>
            <a
              href="#shop"
              className="min-h-[48px] inline-flex items-center px-7 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#F8F3E8] text-[#244D2B] hover:-translate-y-0.5 transition"
            >
              Shop HERBELLE
            </a>
          </Reveal>
        </section>

        {/* order via WhatsApp */}
        <section id="order" className="py-24 px-6">
          <Reveal className="max-w-[1160px] mx-auto text-center">
            <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">
              Order
            </span>
            <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#244D2B] mb-3">
              Place Your Order
            </h2>
            <p className="max-w-[560px] mx-auto">
              Send us your order details on WhatsApp and we&rsquo;ll get it ready for you.
            </p>
          </Reveal>

          <div className="bg-[#FFFDF8] border border-[#244D2B]/10 rounded-[26px] p-10 max-w-[600px] mx-auto mt-11 shadow-xl text-center">
            <p className="mb-6">
              Tap the button below to open WhatsApp with your order pre-filled — just confirm your name, address and
              quantity and send it across.
            </p>
            <a
              href={whatsappLink(cart)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 px-8 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#25D366] text-white hover:opacity-90 transition"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.6-.3z" />
                <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5.1-1.3C8.5 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.9 14.7 3.5 13.4 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z" />
              </svg>
              Order via WhatsApp
            </a>
            {cart > 0 && (
              <p className="text-xs text-[#8A6A4A] mt-4">
                Your message will include: {cart} × {PRODUCT_NAME}
              </p>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 bg-[#FFFDF8]">
          <Reveal className="max-w-[1160px] mx-auto text-center">
            <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">FAQ</span>
            <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#244D2B]">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <div className="max-w-[820px] mx-auto mt-9">
            {FAQS.map((f) => (
              <details key={f.q} className="border-b border-[#244D2B]/10 py-1.5 group">
                <summary className="cursor-pointer list-none py-4.5 font-[family-name:var(--font-serif)] font-semibold text-xl text-[#244D2B] flex justify-between gap-4">
                  {f.q}
                  <span className="transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="pb-3.5 opacity-85">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* contact */}
        <section id="contact" className="py-24 px-6">
          <div className="max-w-[1160px] mx-auto grid md:grid-cols-2 gap-16">
            <Reveal>
              <span className="block text-xs tracking-[0.22em] font-semibold text-[#4F7A45] uppercase mb-3.5">
                Contact
              </span>
              <h2 className="font-[family-name:var(--font-serif)] font-semibold text-[clamp(2rem,4vw,3.2rem)] text-[#244D2B] mb-4">
                Let&rsquo;s Stay Connected
              </h2>
              <ul className="list-none p-0 m-0 mb-5">
                {[
                  `📞 Phone: +${WHATSAPP_NUMBER}`,
                  "📧 Email: hello@herbelle.example",
                  "📍 Location: Pakistan",
                  "📱 Instagram: @herbelle",
                  "📱 Facebook: /herbelle",
                  "📱 TikTok: @herbelle",
                ].map((line) => (
                  <li key={line} className="py-2 border-b border-[#244D2B]/10">
                    {line}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#8A6A4A]">Contact details are placeholders — replace with real ones.</p>
            </Reveal>
            <Reveal>
              <form
                onSubmit={submitContact}
                className="bg-[#FFFDF8] border border-[#244D2B]/10 rounded-[26px] p-7 shadow-xl"
              >
                {!contactDone ? (
                  <div className="grid gap-4">
                    <Field label="Name" full error={contactErrors.name}>
                      <input
                        className="input"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      />
                    </Field>
                    <Field label="Email" full error={contactErrors.email}>
                      <input
                        type="email"
                        className="input"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      />
                    </Field>
                    <Field label="Message" full error={contactErrors.message}>
                      <textarea
                        className="input"
                        rows={4}
                        value={contact.message}
                        onChange={(e) => setContact({ ...contact, message: e.target.value })}
                      />
                    </Field>
                    <button
                      type="submit"
                      className="w-full min-h-[48px] rounded-full text-xs font-semibold tracking-widest uppercase bg-[#244D2B] text-[#F8F3E8] hover:bg-[#4F7A45] transition"
                    >
                      Send message
                    </button>
                  </div>
                ) : (
                  <p className="text-center py-6">Thank you — your message has been noted. We&rsquo;ll reply soon. 🌿</p>
                )}
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="bg-[#173019] text-[#E6EBDD] pt-18 pb-8 px-6">
        <div className="max-w-[1160px] mx-auto grid md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="w-[110px] bg-[#F8F3E8] rounded-2xl mb-3.5">
              <Logo className="w-full" />
            </div>
            <p className="font-[family-name:var(--font-serif)] font-semibold text-2xl m-0">HERBELLE</p>
            <p className="opacity-80">Nature&rsquo;s Care, Beautifully Bottled.</p>
          </div>
          <FooterCol title="Quick links" links={["Home", "Our Story", "Ingredients", "Shop", "Contact"]} />
          <FooterCol title="Customer care" links={["FAQs", "Shipping", "Returns", "Privacy Policy", "Terms"]} />
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A8B89A] mb-3.5">Follow</h4>
            {["Instagram", "Facebook", "TikTok"].map((l) => (
              <a key={l} href="#contact" className="block py-1 opacity-85 hover:opacity-100 hover:text-[#A8B89A]">
                {l}
              </a>
            ))}
            <a
              href={whatsappLink(cart)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-3 min-h-[44px] items-center px-6 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#F8F3E8] text-[#244D2B]"
            >
              Order now
            </a>
          </div>
        </div>
        <div className="max-w-[1160px] mx-auto mt-11 pt-5 border-t border-white/10 text-sm opacity-70">
          © 2026 HERBELLE. All Rights Reserved.
        </div>
      </footer>

      {/* cart drawer */}
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 bg-black/45 z-[90] transition-opacity ${
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        aria-hidden={!cartOpen}
        className={`fixed top-0 right-0 bottom-0 w-[min(420px,100%)] bg-[#FFFDF8] z-[100] flex flex-col p-6 transition-transform duration-500 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="m-0 font-[family-name:var(--font-serif)] text-xl font-semibold text-[#244D2B]">Your bag</h3>
          <button aria-label="Close cart" onClick={() => setCartOpen(false)} className="w-11 h-11 grid place-items-center text-[#244D2B]">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {cart ? (
            <div className="flex gap-4 items-center py-5 border-b border-[#244D2B]/10">
              <div className="relative w-16 h-[84px] rounded-xl overflow-hidden flex-none">
                <Image src={gallery[0]} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <strong>{PRODUCT_NAME}</strong>
                <br />
                <small>250 ML · {money(1)}</small>
                <div className="inline-flex items-center border border-[#244D2B]/15 rounded-full overflow-hidden my-2">
                  <button onClick={() => setCart((c) => Math.max(0, c - 1))} className="w-10 h-10 text-lg text-[#244D2B]">
                    −
                  </button>
                  <span className="min-w-8 text-center font-semibold">{cart}</span>
                  <button onClick={() => setCart((c) => Math.min(20, c + 1))} className="w-10 h-10 text-lg text-[#244D2B]">
                    +
                  </button>
                </div>
                <br />
                <button onClick={() => setCart(0)} className="text-xs text-[#8A6A4A] underline">
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#8A6A4A] text-center py-10">
              Your bag is empty. Add HERBELLE shampoo to begin.
            </p>
          )}
        </div>
        {cart > 0 && (
          <div>
            <p className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{PRICE ? money(cart) : `Rs. 599 × ${cart}`}</span>
            </p>
            <a
              href={whatsappLink(cart)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setCartOpen(false)}
              className="block text-center w-full min-h-[48px] leading-[48px] rounded-full text-xs font-semibold tracking-widest uppercase bg-[#25D366] text-white hover:opacity-90 transition"
            >
              Order via WhatsApp
            </a>
            <p className="text-xs text-[#8A6A4A] text-center mt-2.5">You&rsquo;ll be redirected to WhatsApp to confirm.</p>
          </div>
        )}
      </aside>

      <style jsx global>{`
        @keyframes bob {
          to {
            transform: translateY(-8px);
          }
        }
        .input {
          width: 100%;
          min-height: 48px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(36, 77, 43, 0.14);
          background: #fffdf8;
          color: #1f2a20;
          font: inherit;
        }
        .input:focus {
          outline: 2px solid #4f7a45;
          border-color: #4f7a45;
        }
      `}</style>
    </div>
  );
}

/* ---------- helpers ---------- */

function Field({
  label,
  children,
  error,
  full,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-semibold text-[#244D2B] mb-1.5 tracking-wide">{label}</label>
      {children}
      <span className="block min-h-[1em] text-xs text-[#B3402E] mt-1">{error}</span>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A8B89A] mb-3.5">{title}</h4>
      {links.map((l) => (
        <a
          key={l}
          href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
          className="block py-1 opacity-85 hover:opacity-100 hover:text-[#A8B89A]"
        >
          {l}
        </a>
      ))}
    </div>
  );
}