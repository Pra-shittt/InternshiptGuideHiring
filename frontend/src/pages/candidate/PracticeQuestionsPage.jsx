import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { QuestionCard } from "../../components/QuestionCard";
import {
  Search, Filter, ChevronDown, LayoutGrid, List, X,
  Target, CheckCircle, Bookmark, BookmarkCheck, TrendingUp,
  Code, Hash, ExternalLink, Loader2
} from "lucide-react";
import { questionAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export function PracticeQuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [solvedSet, setSolvedSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("hf_solved") || "[]")); } catch { return new Set(); }
  });
  const [bookmarkedSet, setBookmarkedSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("hf_bookmarked") || "[]")); } catch { return new Set(); }
  });
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Fetch questions from the backend API (source of truth)
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (search) params.search = search;
    if (difficultyFilter) params.difficulty = difficultyFilter;
    if (typeFilter) params.type = typeFilter;

    questionAPI.getAll(params)
      .then((res) => {
        const data = res.data.data || [];
        // Normalize questions to a consistent shape for display
        setQuestions(data.map((q) => ({
          ...q,
          id: q._id,
          tags: [q.topic, q.company].filter(Boolean),
          description: q.questionText || q.description || `${q.type} problem — ${q.topic}`,
          leetcodeUrl: q.link || (q.platform === "LeetCode" ? `https://leetcode.com/problems/${q.title.toLowerCase().replace(/\s+/g, "-")}/` : null),
        })));
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load questions");
      })
      .finally(() => setLoading(false));
  }, [search, difficultyFilter, typeFilter]);

  // Collect unique tags from fetched data
  const ALL_TAGS = useMemo(() => {
    return [...new Set(questions.flatMap((q) => q.tags))].sort();
  }, [questions]);

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

  // Client-side filtering for tags + bookmarks (API handles search/difficulty/type)
  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchTags = selectedTags.length === 0 || selectedTags.every((t) => q.tags.includes(t));
      const matchBookmark = !showBookmarked || bookmarkedSet.has(q.id);
      return matchTags && matchBookmark;
    });
  }, [questions, selectedTags, showBookmarked, bookmarkedSet]);

  // Stats
  const totalSolved = questions.filter((q) => solvedSet.has(q.id)).length;
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
          <p className="text-sm text-muted mt-1">Solve coding & MCQ challenges from the question bank</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        {[
          { label: "Easy", solved: easySolved, total: easyTotal, color: "green" },
          { label: "Medium", solved: mediumSolved, total: mediumTotal, color: "amber" },
          { label: "Hard", solved: hardSolved, total: hardTotal, color: "red" },
        ].map((d, i) => (
          <motion.div key={d.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * (i + 1) }}>
            <Card className={`p-5 border-l-4 border-l-${d.color}-500`}>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">{d.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{d.solved}/{d.total}</p>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                <div className={`h-full rounded-full bg-${d.color}-500`} style={{ width: `${d.total > 0 ? (d.solved / d.total) * 100 : 0}%`, transition: "width 0.8s ease" }} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search, Filters & Controls */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by title, topic, or company..."
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

          {/* Type Filter */}
          <div className="relative">
            <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 pl-10 pr-8 rounded-lg border border-border bg-background text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Types</option>
              <option value="MCQ">MCQ</option>
              <option value="CODING">Coding</option>
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
        {ALL_TAGS.length > 0 && (
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
        )}

        {/* Active Filters Summary */}
        {(difficultyFilter || typeFilter || selectedTags.length > 0 || showBookmarked || search) && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Showing {filtered.length} of {questions.length} questions</span>
            <button
              onClick={() => { setSearch(""); setDifficultyFilter(""); setTypeFilter(""); setSelectedTags([]); setShowBookmarked(false); }}
              className="text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear all filters
            </button>
          </div>
        )}
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted text-sm">Loading questions...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-16">
          <p className="text-red-400 font-medium">{error}</p>
          <Button onClick={() => window.location.reload()} variant="secondary" className="mt-4">Retry</Button>
        </div>
      )}

      {/* Questions Grid / List */}
      {!loading && !error && (
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
                  onSolve={q.type === "MCQ" ? () => navigate(`/candidate/mcq/${q.id}`) : undefined}
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
                  {/* Type badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${q.type === "MCQ" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}`}>
                    {q.type}
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
                    {q.type === "MCQ" ? (
                      <Button
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => navigate(`/candidate/mcq/${q.id}`)}
                      >
                        Solve MCQ
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => q.leetcodeUrl ? window.open(q.leetcodeUrl, "_blank") : null}
                      >
                        Solve <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
