import { useEffect, useState } from "react";
import { Brain, Zap, Network } from "lucide-react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

interface Thought {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
}

const Landing: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoggedIn] = useState<boolean>(false);

  const navigate = useNavigate();

  const thoughtTexts = [
    "Remember that YouTube video about GPT-5...",
    "Tweet about Elon Musk's Starlink updates",
    "What was that song I listened to yesterday?",
    "Coffee meeting with Sarah at 3pm",
    "That article about quantum computing",
    "Grocery list: milk, eggs, bread, coffee",
    "Idea: AI-powered recipe generator",
    "Book recommendation from Alex",
    "Flight booking for Paris trip in March",
    "That funny meme about cats and keyboards",
    "Research paper on neural networks",
    "Password for crypto wallet stored safely",
    "Mom's birthday gift ideas - jewelry?",
    "Netflix series to binge watch this weekend",
    "Code snippet for React useEffect hooks",
    "Dream about flying over mountains last night",
    "Meeting notes from Monday's standup",
    "Podcast about productivity and focus",
    "Restaurant recommendation downtown - Italian",
    "Holiday plans for December vacation",
    "Learn Spanish - keep Duolingo streak alive",
    "That blockchain project idea for NFTs",
    "Workout routine for next week - cardio focus",
    "Photography tips from that tutorial",
    "Bug fix for sidebar component rendering",
    "Quote from that philosophy book by Camus",
    "Weather forecast for weekend hiking trip",
    "Investment portfolio review - tech stocks",
    "New keyboard shortcuts to memorize for VS Code",
    "That interesting conversation about AI ethics",
    "Meditation app subscription expires soon",
    "Recipe for homemade pizza dough proportions",
    "Thank you note to write to mentor",
    "Backup photos from last month's trip",
    "Update LinkedIn profile with new skills",
    "Call dentist to schedule cleaning appointment",
    "Research best practices for TypeScript",
    "That documentary about space exploration",
    "Friend's wedding in June - save the date",
    "Morning routine optimization ideas",
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Initialize thoughts scattered across the entire screen from start
    const initialThoughts: Thought[] = [];
    const verticalSections = 12; // Divide screen into sections for even distribution
    const thoughtCount =
      window.innerWidth < 640 ? 36 : window.innerWidth < 1024 ? 54 : 72;

    for (let i = 0; i < thoughtCount; i++) {
      const sectionHeight = window.innerHeight / verticalSections;
      const sectionIndex = i % verticalSections;

      const thought: Thought = {
        id: i,
        text: thoughtTexts[Math.floor(Math.random() * thoughtTexts.length)],
        // Distribute thoughts across the entire screen width initially
        x: Math.random() * (window.innerWidth + 800) - 400, // From -400 to window.innerWidth + 400
        y:
          sectionIndex * sectionHeight +
          Math.random() * sectionHeight * 0.8 +
          sectionHeight * 0.1,
        speed: prefersReducedMotion ? 0 : 0.5 + Math.random() * 0.5,
        opacity: 0.25 + Math.random() * 0.35,
      };
      initialThoughts.push(thought);
    }

    setThoughts(initialThoughts);

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animate thoughts
    const thoughtInterval = prefersReducedMotion
      ? undefined
      : window.setInterval(() => {
          setThoughts((prev) =>
            prev.map((thought) => {
              let newX = thought.x - thought.speed;

              // Reset thought when it goes off screen with even distribution
              if (newX < -600) {
                const verticalSections = 12;
                const sectionHeight = window.innerHeight / verticalSections;
                const randomSection = Math.floor(
                  Math.random() * verticalSections
                );

                return {
                  ...thought,
                  text: thoughtTexts[
                    Math.floor(Math.random() * thoughtTexts.length)
                  ],
                  x: window.innerWidth + Math.random() * 400,
                  y:
                    randomSection * sectionHeight +
                    Math.random() * sectionHeight * 0.8 +
                    sectionHeight * 0.1,
                  speed: 0.5 + Math.random() * 0.5,
                  opacity: 0.25 + Math.random() * 0.35,
                };
              }

              return {
                ...thought,
                x: newX,
              };
            })
          );
        }, 16); // ~60fps for smooth animation

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (thoughtInterval) clearInterval(thoughtInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950 relative overflow-hidden">
      {/* Decorative grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px, 36px 36px",
        }}
      />

      {/* Flowing Thoughts Background - Evenly Distributed */}
      <div className="absolute inset-0 pointer-events-none">
        {thoughts.map((thought) => (
          <div
            key={thought.id}
            className="absolute whitespace-nowrap text-blue-200/45 font-light text-sm md:text-base select-none"
            style={{
              left: `${thought.x}px`,
              top: `${thought.y}px`,
              opacity: thought.opacity,
              textShadow: "0 0 15px rgba(59, 130, 246, 0.25)",
              transform: "translateZ(0)",
            }}
          >
            {thought.text}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-8 text-center">
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-blue-500/40 via-blue-400/30 to-indigo-500/40 shadow-2xl shadow-blue-500/20 max-w-4xl w-full">
          <div className="bg-slate-950/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-12 border border-blue-900/30">
            {/* Brain Icon - Clean and Simple */}
            <div className="mb-6 md:mb-8 relative flex justify-center">
              <div className="absolute -inset-10 blur-3xl opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.4),transparent_60%)]" />
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-700 p-4 md:p-6 lg:p-8 rounded-full shadow-xl">
                <Brain className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-200 via-white to-indigo-200 bg-clip-text text-transparent font-tertiary">
              Cerebro
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-blue-100 mb-3 md:mb-4 max-w-2xl mx-auto leading-relaxed font-secondary">
              Your Digital Second Brain
            </p>
            <p className="text-sm md:text-base lg:text-lg text-blue-200/80 mb-8 md:mb-10 lg:mb-12 max-w-xl mx-auto">
              Capture, connect, and evolve your thoughts in an intelligent
              neural network
            </p>

            {/* Feature Icons - Clean */}
            <div className="flex justify-center space-x-6 md:space-x-8 mb-8 md:mb-10 lg:mb-12 opacity-80">
              <div className="flex flex-col items-center group">
                <Network className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-300 mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs md:text-sm text-blue-300/90">
                  Connect
                </span>
              </div>
              <div className="flex flex-col items-center group">
                <Zap className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-300 mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs md:text-sm text-blue-300/90">
                  Evolve
                </span>
              </div>
              <div className="flex flex-col items-center group">
                <Brain className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-300 mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs md:text-sm text-blue-300/90">
                  Think
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Button
                onClick={
                  isLoggedIn
                    ? () => navigate("/dashboard")
                    : () => navigate("/accounts")
                }
                variant="primary"
                size="lg"
                text="Create Brain"
                startIcon={<Brain className="w-5 h-5" />}
              />
              <Button
                variant="secondary"
                size="lg"
                text="See My Brain"
                startIcon={<Network className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cursor Glow Effect */}
      <div
        className="fixed pointer-events-none w-96 h-96 rounded-full opacity-40 md:opacity-25 transition-all duration-500 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background:
            "radial-gradient(circle closest-side, rgba(59,130,246,0.18), transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
};

export default Landing;
