import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { QuestionCard } from "../../components/QuestionCard";
import {
  Search, Filter, ChevronDown, LayoutGrid, List, X,
  Target, CheckCircle, Bookmark, BookmarkCheck, TrendingUp,
  Code, Hash
} from "lucide-react";

// ─── Question Dataset ────────────────────────────────
const questions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "HashMap"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Sliding Window", "String"],
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
    description: "Merge two sorted linked lists and return it as a sorted list made by splicing together the nodes of the two input lists.",
    leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
  },
  {
    id: 4,
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers"],
    description: "Given n non-negative integers a1, a2, ..., an, find two lines that together with the x-axis form a container that holds the most water.",
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
  },
  {
    id: 6,
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    leetcodeUrl: "https://leetcode.com/problems/merge-intervals/",
  },
  {
    id: 7,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "DP"],
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
  },
  {
    id: 8,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "DP"],
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize your profit by choosing a single day to buy and sell.",
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  },
  {
    id: 9,
    title: "Word Search",
    difficulty: "Medium",
    tags: ["Backtracking", "Matrix"],
    description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from sequentially adjacent cells.",
    leetcodeUrl: "https://leetcode.com/problems/word-search/",
  },
  {
    id: 10,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall runtime complexity should be O(log(m+n)).",
    leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
  },
  {
    id: 11,
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["DP", "Math"],
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you reach the top?",
    leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
  },
  {
    id: 12,
    title: "Course Schedule",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "Topological Sort"],
    description: "There are a total of numCourses courses you have to take. Determine if it is possible to finish all courses given their prerequisites.",
    leetcodeUrl: "https://leetcode.com/problems/course-schedule/",
  },
  {
    id: 13,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    tags: ["Tree", "BFS", "DFS"],
    description: "Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how the serialization/deserialization algorithm should work.",
    leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
  },
  {
    id: 14,
    title: "LRU Cache",
    difficulty: "Medium",
    tags: ["HashMap", "Linked List", "Design"],
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get and put operations in O(1).",
    leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
  },
  {
    id: 15,
    title: "Number of Islands",
    difficulty: "Medium",
    tags: ["Graph", "BFS", "DFS", "Matrix"],
    description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
  },
];

// Collect all unique tags
const ALL_TAGS = [...new Set(questions.flatMap((q) => q.tags))].sort();

export function PracticeQuestionsPage() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [solvedSet, setSolvedSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("hf_solved") || "[]")); } catch { return new Set(); }
  });
  const [bookmarkedSet, setBookmarkedSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("hf_bookmarked") || "[]")); } catch { return new Set(); }
  });
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Persist to localStorage
  const toggleSolved = (id) => {
    setSolvedSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("hf_solved", JSON.stringify([...next]));
      return next;
    });
  };

  const toggleBookmark = (id) => {
    setBookmarkedSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("hf_bookmarked", JSON.stringify([...next]));
      return next;
    });
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter questions
  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase()) ||
        q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchDifficulty = !difficultyFilter || q.difficulty === difficultyFilter;
      const matchTags = selectedTags.length === 0 || selectedTags.every((t) => q.tags.includes(t));
      const matchBookmark = !showBookmarked || bookmarkedSet.has(q.id);
      return matchSearch && matchDifficulty && matchTags && matchBookmark;
    });
  }, [search, difficultyFilter, selectedTags, showBookmarked, bookmarkedSet]);

  // Stats
  const totalSolved = solvedSet.size;
  const easySolved = questions.filter((q) => q.difficulty === "Easy" && solvedSet.has(q.id)).length;
  const mediumSolved = questions.filter((q) => q.difficulty === "Medium" && solvedSet.has(q.id)).length;
  const hardSolved = questions.filter((q) => q.difficulty === "Hard" && solvedSet.has(q.id)).length;
  const easyTotal = questions.filter((q) => q.difficulty === "Easy").length;
  const mediumTotal = questions.filter((q) => q.difficulty === "Medium").length;
  const hardTotal = questions.filter((q) => q.difficulty === "Hard").length;
  const progressPct = questions.length > 0 ? Math.round((totalSolved / questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Practice Problems</h1>
          <p className="text-sm text-muted mt-1">Solve LeetCode-style coding challenges to sharpen your skills</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="p-5 border-l-4 border-l-primary">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wider">Overall Progress</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalSolved}/{questions.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/20" />
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500"
              />
            </div>
            <p className="text-xs text-muted mt-1.5">{progressPct}% complete</p>
          </Card>
        </motion.div>

        {/* Easy */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="p-5 border-l-4 border-l-green-500">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Easy</p>
            <p className="text-2xl font-bold text-foreground mt-1">{easySolved}/{easyTotal}</p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className="h-full rounded-full bg-green-500" style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%`, transition: "width 0.8s ease" }} />
            </div>
          </Card>
        </motion.div>

        {/* Medium */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Card className="p-5 border-l-4 border-l-amber-500">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Medium</p>
            <p className="text-2xl font-bold text-foreground mt-1">{mediumSolved}/{mediumTotal}</p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0}%`, transition: "width 0.8s ease" }} />
            </div>
          </Card>
        </motion.div>

        {/* Hard */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <Card className="p-5 border-l-4 border-l-red-500">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Hard</p>
            <p className="text-2xl font-bold text-foreground mt-1">{hardSolved}/{hardTotal}</p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className="h-full rounded-full bg-red-500" style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%`, transition: "width 0.8s ease" }} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Search, Filters & Controls */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by title, description or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-slate-600"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="h-10 pl-10 pr-8 rounded-lg border border-border bg-background text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          </div>

          {/* Bookmark Filter */}
          <Button
            variant={showBookmarked ? "primary" : "secondary"}
            size="sm"
            className="gap-1.5 h-10 px-4"
            onClick={() => setShowBookmarked(!showBookmarked)}
          >
            {showBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            Bookmarked
          </Button>

          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`h-10 w-10 flex items-center justify-center transition-colors ${
                viewMode === "grid" ? "bg-primary/10 text-primary" : "text-slate-500 hover:text-foreground hover:bg-slate-800/50"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`h-10 w-10 flex items-center justify-center transition-colors border-l border-border ${
                viewMode === "list" ? "bg-primary/10 text-primary" : "text-slate-500 hover:text-foreground hover:bg-slate-800/50"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Topic Tag Chips */}
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => {
            const isActive = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                    : "bg-slate-800/40 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                <Hash className="w-2.5 h-2.5" />
                {tag}
                {isActive && <X className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        {(difficultyFilter || selectedTags.length > 0 || showBookmarked || search) && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Showing {filtered.length} of {questions.length} questions</span>
            <button
              onClick={() => { setSearch(""); setDifficultyFilter(""); setSelectedTags([]); setShowBookmarked(false); }}
              className="text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear all filters
            </button>
          </div>
        )}
      </Card>

      {/* Questions Grid / List */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <Code className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-muted font-medium">No questions match your filters</p>
            <p className="text-sm text-slate-600 mt-1">Try adjusting your search or filters</p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                solved={solvedSet.has(q.id)}
                bookmarked={bookmarkedSet.has(q.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filtered.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-slate-800/40 hover:border-border/80 transition-all"
              >
                {/* ID */}
                <span className="text-xs font-mono text-slate-500 bg-slate-800/60 px-2 py-1 rounded shrink-0">
                  #{q.id}
                </span>

                {/* Title + Tags */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {q.title}
                    </h3>
                    <Badge variant={q.difficulty === "Easy" ? "success" : q.difficulty === "Medium" ? "warning" : "danger"} className="shrink-0">
                      {q.difficulty}
                    </Badge>
                    {solvedSet.has(q.id) && (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {q.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-500 border border-slate-700/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    className={`p-1.5 rounded-lg transition-all ${
                      bookmarkedSet.has(q.id)
                        ? "text-amber-400 bg-amber-500/10"
                        : "text-slate-600 hover:text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {bookmarkedSet.has(q.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <Button
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => window.open(q.leetcodeUrl, "_blank")}
                  >
                    Solve
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
