import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Building2, Plus, Pencil, Trash2, X, Globe, Briefcase, AlertCircle, Check
} from "lucide-react";
import { adminAPI } from "../../services/api";

export function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", industry: "", website: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCompanies = () => {
    setLoading(true);
    adminAPI.getCompanies()
      .then((res) => setCompanies(res.data.data))
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCompanies(); }, []);

  const resetForm = () => {
    setFormData({ name: "", description: "", industry: "", website: "" });
    setEditingId(null);
    setShowForm(false);
    setFormError("");
  };

  const openEdit = (company) => {
    setFormData({
      name: company.name,
      description: company.description || "",
      industry: company.industry || "",
      website: company.website || "",
    });
    setEditingId(company._id);
    setShowForm(true);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Company name is required");
      return;
    }

    setFormLoading(true);
    try {
      if (editingId) {
        await adminAPI.updateCompany(editingId, formData);
      } else {
        await adminAPI.createCompany(formData);
      }
      resetForm();
      fetchCompanies();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save company");
    }
    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteCompany(id);
      setDeleteConfirm(null);
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Companies</h1>
          <p className="text-sm text-muted mt-1">{companies.length} companies registered</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2 shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 border-primary/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                {editingId ? "Edit Company" : "Add New Company"}
              </h2>
              <button onClick={resetForm} className="text-slate-500 hover:text-[#1e293b] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-500/20 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Company Name *</label>
                  <Input
                    placeholder="e.g. Google"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Industry</label>
                  <Input
                    placeholder="e.g. Technology"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Description</label>
                <textarea
                  placeholder="Brief description of the company..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Website</label>
                <Input
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={formLoading} className="gap-2">
                  {formLoading ? "Saving..." : editingId ? "Update Company" : "Create Company"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Companies List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-[#f5f0eb]/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Industry</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Website</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Added</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted">Loading companies...</td></tr>
              )}
              {!loading && companies.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted">No companies yet. Add your first company above.</td></tr>
              )}
              {companies.map((company, i) => (
                <motion.tr
                  key={company._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-[#f5f0eb]/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {company.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{company.name}</p>
                        {company.description && (
                          <p className="text-xs text-muted truncate max-w-[200px]">{company.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {company.industry ? (
                      <Badge variant="default">{company.industry}</Badge>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                        <Globe className="w-3.5 h-3.5" /> Visit
                      </a>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      {deleteConfirm === company._id ? (
                        <>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(company._id)} className="h-8 px-3 text-xs gap-1">
                            <Check className="w-3 h-3" /> Confirm
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(null)} className="h-8 px-3 text-xs">
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(company)} title="Edit" className="h-8 w-8 p-0">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(company._id)} title="Delete" className="h-8 w-8 p-0 text-red-600 hover:text-red-300 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
