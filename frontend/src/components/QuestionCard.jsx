import { motion } from "framer-motion";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import {
  ExternalLink, Bookmark, BookmarkCheck, Hash, FileQuestion
} from "lucide-react";

const difficultyConfig = {
  Easy: { variant: "success", glow: "shadow-green-500/10 hover:shadow-green-500/20" },
  Medium: { variant: "warning", glow: "shadow-amber-500/10 hover:shadow-amber-500/20" },
  Hard: { variant: "danger", glow: "shadow-red-500/10 hover:shadow-red-500/20" },
};

export function QuestionCard({ question, index, solved, bookmarked, onToggleBookmark, onSolve }) {
  const diff = difficultyConfig[question.difficulty] || difficultyConfig.Easy;
  const isMCQ = question.type === "MCQ";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative rounded-xl border border-border bg-card p-5 shadow-lg ${diff.glow} transition-all duration-300 hover:border-border/80 cursor-default`}
    >
      {/* Solved indicator stripe */}
      {solved && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-t-xl" />
      )}

      {/* Top Row: Type + Difficulty + Bookmark */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isMCQ ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"}`}>
            {question.type || "CODING"}
          </span>
          <Badge variant={diff.variant}>{question.difficulty}</Badge>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(question.id); }}
          className={`p-1.5 rounded-lg transition-all ${
            bookmarked
              ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
              : "text-slate-600 hover:text-slate-600 hover:bg-[#f5f0eb]"
          }`}
          title={bookmarked ? "Remove bookmark" : "Bookmark question"}
        >
          {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
        {question.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
        {question.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(question.tags || []).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#f5f0eb]/60 text-slate-600 border border-[#e2ddd8]"
          >
            <Hash className="w-2.5 h-2.5" />
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom Row: Status + Solve Button */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        {solved ? (
          <span className="text-xs font-medium text-green-400 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Solved
          </span>
        ) : (
          <span className="text-xs text-slate-600">Not attempted</span>
        )}
        {isMCQ && onSolve ? (
          <Button
            size="sm"
            className="gap-1.5 text-xs shadow-md shadow-primary/15 hover:shadow-primary/30 transition-shadow"
            onClick={onSolve}
          >
            Solve MCQ <FileQuestion className="w-3 h-3" />
          </Button>
        ) : (
          <Button
            size="sm"
            className="gap-1.5 text-xs shadow-md shadow-primary/15 hover:shadow-primary/30 transition-shadow"
            onClick={() => question.leetcodeUrl && window.open(question.leetcodeUrl, "_blank")}
          >
            Solve Question <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
