import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/system";
import { loginSchema, registerSchema, sanitizeText } from "@/utils/validation";
import { z } from "zod";

interface AuthProps {
  mode?: "signin" | "signup";
}

const Auth: React.FC<AuthProps> = ({ mode = "signin" }) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">(mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: UserRole.CUSTOMER
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: sanitizeText(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "signin") {
        // Validate login data
        const validatedData = loginSchema.parse({
          email: formData.email,
          password: formData.password
        });

        await login(validatedData.email, validatedData.password);
        navigate(from, { replace: true });
      } else {
        // Validate registration data
        const validatedData = registerSchema.parse({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone
        });

        await register({
          email: validatedData.email,
          password: validatedData.password,
          name: validatedData.name,
          arabicName: validatedData.name, // For now, same as name
          phone: validatedData.phone,
          role: formData.role
        });
        
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {authMode === "signin" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </CardTitle>
          <CardDescription className="text-center">
            {authMode === "signin" 
              ? "أدخل بياناتك للوصول إلى حسابك" 
              : "املأ البيانات التالية لإنشاء حساب جديد"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "signup" && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {authMode === "signup" && (
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="أدخل رقم هاتفك"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading 
                ? "جارٍ التحميل..." 
                : authMode === "signin" 
                  ? "تسجيل الدخول" 
                  : "إنشاء الحساب"
              }
            </Button>
          </form>

          <div className="text-center text-sm">
            {authMode === "signin" ? (
              <p>
                ليس لديك حساب؟{" "}
                <button
                  onClick={() => setAuthMode("signup")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  إنشاء حساب جديد
                </button>
              </p>
            ) : (
              <p>
                لديك حساب بالفعل؟{" "}
                <button
                  onClick={() => setAuthMode("signin")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  تسجيل الدخول
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;