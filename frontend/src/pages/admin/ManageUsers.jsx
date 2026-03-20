import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Search, ShieldBan, ShieldCheck, UserCog } from "lucide-react";
import { adminAPI } from "../../services/api";

export function ManageUsers() {
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = {};
    if (activeTab === 'candidates') params.role = 'candidate';
    else if (activeTab === 'recruiters') params.role = 'recruiter';
    if (search) params.search = search;

    setLoading(true);
    adminAPI.getUsers(params)
      .then((res) => setUsers(res.data.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [activeTab, search]);

  return (
    <div className="space-y-6 h-full flex flex-col pb-2">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
          <p className="text-slate-400 mt-1">View candidates and recruiters.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col p-6 min-h-0 bg-card shadow-sm border-border/80">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex bg-slate-900 rounded-lg p-1 border border-border">
            {['all', 'candidates', 'recruiters'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground shadow-sm' : 'text-slate-400 hover:text-foreground'}`}
              >{tab}</button>
            ))}
          </div>
          <div className="flex gap-3 relative flex-1 max-w-sm ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Search users..." className="pl-9 bg-background/50 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar border border-border rounded-xl bg-background/50 shadow-inner">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 sticky top-0 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-border">User</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Role</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-slate-300 bg-card/40">
              {loading && <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>}
              {!loading && users.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No users found</td></tr>}
              {users.map(u => (
                <tr key={u._id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{u.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 px-2.5 py-1 rounded-md text-xs font-semibold border border-slate-700 capitalize">{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
