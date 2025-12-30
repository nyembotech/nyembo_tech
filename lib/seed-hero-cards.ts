import { db } from "@/lib/firebase";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { HeroCard } from "@/types/hero-card";

const initialCards: HeroCard[] = [
    {
        id: "web-platforms",
        title: "Web Platforms",
        subtitle: "Future-Ready Architecture",
        description: "Experience the next evolution of web development. We build high-performance, scalable platforms tailored for the digital age.",
        modalContent: `
            <div class="space-y-4">
                <img src="/assets/images/hero_cards/web-platforms.png" alt="Web Platforms" class="w-full h-auto rounded-xl shadow-2xl border border-white/10" />
                <p><strong>Scalability at Core:</strong> Our web solutions are architected to handle millions of requests with sub-millisecond latency.</p>
                <p>From complex SaaS dashboards to immersive 3D experiences, we leverage <em>Next.js</em>, <em>React</em>, and edge computing to deliver unparalleled performance.</p>
                <ul class="list-disc pl-5 space-y-1 text-sm text-gray-400">
                    <li>Progressive Web Apps (PWA)</li>
                    <li>Server-Side Rendering (SSR)</li>
                    <li>Global CDN Distribution</li>
                </ul>
            </div>
        `,
        imageUrl: "/assets/images/hero_cards/web-platforms.png",
        order: 1,
        color: "from-blue-600 to-cyan-400"
    },
    {
        id: "mobile-apps",
        title: "Mobile Apps",
        subtitle: "Native & Cross-Platform",
        description: "Seamless mobile experiences that bridge the gap between user intent and digital action. iOS and Android excellence.",
        modalContent: `
            <div class="space-y-4">
                <img src="/assets/images/hero_cards/mobile-apps.png" alt="Mobile Apps" class="w-full h-auto rounded-xl shadow-2xl border border-white/10" />
                <p><strong>Fluid Interactions:</strong> We design apps that feel alive. Using Flutter and React Native, we deploy to both iOS and Android without compromising related native performance.</p>
                <p>Our mobile solutions integrate deep device capabilities—AR, biometrics, and on-device ML—to create truly smart applications.</p>
            </div>
        `,
        imageUrl: "/assets/images/hero_cards/mobile-apps.png",
        order: 2,
        color: "from-emerald-500 to-teal-900"
    },
    {
        id: "consulting",
        title: "Consulting",
        subtitle: "Strategic Digital Growth",
        description: "Navigating the complexities of digital transformation with data-driven strategies and expert foresight.",
        modalContent: `
            <div class="space-y-4">
                <img src="/assets/images/hero_cards/consulting.png" alt="Consulting" class="w-full h-auto rounded-xl shadow-2xl border border-white/10" />
                <p><strong>Vision to Reality:</strong> We don't just advise; we architect your future. Our consultants specialize in identifying high-impact AI opportunities within your workflow.</p>
                <p>From legacy modernization to AI governance, we provide the roadmap for sustainable tech leadership.</p>
            </div>
        `,
        imageUrl: "/assets/images/hero_cards/consulting.png",
        order: 3,
        color: "from-orange-500 to-amber-200"
    },
    {
        id: "trainings",
        title: "Trainings",
        subtitle: "Empower Your Workforce",
        description: "Upskilling teams with cutting-edge tech. From zero to hero in modern stack development and AI literacy.",
        modalContent: `
            <div class="space-y-4">
                <img src="/assets/images/hero_cards/trainings.png" alt="Trainings" class="w-full h-auto rounded-xl shadow-2xl border border-white/10" />
                <p><strong>Knowledge Transfer:</strong> Technology is only as good as the people using it. Our corporate training programs cover the full spectrum of modern engineering.</p>
                <p>Interactive bootcamps on Cloud Architecture, AI Integration, and Advanced Frontend Engineering.</p>
            </div>
        `,
        imageUrl: "/assets/images/hero_cards/trainings.png",
        order: 4,
        color: "from-pink-600 to-rose-400"
    },
    {
        id: "ai-engineering",
        title: "AI Engineering",
        subtitle: "Neural Intelligence",
        description: "Custom AI models, predictive analytics, and autonomous agents designed to solve your hardest problems.",
        modalContent: `
            <div class="space-y-4">
                <img src="/assets/images/hero_cards/ai-engineering.png" alt="AI Engineering" class="w-full h-auto rounded-xl shadow-2xl border border-white/10" />
                <p><strong>Beyond Automation:</strong> We build cognitive systems. Whether it's LLM fine-tuning, computer vision, or predictive maintenance models, we engineer intelligence into your stack.</p>
                <p>Harness the power of neural networks to unlock insights invisible to the human eye.</p>
            </div>
        `,
        imageUrl: "/assets/images/hero_cards/ai-engineering.png",
        order: 5,
        color: "from-red-600 to-purple-600"
    }
];

export async function seedHeroCards() {
    try {
        const batch = writeBatch(db);
        initialCards.forEach(card => {
            const ref = doc(collection(db, "hero_cards"), card.id);
            batch.set(ref, card);
        });
        await batch.commit();
        console.log("Hero Cards seeded successfully with creative content");
    } catch (error) {
        console.error("Error seeding hero cards:", error);
    }
}
