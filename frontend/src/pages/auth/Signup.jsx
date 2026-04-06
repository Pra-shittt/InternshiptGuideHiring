import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { UserPlus, AlertCircle, Eye, EyeOff } from "lucide-react";
import logoImg from "../../assets/logo.png";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function Signup() {
  const { signup, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const user = await signup(name, email, password, role);
      navigate(`/${user.role}/dashboard`);
    } catch {
      // error is already set in store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <Card className="w-full max-w-md p-8 space-y-8 relative z-10 border-[#e2ddd8] bg-white shadow-lg">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl shadow-lg mb-6 overflow-hidden">
            <img src={logoImg} alt="Learn2Hire" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Create Account</h1>
          <p className="text-slate-500 text-sm">Join Learn2Hire to start your journey</p>
        </div>

        {(error || emailError || passwordError) && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-500/20 text-red-600 px-4 py-3 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {emailError || passwordError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Full Name</label>
            <Input
              id="signup-name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError(); }}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Email</label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); setEmailError(""); }}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Password</label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); setPasswordError(""); }}
                required
                minLength={6}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#1e293b] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Role</label>
            <select
              id="signup-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <Button type="submit" className="w-full text-base py-6 gap-2 shadow-lg shadow-[#1e3a5f]/15" disabled={loading}>
            <UserPlus className="w-4 h-4" />
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
        </p>
        <div className="text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-[#1e293b] transition-colors">← Back to Home</Link>
        </div>
      </Card>
    </div>
  );
}
