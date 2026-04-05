import { useState, useEffect } from "react";
import { Briefcase, ExternalLink, ChevronRight, FileQuestion } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { questionAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export function CompanyPrep() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    questionAPI.getCompanies()
      .then((res) => {
        setCompanies(res.data.data);
        if (res.data.data.length > 0) setActiveCompany(res.data.data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeCompany) return;
    const params = { company: activeCompany.name };
    if (difficulty) params.difficulty = difficulty;
    if (typeFilter) params.type = typeFilter;
    questionAPI.getAll(params)
      .then((res) => setQuestions(res.data.data));
  }, [activeCompany, difficulty, typeFilter]);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mcqCount = questions.filter((q) => q.type === "MCQ").length;
  const codingCount = questions.filter((q) => q.type === "CODING").length;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Company-wise Preparation</h1>
          <p className="text-sm text-slate-400 mt-1">Practice previously asked questions from top companies.</p>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Search companies..." className="w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 pb-2">
        <Card className="w-80 flex flex-col p-4 bg-card shrink-0 shadow-sm border-border/80">
          <h3 className="font-semibold text-slate-300 mb-4 px-2 uppercase text-xs tracking-wider">Top Companies</h3>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {loading && <p className="text-slate-500 text-sm px-2">Loading...</p>}
            {filteredCompanies.map((company) => (
              <button
                key={company.name}
                onClick={() => setActiveCompany(company)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${activeCompany?.name === company.name ? 'bg-primary/10 border border-primary/20 text-primary shadow-sm' : 'hover:bg-slate-800/50 border border-transparent text-slate-300 hover:border-slate-700/50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeCompany?.name === company.name ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400'}`}>
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{company.name}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${activeCompany?.name === company.name ? 'bg-primary/20 text-primary' : 'bg-background text-slate-500'}`}>{company.count}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex-1 flex flex-col p-6 bg-card shrink-0 shadow-sm border-border/80">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
              <span className="bg-white/10 p-2 rounded-lg"><Briefcase className="w-5 h-5 text-white" /></span>
              {activeCompany?.name || "Select Company"} Questions
            </h2>
            <div className="flex gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-background border border-border text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-300 cursor-pointer shadow-sm"
              >
                <option value="">All Types</option>
                <option value="MCQ">MCQ</option>
                <option value="CODING">Coding</option>
              </select>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="bg-background border border-border text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-300 cursor-pointer shadow-sm"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Stats bar */}
          {questions.length > 0 && (
            <div className="flex gap-3 mb-4">
              <Badge variant="default" className="gap-1">
                Total: {questions.length}
              </Badge>
              <Badge variant="primary" className="gap-1">
                <FileQuestion className="w-3 h-3" /> MCQ: {mcqCount}
              </Badge>
              <Badge variant="default" className="gap-1">
                💻 Coding: {codingCount}
              </Badge>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {questions.length === 0 && (
              <p className="text-slate-500 text-sm">No questions found.</p>
            )}
            {questions.map((q) => (
              <div key={q._id} className="p-5 rounded-xl border border-border bg-background hover:border-slate-600 transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${q.type === "MCQ" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"}`}>
                      {q.type}
                    </span>
                    <h4 className="font-semibold text-foreground text-[17px] group-hover:text-primary transition-colors">{q.title}</h4>
                  </div>
                  <div className="flex gap-3 mt-3 text-sm items-center">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${q.difficulty === 'Easy' ? 'text-green-400 bg-green-400/10 border border-green-500/20' : q.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-500/20' : 'text-red-400 bg-red-400/10 border border-red-500/20'}`}>
                      {q.difficulty}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded text-xs border border-slate-700 font-medium">{q.topic}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {q.type === "MCQ" ? (
                    <Button
                      variant="secondary"
                      className="gap-1.5 opacity-80 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                      onClick={(e) => { e.stopPropagation(); navigate(`/candidate/mcq/${q._id}`); }}
                    >
                      Solve MCQ <FileQuestion className="w-3.5 h-3.5" />
                    </Button>
                  ) : q.link ? (
                    <Button
                      variant="secondary"
                      className="gap-1.5 opacity-80 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                      onClick={(e) => { e.stopPropagation(); window.open(q.link, '_blank'); }}
                    >
                      Solve on {q.platform || "LeetCode"} <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  ) : (
                    <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm">Solve <ChevronRight className="w-4 h-4 ml-1" /></Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
