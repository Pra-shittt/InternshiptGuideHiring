import { motion } from "framer-motion";
import { ExternalLink, Code2, Trophy, Brain, Flame, Target, Terminal, Star, ChevronRight } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

const LEETCODE_PROBLEMS = [
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    tags: ["Binary Search", "Divide and Conquer"],
    color: "text-amber-500"
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/trapping-rain-water/",
    tags: ["Two Pointers", "Dynamic Programming", "Stack"],
    color: "text-amber-500"
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/merge-k-sorted-lists/",
    tags: ["Heap", "Linked List", "Divide and Conquer"],
    color: "text-amber-500"
  },
  {
    title: "Regular Expression Matching",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/regular-expression-matching/",
    tags: ["String", "Dynamic Programming", "Recursion"],
    color: "text-amber-500"
  },
  {
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-valid-parentheses/",
    tags: ["String", "Dynamic Programming", "Stack"],
    color: "text-amber-500"
  }
];

const CODEFORCES_PROBLEMS = [
  {
    title: "G. Shortest Path on a Galaxy",
    difficulty: "Hard (2400)",
    platform: "Codeforces",
    url: "https://codeforces.com/problemset/problem/1715/E",
    tags: ["Graphs", "Shortest Paths", "Convex Hull Trick"],
    color: "text-red-500"
  },
  {
    title: "F. Shifting String",
    difficulty: "Hard (2100)",
    platform: "Codeforces",
    url: "https://codeforces.com/problemset/problem/1690/F",
    tags: ["Strings", "Math", "Number Theory"],
    color: "text-red-500"
  },
  {
    title: "E. Typical Party in Polycarp's World",
    difficulty: "Hard (2300)",
    platform: "Codeforces",
    url: "https://codeforces.com/problemset/problem/1560/E",
    tags: ["Strings", "Greedy", "Implementation"],
    color: "text-red-500"
  },
  {
    title: "D. Distinct Characters Queries",
    difficulty: "Hard (2000)",
    platform: "Codeforces",
    url: "https://codeforces.com/problemset/problem/1234/D",
    tags: ["Data Structures", "Segment Tree", "Bitmasks"],
    color: "text-red-500"
  }
];

export function Assessment() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 space-y-8 overflow-y-auto">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-4">
          <Flame className="w-4 h-4" /> Challenge Your Limits
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          Advanced Problem <span className="text-primary">Repository</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          We've curated the most challenging problems from LeetCode and Codeforces to help you prepare for elite engineering rounds. Master these to reach the top 1%.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LeetCode Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">LeetCode Hard</h2>
              <p className="text-slate-500 text-sm">Top-tier patterns and algorithms</p>
            </div>
          </div>

          <div className="grid gap-4">
            {LEETCODE_PROBLEMS.map((prob, i) => (
              <ProblemCard key={i} prob={prob} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Codeforces Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
              <Brain className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Codeforces Master</h2>
              <p className="text-slate-500 text-sm">Competitive programming classics</p>
            </div>
          </div>

          <div className="grid gap-4">
            {CODEFORCES_PROBLEMS.map((prob, i) => (
              <ProblemCard key={i} prob={prob} index={i} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <Target className="w-8 h-8 text-primary mx-auto" />
            <h3 className="text-3xl font-bold text-white">Level Up</h3>
            <p className="text-slate-500 text-sm">Designed for Senior & Staff levels</p>
          </div>
          <div className="text-center space-y-2 border-y md:border-y-0 md:border-x border-slate-800 py-6 md:py-0">
            <Terminal className="w-8 h-8 text-cyan-400 mx-auto" />
            <h3 className="text-3xl font-bold text-white">Vetted</h3>
            <p className="text-slate-500 text-sm">Hand-picked by industry experts</p>
          </div>
          <div className="text-center space-y-2">
            <Star className="w-8 h-8 text-purple-500 mx-auto" />
            <h3 className="text-3xl font-bold text-white">Elite</h3>
            <p className="text-slate-500 text-sm">Master the core data structures</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function ProblemCard({ prob, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.4 }}
    >
      <a 
        href={prob.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block group"
      >
        <Card className="p-5 bg-slate-900/40 hover:bg-slate-800/60 border-slate-800 hover:border-primary/40 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[10px] uppercase font-bold px-2">
                  {prob.platform}
                </Badge>
                <Badge className={`${prob.color.replace('text', 'bg').replace('-500', '/10')} ${prob.color} border-${prob.color.split('-')[1]}-500/20 text-[10px] uppercase font-bold px-2`}>
                  {prob.difficulty}
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                {prob.title} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </h3>
              <div className="flex flex-wrap gap-2">
                {prob.tags.map((tag, j) => (
                  <span key={j} className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 group-hover:bg-primary/20 transition-colors">
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-primary" />
            </div>
          </div>
        </Card>
      </a>
    </motion.div>
  );
}
