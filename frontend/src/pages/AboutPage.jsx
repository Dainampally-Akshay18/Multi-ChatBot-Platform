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
    // Main container with a soft, light background for an airy feel
    <section className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
      
      {/* --- Hero Section --- */}
      {/* A clean, white card with subtle shadows for a premium look */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-lg mb-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          
          {/* Profile Image */}
          <div className="relative group flex-shrink-0">
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md">
              <img 
                src="https://res.cloudinary.com/dadapse5k/image/upload/v1759377580/akshay4_k1qqtn.png" 
                alt="Dainampally Akshay Kireet"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            {/* Subtle ring effect for a modern touch */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10" />
          </div>

          {/* Header Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Professional title pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-800 border border-sky-200 mb-4">
              <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              <span className="text-sm font-semibold">AI Researcher & Full-Stack Developer</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Dainampally Akshay Kireet
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              A highly motivated professional with a solid foundation in Data Structures and Algorithms (DSA) and 
              Machine Learning (ML) algorithms, capable of analyzing complex problems and developing efficient solutions.
            </p>

            {/* Tags with a clear visual distinction for the primary one */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-sm">
                📚 B.Tech Graduate
              </div>
              <div className="px-4 py-2 rounded-xl bg-sky-100 border border-sky-200 text-sky-800 text-sm font-medium">
                💼 Microsoft Intern
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-sm">
                🚀 Quick Learner
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Mission, Vision, Experience */}
        <div className="space-y-8">
          {/* Mission Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-bold text-slate-800">Mission</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              To bridge the gap between cutting-edge AI research and practical software solutions, 
              creating intelligent systems that solve real-world problems while fostering collaboration 
              and innovation in dynamic technological environments.
            </p>
          </div>

          {/* Vision Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-2xl">
                🔭
              </div>
              <h3 className="text-xl font-bold text-slate-800">Vision</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              To become a leading innovator in AI-driven full-stack development, pushing the boundaries 
              of what's possible while maintaining a strong focus on ethical AI practices and sustainable 
              technological growth.
            </p>
          </div>

          {/* Microsoft Experience Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-2xl">
                🏢
              </div>
              <h3 className="text-xl font-bold text-slate-800">Microsoft Intern Experience</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Microsoft intern with a passion for technology and an insatiable curiosity for emerging innovations. 
              As a dedicated student pursuing advanced degrees, I bring hands-on experience from my internship 
              while bridging academic knowledge with real-world applications in AI and software development.
            </p>
          </div>
        </div>

        {/* Right Column: Technical Skills */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Technical Skills
            </h2>
            <div className="w-16 h-1 bg-sky-500 rounded-full mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            {/* Mapping over skills for cleaner, more maintainable code */}
            {[
              { category: 'Artificial Intelligence', skills: ['Langchain'] },
              { category: 'Cloud Platforms', skills: ['Microsoft Azure', 'IaaS / PaaS / SaaS'] },
              { category: 'Databases', skills: ['MongoDB', 'SQL'] },
              { category: 'Data Analysis', skills: ['NumPy / Pandas', 'Matplotlib'] },
              { category: 'Frontend', skills: ['React.js', 'HTML/CSS', 'JavaScript'] },
              { category: 'Backend', skills: ['Node.js / Express.js', 'FastAPI'] },
              { category: 'Languages', skills: ['Python', 'C++', 'JavaScript'] },
            ].map(({ category, skills }) => (
              <div key={category} className="group">
                <h4 className="text-slate-800 font-semibold mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-sm hover:bg-slate-200 transition-colors duration-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Key Strengths */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h4 className="text-slate-800 font-semibold mb-4 text-center">Key Strengths</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { icon: '⚡', text: 'Fast Learner' },
                { icon: '🔍', text: 'Problem Solver' },
                { icon: '🤝', text: 'Team Player' },
                { icon: '🚀', text: 'Innovative' }
              ].map((strength) => (
                <div key={strength.text} className="p-3 bg-slate-100 rounded-xl border border-slate-200 hover:bg-slate-200 hover:-translate-y-1 transition-all duration-300">
                  <div className="text-xl mb-1">{strength.icon}</div>
                  <div className="text-slate-600 text-xs font-medium">{strength.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Contact CTA --- */}
      <div className="mt-8 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Let's Build Something Amazing Together</h3>
          <p className="text-slate-600 mb-5">Ready to collaborate on innovative projects and push technological boundaries.</p>
          <button 
            className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold shadow-lg shadow-sky-500/20 hover:bg-sky-700 hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300 transform" 
            onClick={() => window.open('https://www.linkedin.com/in/dainampallyakshay/', '_blank')}
          >
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
