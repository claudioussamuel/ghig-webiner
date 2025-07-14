"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, User, Mail, Phone, CreditCard, Shield, Sparkles } from "lucide-react"
import { auth } from "../config/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from "firebase/auth"
import { db } from "../config/firebase"
import { collection, addDoc } from "firebase/firestore"

// AuthModal component for login/signup
function AuthModal({ open, onClose, onAuthSuccess }: { open: boolean; onClose: () => void; onAuthSuccess: (user: FirebaseUser) => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      let userCredential
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
      }
      onAuthSuccess(userCredential.user)
      onClose()
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative">
        {/* Remove close button to force authentication */}
        {/* <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">✕</button> */}
        <h2 className="text-xl font-bold mb-4 text-center">{isLogin ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Label htmlFor="auth-email">Email</Label>
            <Input id="auth-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <Label htmlFor="auth-password">Password</Label>
            <Input id="auth-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}</Button>
        </form>
       
      </div>
    </div>
  )
}

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    surname: "",
    otherNames: "",
    email: "",
    phone: "",
    price: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user)
        setAuthModalOpen(false)
      } else {
        setAuthUser(null)
        setAuthModalOpen(true)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validation
    if (!formData.surname.trim()) {
      setError("Please enter your surname")
      return
    }

    if (!formData.otherNames.trim()) {
      setError("Please enter your other names")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number")
      return
    }

    if (!formData.price) {
      setError("Please select a price option")
      return
    }

    if (!formData.role) {
      setError("Please select your role")
      return
    }

    setIsLoading(true)
    setSuccess(false)
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), 
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to send email")
      }
      // Add to Firestore 'webinar-1' collection
      await addDoc(collection(db, "webinar-1"), formData)
      setSuccess(true)
      setFormData({
        surname: "",
        otherNames: "",
        email: "",
        phone: "",
        price: "",
        role: "",
      })
    } catch (err: any) {
      setError(err.message || "Failed to send email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onClose={() => {}} onAuthSuccess={setAuthUser} />
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Show user email if logged in */}
          {authUser && (
            <div className="mb-4 text-center text-green-200 text-sm flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>Signed in as {authUser.email}</span>
              <button className="ml-2 text-xs text-red-300 underline" onClick={async () => { await signOut(auth); setAuthUser(null); }}>Sign out</button>
            </div>
          )}
          {/* Remove Auth button if not logged in */}
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-2xl overflow-hidden">
              <img
                src="/images.jpg"
                alt="Admin Registration Icon"
                className="w-16 h-16 object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Admin Registration
            </h1>
            <p className="text-purple-200 text-lg">Complete your admin registration form</p>
          </div>

          {/* Main Card */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <CardTitle className="text-2xl font-bold text-white">Admin Access Registration</CardTitle>
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <CardDescription className="text-purple-200">
                Fill in your details to complete admin registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Disable form if not authenticated */}
              <form onSubmit={handleSubmit} className="space-y-6" style={{ opacity: authUser ? 1 : 0.5, pointerEvents: authUser ? 'auto' : 'none' }}>
                {/* Surname Field */}
                <div className="space-y-3">
                  <Label htmlFor="surname" className="text-sm font-medium text-purple-200 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Surname</span>
                  </Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Enter your surname"
                    value={formData.surname}
                    onChange={(e) => handleInputChange("surname", e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Other Names Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="otherNames"
                    className="text-sm font-medium text-purple-200 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Other Names</span>
                  </Label>
                  <Input
                    id="otherNames"
                    type="text"
                    placeholder="Enter your other names"
                    value={formData.otherNames}
                    onChange={(e) => handleInputChange("otherNames", e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-purple-200 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-medium text-purple-200 flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>

                {/* Role Dropdown */}
                <div className="space-y-3">
                  <Label htmlFor="role" className="text-sm font-medium text-purple-200 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Role</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm">
                      <SelectValue placeholder="Select your role" className="text-emerald-300" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900/95 border-purple-700 backdrop-blur-xl">
                      <SelectItem value="Listening" className="text-white hover:bg-purple-800/50 focus:bg-purple-800/50">
                        Listening
                      </SelectItem>
                      <SelectItem value="Presenting" className="text-white hover:bg-purple-800/50 focus:bg-purple-800/50">
                        Presenting
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Dropdown */}
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-sm font-medium text-purple-200 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Price Option</span>
                  </Label>
                  <Select
                    value={formData.price}
                    onValueChange={(value) => handleInputChange("price", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm">
                      <SelectValue placeholder="Select a price option" className="text-emerald-300" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900/95 border-purple-700 backdrop-blur-xl">
                      <SelectItem value="50gh" className="text-white hover:bg-purple-800/50 focus:bg-purple-800/50">
                        Member(Ghanaian) - 50gh
                      </SelectItem>
                      <SelectItem value="70gh" className="text-white hover:bg-purple-800/50 focus:bg-purple-800/50">
                        Non-Member(Ghanaian) - 70gh
                      </SelectItem>
                      <SelectItem value="200gh" className="text-white hover:bg-purple-800/50 focus:bg-purple-800/50">
                        Foreign Participant - 200gh
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert className="bg-red-500/20 border-red-400/30 backdrop-blur-sm">
                    <AlertCircle className="h-4 w-4 text-red-300" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Success Alert */}
                {success && (
                  <Alert className="bg-green-500/20 border-green-400/30 backdrop-blur-sm">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <AlertDescription className="text-green-200">
                      Admin registration submitted successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Complete Admin Registration</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-xs text-purple-300 flex items-center justify-center space-x-2">
                  <Shield className="w-3 h-3" />
                  <span>Admin access with enhanced security</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom text */}
          <div className="text-center mt-6">
            <p className="text-purple-300 text-sm">Your admin information is protected and secure</p>
          </div>
        </div>
      </div>
    </div>
  )
}
