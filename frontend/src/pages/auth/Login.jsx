import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import logoImg from "../../assets/logo.png";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function Login() {
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const user = await login(email, password);
      navigate(`/${user.role}/dashboard`);
    } catch {
      // error is already set in store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <Card className="w-full max-w-md p-8 space-y-8 relative z-10 border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl shadow-lg mb-6 overflow-hidden">
            <img src={logoImg} alt="Learn2Hire" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Learn2Hire</h1>
          <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
        </div>

        {(error || emailError || passwordError) && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {emailError || passwordError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); setEmailError(""); }}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); setPasswordError(""); }}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full text-base py-6 gap-2 shadow-lg shadow-primary/25" disabled={loading}>
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign up</Link>
        </p>
        <div className="text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">← Back to Home</Link>
        </div>
      </Card>
    </div>
  );
}
