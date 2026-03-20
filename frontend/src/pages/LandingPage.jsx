import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Video, Brain, Target, Users, ArrowRight, CheckCircle,
  BarChart3, Shield, Zap, Star, ChevronRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: Brain,
    title: "AI-Powered Mock Interviews",
    desc: "Practice with intelligent question banks tailored to top companies. Get instant feedback on your performance.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Online Assessments",
    desc: "Take timed coding challenges and MCQ tests. Track your progress with detailed analytics.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Video,
    title: "Live Video Interviews",
    desc: "Real-time video calls with screen sharing. Recruiters can take notes and rate candidates live.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Comprehensive dashboards for candidates and recruiters. Hiring funnel, skill heatmaps, and more.",
    color: "from-green-500 to-emerald-500",
  },
];

const stats = [
  { value: "10,000+", label: "Active Candidates" },
  { value: "500+", label: "Partner Companies" },
  { value: "95%", label: "Placement Rate" },
  { value: "50K+", label: "Interviews Conducted" },
];

const companies = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Spotify", "Uber"];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute top-60 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5 border-b border-border/50 glass-strong">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">HireFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
          <a href="#companies" className="hover:text-foreground transition-colors">Companies</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-sm">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="text-sm shadow-lg shadow-primary/25">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8"
        >
          <Star className="w-4 h-4" />
          #1 Smart Hiring Platform for Tech Talent
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
        >
          <span className="text-foreground">Prepare.</span>{" "}
          <span className="text-gradient">Assess.</span>{" "}
          <span className="text-foreground">Get Hired.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="mt-6 text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
        >
          The all-in-one platform connecting top tech talent with leading companies.
          AI-powered assessments, live video interviews, and real-time analytics.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/signup">
            <Button className="text-base px-8 py-6 gap-2 shadow-xl shadow-primary/30 glow-primary">
              Start as Candidate <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="secondary" className="text-base px-8 py-6 gap-2 border-border">
              Recruiter Portal <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted"
        >
          {["Free to Start", "No Credit Card", "Enterprise Ready"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {t}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything You Need to <span className="text-gradient">Succeed</span>
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto">
            From preparation to placement — we've got every step covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="group relative p-8 rounded-2xl glass hover:border-primary/30 transition-all duration-300 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="rounded-2xl glass-strong p-10 md:p-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-extrabold text-gradient">{s.value}</p>
                <p className="mt-2 text-muted text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <p className="text-muted text-sm font-medium uppercase tracking-wider">Trusted by talent from top companies</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {companies.map((name, i) => (
            <motion.div
              key={name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="text-2xl md:text-3xl font-bold text-slate-600 hover:text-slate-400 transition-colors cursor-default select-none"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-2xl glass-strong p-12 md:p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground relative z-10">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 text-muted max-w-lg mx-auto relative z-10">
            Join thousands of candidates and recruiters already using HireFlow.
          </p>
          <Link to="/signup" className="relative z-10">
            <Button className="mt-8 text-base px-10 py-6 gap-2 shadow-xl shadow-primary/30 glow-primary">
              Get Started — It's Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 text-center text-sm text-muted">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-500 rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-foreground">HireFlow</span>
        </div>
        <p>© 2026 HireFlow. Smart Interview Preparation, Assessment & Talent Hiring.</p>
      </footer>
    </div>
  );
}
