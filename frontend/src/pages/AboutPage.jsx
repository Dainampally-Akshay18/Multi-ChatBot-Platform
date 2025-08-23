import React, { useEffect } from 'react';
import { 
  Sparkles, 
  User, 
  BrainCircuit, 
  Mail, 
  Phone, 
  Code, 
  Database, 
  Wind, 
  Bot,
  Github,
  Linkedin,
  Globe,
  Award,
  BookOpen,
  Zap
} from 'lucide-react';

// Enhanced TechPill with premium animations
const TechPill = ({ icon: Icon, label, color, delay = 0 }) => (
  <div
    className={`group flex items-center gap-3 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-5 py-3 border border-slate-600/50 transition-all duration-500 hover:scale-105 hover:border-indigo-400/60 hover:shadow-lg hover:shadow-indigo-500/20 backdrop-blur-sm animate-fadeInUp`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform duration-300`} />
    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-300">
      {label}
    </span>
  </div>
);

// Enhanced SectionHeader with glowing effect
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="relative mb-8">
    <div className="flex items-center gap-4 mb-2">
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative bg-slate-800/80 p-3 rounded-full border border-indigo-500/30">
          <Icon className="w-6 h-6 text-indigo-400" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
          {title}
        </h3>
        {subtitle && (
          <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </div>
    <div className="h-px bg-gradient-to-r from-indigo-500/50 via-purple-500/30 to-transparent"></div>
  </div>
);

// Enhanced ContactLink with better hover effects
const ContactLink = ({ icon: Icon, href, text, label }) => (
  <a
    href={href}
    className="group relative flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 transition-all duration-300 hover:bg-slate-700/40 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 backdrop-blur-sm"
  >
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative bg-slate-700/50 p-2 rounded-lg">
        <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors duration-300" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className="text-slate-300 group-hover:text-white transition-colors duration-300 text-sm">
        {text}
      </span>
    </div>
  </a>
);

// Floating particle animation component
const FloatingParticle = ({ delay, size, left, top }) => (
  <div
    className={`absolute w-${size} h-${size} bg-indigo-500/20 rounded-full animate-float`}
    style={{
      left: `${left}%`,
      top: `${top}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${3 + Math.random() * 2}s`
    }}
  />
);

/**
 * Main Component: AboutPage
 * A visually stunning, enterprise-grade "About" page with premium animations and effects
 */
const AboutPage = () => {
  // Scroll to top on component mount to fix footer issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Aurora Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-r from-sky-600/20 to-indigo-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            size={Math.random() > 0.5 ? '2' : '1'}
            left={Math.random() * 100}
            top={Math.random() * 100}
          />
        ))}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-20">
          <div className="relative mb-8 animate-fadeInUp">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/30">
              <Sparkles className="w-8 h-8 sm:w-14 sm:h-14 text-indigo-400 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4 animate-fadeInUp animation-delay-200">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
              Multi-Chatbot
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                AI Platform
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-12 sm:w-20"></div>
              <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-12 sm:w-20"></div>
            </div>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Empowering intelligent conversations with a comprehensive suite of 
              <span className="text-indigo-400 font-semibold"> specialized AI assistants</span> designed for the modern world.
            </p>
          </div>
        </div>

        {/* Main Content Card with Advanced Glassmorphism */}
        <div className="relative animate-fadeInUp animation-delay-400">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl shadow-black/20 overflow-hidden">
            
            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
              
              {/* Developer Profile Section */}
              <div className="xl:col-span-5 p-6 sm:p-8 lg:p-10 border-b xl:border-b-0 xl:border-r border-slate-700/50">
                <SectionHeader 
                  icon={User} 
                  title="The Developer" 
                  subtitle="Meet the mind behind the innovation"
                />
                
                <div className="space-y-8">
                  {/* Profile Card */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative bg-slate-800/50 rounded-2xl p-6 border border-slate-600/50 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group/avatar">
                          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-md opacity-50 group-hover/avatar:opacity-75 transition-opacity duration-500"></div>
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg"
                            alt="Developer - Chilukuri Dileep"
                            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-slate-700/50 group-hover/avatar:ring-indigo-500/50 transition-all duration-500"
                          />
                        </div>
                        <div className="text-center sm:text-left space-y-2">
                          <h4 className="text-xl sm:text-2xl font-bold text-white">Akshay</h4>
                          <p className="text-indigo-400 font-medium">AI Researcher & Full-Stack Developer</p>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                            
                            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-2 rounded-lg border border-yellow-500/30">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-yellow-200">Microsoft Intern</span>
                        </div>
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30">
                              B.Tech
                            </span>
                            
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm mt-6 leading-relaxed">
                        Microsoft intern with a passion for technology and an insatiable curiosity for emerging innovations. As a dedicated student pursuing advanced degrees, I bring hands-on experience from my internship while bridging academic knowledge with real-world applications in AI and software development.
                      </p>
                    </div>
                  </div>

                  {/* Vision Section */}
                  <div className="space-y-4">
                    <SectionHeader 
                      icon={BrainCircuit} 
                      title="Our Vision" 
                      subtitle="Building the future of AI interaction"
                    />
                    <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-600/30 backdrop-blur-sm">
                      <p className="text-slate-300 leading-relaxed">
                        To democratize artificial intelligence by creating intuitive, powerful, and accessible AI tools 
                        that enhance human productivity and creativity. Our platform represents a step towards a future 
                        where specialized AI assistants work seamlessly alongside humans to solve complex challenges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technology & Contact Section */}
              <div className="xl:col-span-7 p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  
                  {/* Technology Stack */}
                  <div className="space-y-6">
                    <SectionHeader 
                      icon={Code} 
                      title="Tech Stack" 
                      subtitle="Powered by cutting-edge technologies"
                    />
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h5 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Frontend</h5>
                        <div className="flex flex-wrap gap-3">
                          <TechPill icon={Bot} label="React + Vite" color="text-cyan-400" delay={0} />
                          <TechPill icon={Wind} label="TailwindCSS" color="text-teal-400" delay={100} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Backend & AI</h5>
                        <div className="flex flex-wrap gap-3">
                          <TechPill icon={Database} label="FastAPI" color="text-green-400" delay={200} />
                          <TechPill icon={BrainCircuit} label="LangChain" color="text-purple-400" delay={300} />
                          <TechPill icon={Zap} label="GROQ AI" color="text-orange-400" delay={400} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Deployment</h5>
                        <div className="flex flex-wrap gap-3">
                          <TechPill icon={Globe} label="Netlify" color="text-emerald-400" delay={500} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-6">
                    <SectionHeader 
                      icon={Mail} 
                      title="Get In Touch" 
                      subtitle="Let's connect and collaborate"
                    />
                    <div className="space-y-4">
                      <ContactLink 
                        icon={Mail}
                        href="mailto:dakshay4518@gmail.com"
                        text="dakshay4518@gmail.com"
                        label="Email"
                      />
                      <ContactLink 
                        icon={Github}
                        href="https://github.com/Dainampally-Akshay18"
                        text="GitHub Profile"
                        label="Code Repository"
                      />
                      <ContactLink 
                        icon={Linkedin}
                        href="https://www.linkedin.com/in/dainampallyakshay/"
                        text="LinkedIn Profile"
                        label="Professional Network"
                      />
                    </div>

                    {/* Achievement Badges */}
                    <div className="mt-8">
                      <h5 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Achievements</h5>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-2 rounded-lg border border-yellow-500/30">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-yellow-200">Microsoft Intern</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-3 py-2 rounded-lg border border-blue-500/30">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-blue-200">Google Student Club Web Dev Lead</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        
      </div>

      {/* Custom CSS for animations */}
      
    </div>
  );
};

export default AboutPage;
