"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Lock, Mail, Sparkles } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Set the correct PIN here (you can change this to any 4-digit number)
  const CORRECT_PIN = "1234"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!email.trim()) {
      setError("Please enter an email address")
      return
    }

    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN")
      return
    }

    if (pin !== CORRECT_PIN) {
      setError("Incorrect PIN. Please try again.")
      return
    }

    setIsLoading(true)
    setSuccess(true)

    // Redirect after a brief success message
    setTimeout(() => {
      window.location.href = "https://ghig.org"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
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
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-2xl overflow-hidden">
              <img src="/images.jpg" alt="Login Icon" className="w-16 h-16 object-cover" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Secure Access
            </h1>
            <p className="text-purple-200 text-lg">Enter your credentials to continue</p>
          </div>

          {/* Main Card */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <CardTitle className="text-2xl font-bold text-white">Portal Access</CardTitle>
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <CardDescription className="text-purple-200">Authenticate to access your secure portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-purple-200 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* PIN Field */}
                <div className="space-y-4">
                  <Label htmlFor="pin" className="text-sm font-medium text-purple-200 flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>4-Digit PIN</span>
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={4} value={pin} onChange={setPin} pattern="^[0-9]+$" disabled={isLoading}>
                      <InputOTPGroup className="gap-3">
                        <InputOTPSlot
                          index={0}
                          className="w-14 h-14 text-xl font-bold bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                        />
                        <InputOTPSlot
                          index={1}
                          className="w-14 h-14 text-xl font-bold bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                        />
                        <InputOTPSlot
                          index={2}
                          className="w-14 h-14 text-xl font-bold bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                        />
                        <InputOTPSlot
                          index={3}
                          className="w-14 h-14 text-xl font-bold bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
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
                    <AlertDescription className="text-green-200">Access granted! Redirecting...</AlertDescription>
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
                      <span>Redirecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="w-5 h-5" />
                      <span>Access Portal</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-xs text-purple-300 flex items-center justify-center space-x-2">
                  <Lock className="w-3 h-3" />
                  <span>Secured with end-to-end encryption</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom text */}
          <div className="text-center mt-6">
            <p className="text-purple-300 text-sm">Protected by advanced security protocols</p>
          </div>
        </div>
      </div>
    </div>
  )
}
