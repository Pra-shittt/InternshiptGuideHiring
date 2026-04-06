import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Video, Brain, Target, ArrowRight,
  BarChart3, ChevronRight
} from "lucide-react";
import logoImg from "../assets/logo.png";

const features = [
  {
    icon: Brain,
    title: "Smart Mock Interviews",
    desc: "Practice with curated question banks from top companies. Sharpen your skills with real-world scenarios.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Online Assessments",
    desc: "Take timed MCQ tests and coding challenges. Track your progress with detailed analytics.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Video,
    title: "Live Video Interviews",
    desc: "Real-time video calls with recruiters. Notes, ratings, and structured interview flow built in.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Job Applications",
    desc: "Browse and apply to jobs posted by recruiters. Track your applications from applied to hired.",
    color: "from-green-500 to-emerald-500",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-16 py-5 bg-white/90 backdrop-blur-md border-b border-[#e2ddd8] shadow-sm">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Learn2Hire" className="w-9 h-9 rounded-lg object-cover shadow-lg" />
          <span className="text-xl font-bold text-primary">Learn2Hire</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a href="#features" className="hover:text-[#1e293b] transition-colors">Features</a>
          <a href="#about" className="hover:text-[#1e293b] transition-colors">About</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-sm">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="text-sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section — Clean, minimal */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="text-foreground">Prepare.</span>{" "}
          <span className="text-primary">Assess.</span>{" "}
          <span className="text-foreground">Get Hired.</span>
        </h1>

        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          The all-in-one platform connecting tech talent with leading companies.
          Mock tests, live interviews, and real-time job applications.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup">
            <Button className="text-base px-8 py-6 gap-2">
              Start as Candidate <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="secondary" className="text-base px-8 py-6 gap-2">
              Recruiter Portal <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto">
            From preparation to placement — we've got every step covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-8 rounded-2xl bg-white border border-[#e2ddd8] shadow-sm hover:shadow-md hover:border-[#1e3a5f]/20 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 text-blue-200 max-w-lg mx-auto">
            Join candidates and recruiters already using Learn2Hire.
          </p>
          <Link to="/signup">
            <Button className="mt-8 text-base px-10 py-6 gap-2 bg-white text-[#1e3a5f] hover:bg-[#f5f0eb]">
              Get Started — It's Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2ddd8] py-8 text-center text-sm text-muted">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={logoImg} alt="Learn2Hire" className="w-6 h-6 rounded-md object-cover" />
          <span className="font-bold text-foreground">Learn2Hire</span>
        </div>
        <p>© 2026 Learn2Hire. Smart Interview Preparation, Assessment & Talent Hiring.</p>
      </footer>
    </div>
  );
}
