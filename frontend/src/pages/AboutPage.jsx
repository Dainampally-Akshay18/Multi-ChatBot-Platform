import React from 'react';
import { Sparkles, User, BrainCircuit, Mail, Phone, Code, Database, Wind, Bot } from 'lucide-react';

// --- Sub-components for a cleaner structure ---

// A pill-style component for displaying technologies
const TechPill = ({ icon: Icon, label, color }) => (
  <div
    className="flex items-center gap-3 rounded-full bg-slate-800/50 px-4 py-2 border border-slate-700/80 transition-all duration-300 hover:border-slate-500 hover:bg-slate-800"
  >
    <Icon className={`w-5 h-5 ${color}`} />
    <span className="text-sm font-medium text-slate-300">{label}</span>
  </div>
);

// A standardized component for section headers
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <Icon className="w-7 h-7 text-indigo-400" />
    <h3 className="text-2xl font-bold text-slate-100">{title}</h3>
  </div>
);

// A styled link for contact information
const ContactLink = ({ icon: Icon, href, text }) => (
  <a
    href={href}
    className="group flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-slate-800/50"
  >
    <Icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors duration-300" />
    <span className="text-slate-300 group-hover:text-white transition-colors duration-300 break-all">
      {text}
    </span>
  </a>
);

/**
 * Main Component: AboutPage
 * A visually stunning, enterprise-grade "About" page.
 * Features:
 * - Dark theme with glassmorphism effects.
 * - Fluid, responsive layout.
 * - Component-based structure for clean, maintainable code.
 */
const AboutPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
      {/* Animated Aurora Background */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-sky-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center">
          {/* --- Main Platform Info --- */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-slate-900/50 rounded-3xl flex items-center justify-center mx-auto border-2 border-indigo-500/50 shadow-[0_0_20px_theme(colors.indigo.500/0.3)]">
              <Sparkles className="w-12 h-12 text-indigo-400" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500 mb-6">
            Multi-Chatbot AI Platform
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto">
            Empowering intelligent conversations with a suite of specialized AI assistants.
          </p>
        </div>

        {/* --- Main Content Glass Card --- */}
        <div className="mt-16 sm:mt-20 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/80 shadow-2xl shadow-indigo-900/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px">
            
            {/* --- Left Column: Developer Profile & Vision --- */}
            <div className="col-span-1 lg:col-span-1 p-8 lg:border-r border-slate-700/80">
              <div>
                <SectionHeader icon={User} title="The Developer" />
                
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5 mb-10">
                  <div className="relative group">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg"
                      alt="Developer - Chilukuri Dileep"
                      className="relative w-32 h-32 rounded-full object-cover ring-2 ring-slate-800"
                    />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">Chilukuri Dileep</h4>
                    <p className="text-indigo-400">AI Researcher & Full-Stack Developer</p>
                  </div>
                  <p className="text-slate-400 text-sm">
                    An accomplished academic holding B.Tech and M.Tech degrees. As a passionate Lecturer and Ph.D. candidate in Deep Learning, his work bridges theory and practice.
                  </p>
                </div>

                <SectionHeader icon={BrainCircuit} title="Our Vision" />
                <p className="text-slate-400 text-sm">
                  To build intelligent, intuitive, and accessible AI tools that empower users to solve complex problems and enhance productivity. This platform is a step towards creating specialized assistants that are both powerful and easy to use.
                </p>
              </div>
            </div>

            {/* --- Right Columns: Tech & Contact --- */}
            <div className="col-span-1 lg:col-span-2 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Tech Stack */}
                <div>
                  <SectionHeader icon={Code} title="Technology Stack" />
                  <div className="flex flex-wrap gap-3">
                    <TechPill icon={Bot} label="Frontend: React + Vite" color="text-sky-400" />
                    <TechPill icon={Wind} label="Styling: TailwindCSS" color="text-cyan-400" />
                    <TechPill icon={Database} label="Backend: FastAPI" color="text-green-400" />
                    <TechPill icon={Bot} label="AI/ML: LangChain + GROQ" color="text-purple-400" />
                    <TechPill icon={Wind} label="Deployment: Netlify" color="text-teal-400" />
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <SectionHeader icon={Mail} title="Get In Touch" />
                  <div className="flex flex-col gap-2">
                    <ContactLink 
                      icon={Mail}
                      href="mailto:your-email@example.com"
                      text="your-email@example.com"
                    />
                    <ContactLink 
                      icon={Phone}
                      href="tel:+911234567890"
                      text="+91 12345 67890"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;