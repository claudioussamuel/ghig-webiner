"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Sparkles, ArrowRight, Mail } from "lucide-react"

export default function ThankYouPage() {
  const handleGoToSite = () => {
    window.location.href = "https://ghig.org"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6 shadow-2xl animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Thank You!
            </h1>
            <p className="text-purple-200 text-lg">Your submission was successful</p>
          </div>

          {/* Main Card */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <CardTitle className="text-2xl font-bold text-white">Registration Complete</CardTitle>
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <CardDescription className="text-purple-200 text-center leading-relaxed">
                We have successfully received your registration. You will receive a confirmation email shortly with
                further details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-2 text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Registration Successful</span>
                  </div>
                  <p className="text-green-200 text-sm mt-2">Your information has been securely processed and saved.</p>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white text-center">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 text-purple-200">
                    <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <p className="text-sm">You will receive a confirmation email within the next few minutes</p>
                  </div>
                  <div className="flex items-start space-x-3 text-purple-200">
                    <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <p className="text-sm">Our team will review your registration and contact you if needed</p>
                  </div>
                  <div className="flex items-start space-x-3 text-purple-200">
                    <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                    <p className="text-sm">You will receive further instructions about the next steps</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoToSite}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-5 h-5" />
                    <span>Visit GHIG Website</span>
                  </div>
                </Button>
              </div>

              {/* Contact Info */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-xs text-purple-300 mb-2">Need help or have questions?</p>
                <div className="flex items-center justify-center space-x-2 text-purple-300">
                  <Mail className="w-3 h-3" />
                  <span className="text-xs">Contact us at support@ghig.org</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom text */}
          <div className="text-center mt-6">
            <p className="text-purple-300 text-sm">Thank you for choosing GHIG</p>
          </div>
        </div>
      </div>
    </div>
  )
}
