import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Search, Plus, Edit2, Trash2, BookOpen, ExternalLink } from "lucide-react";
import { questionAPI } from "../../services/api";

const emptyQuestion = {
  title: "", company: "", topic: "", difficulty: "Easy", type: "MCQ",
  questionText: "", options: ["", "", "", ""], correctAnswer: "",
  explanation: "", platform: "LeetCode", link: "",
};

export function ManageContent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form, setForm] = useState(emptyQuestion);
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");

  const fetchQuestions = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (typeFilter) params.type = typeFilter;
    questionAPI.getAll(params)
      .then((res) => setQuestions(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuestions(); }, [search, typeFilter]);

  const openCreate = () => {
    setEditingQuestion(null);
    setForm(emptyQuestion);
    setShowModal(true);
  };

  const openEdit = (q) => {
    setEditingQuestion(q);
    setForm({
      ...q,
      options: q.options?.length ? q.options : ["", "", "", ""],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form };
      if (data.type === "MCQ") {
        data.options = data.options.filter(Boolean);
        data.platform = null;
        data.link = null;
      } else {
        data.questionText = null;
        data.options = [];
        data.correctAnswer = null;
        data.explanation = null;
      }

      if (editingQuestion) {
        await questionAPI.update(editingQuestion._id, data);
      } else {
        await questionAPI.create(data);
      }
      setShowModal(false);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      await questionAPI.delete(id);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col pb-2">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
          <p className="text-slate-400 mt-1">Add, edit, and categorize interview questions.</p>
        </div>
        <Button onClick={openCreate} className="shadow-sm shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> New Question</Button>
      </div>

      <Card className="flex-1 flex flex-col p-6 min-h-0 bg-card shadow-sm border-border/80">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex bg-slate-900 rounded-lg p-1 border border-border">
            {[
              { id: '', label: 'All' },
              { id: 'MCQ', label: 'MCQ' },
              { id: 'CODING', label: 'Coding' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setTypeFilter(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${typeFilter === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-slate-400 hover:text-foreground'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3 relative flex-1 max-w-md ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Search questions..." className="pl-9 bg-background/50 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar border border-border rounded-xl bg-background/50 shadow-inner">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 sticky top-0 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-border">Title</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Type</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Difficulty</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Topic</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Company</th>
                <th className="px-6 py-4 font-semibold text-right border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-slate-300 bg-card/40">
              {loading && <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>}
              {!loading && questions.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No questions found</td></tr>}
              {questions.map(q => (
                <tr key={q._id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground">{q.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${q.type === 'MCQ' ? 'text-blue-400 bg-blue-400/10' : 'text-purple-400 bg-purple-400/10'}`}>{q.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${q.difficulty === 'Easy' ? 'text-green-400 bg-green-400/10' : q.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'}`}>{q.difficulty}</span>
                  </td>
                  <td className="px-6 py-4"><span className="bg-slate-800 px-2 py-0.5 rounded text-xs border border-slate-700">{q.topic}</span></td>
                  <td className="px-6 py-4 text-xs text-slate-400">{q.company}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button onClick={() => openEdit(q)} variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10"><Edit2 className="w-4 h-4" /></Button>
                      <Button onClick={() => handleDelete(q._id)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <Card className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-foreground">{editingQuestion ? 'Edit Question' : 'Create Question'}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Title</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Two Sum" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Company</label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Amazon" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Topic</label>
                <Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="Arrays" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <option>MCQ</option><option>CODING</option>
                </select>
              </div>
            </div>

            {form.type === 'MCQ' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Question Text</label>
                  <textarea value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground min-h-[80px] resize-none" placeholder="Enter the question..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Options</label>
                  {form.options.map((opt, i) => (
                    <Input key={i} value={opt} onChange={(e) => { const opts = [...form.options]; opts[i] = e.target.value; setForm({ ...form, options: opts }); }} placeholder={`Option ${i + 1}`} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Correct Answer</label>
                    <Input value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} placeholder="Must match one of the options exactly" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Explanation</label>
                    <Input value={form.explanation || ""} onChange={(e) => setForm({ ...form, explanation: e.target.value })} placeholder="Optional explanation" />
                  </div>
                </div>
              </>
            )}

            {form.type === 'CODING' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Platform</label>
                  <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                    <option>LeetCode</option><option>GFG</option><option>CodeChef</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Link</label>
                  <Input value={form.link || ""} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://leetcode.com/problems/..." />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editingQuestion ? 'Update' : 'Create'}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
