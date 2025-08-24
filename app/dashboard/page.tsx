"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, TrendingUp, UserCheck, UserX, Sparkles, BarChart3, Calendar, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { db } from "../config/firebase"
import { collection, getDocs } from "firebase/firestore"
import { auth } from "../config/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from "firebase/auth"
import { useUserRole } from "../hooks/useUserRole"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Shield } from "lucide-react"

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
        <h2 className="text-xl font-bold mb-4 text-center">{isLogin ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="auth-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="auth-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md font-semibold" disabled={loading}>{loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}</button>
        </form>
        <div className="mt-4 text-center">
         
        </div>
      </div>
    </div>
  )
}

// Unauthorized Access Component
function UnauthorizedAccess({ user, onSignOut }: { user: FirebaseUser | null; onSignOut: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 relative overflow-hidden flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mb-4 shadow-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Access Denied</CardTitle>
            <CardDescription className="text-red-200">
              This dashboard is restricted to administrators only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <div className="text-center text-red-200 text-sm">
                <p>Signed in as: {user.email}</p>
                <p className="text-xs mt-1">You don't have admin privileges</p>
              </div>
            )}
            <Alert className="bg-red-500/20 border-red-400/30 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-red-300" />
              <AlertDescription className="text-red-200">
                Only users with admin role can access this dashboard. Please contact your administrator if you believe this is an error.
              </AlertDescription>
            </Alert>
            <Button
              onClick={onSignOut}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [showMembersList, setShowMembersList] = useState(false)
  const [showRevenueList, setShowRevenueList] = useState(false)
  const [showFreeList, setShowFreeList] = useState(false)
  const [membersData, setMembersData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [stats, setStats] = useState({
    totalMembers: 0,
    paidMembers: 0,
    freeMembers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    memberGrowth: 0,
  })
  const [dataLoading, setDataLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null)
  const { userRole, userData, loading: roleLoading, error: roleError } = useUserRole(authUser)

  useEffect(() => {
    setDataLoading(true)
    const fetchMembers = async () => {
      const snapshot = await getDocs(collection(db, "webinar-1"))
      const members = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: `${data.surname} ${data.otherNames}`,
          email: data.email,
          phone: data.phone,
          pinCode: data.pinCode,
          status: data.payed ? "paid" : "free",
          amount: data.price,
          date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split("T")[0] : "",
          role: data.role,
        }
      })
      setMembersData(members)
      // Calculate stats
      const paidMembers = members.filter(m => m.status === "paid").length
      const freeMembers = members.filter(m => m.status === "free").length
      const totalRevenue = members
        .filter(m => m.status === "paid")
        .reduce((sum, m) => {
          // Extract numeric value from price string like "70gh"
          const match = typeof m.amount === "string" ? m.amount.match(/\d+/) : null
          return sum + (match ? parseInt(match[0], 10) : 0)
        }, 0)
      setStats({
        totalMembers: members.length,
        paidMembers,
        freeMembers,
        totalRevenue,
        monthlyRevenue: totalRevenue, // You can refine this if you have monthly data
        revenueGrowth: 0, // Placeholder, calculate if you have previous data
        memberGrowth: 0, // Placeholder, calculate if you have previous data
      })
      setDataLoading(false)
    }
    fetchMembers()

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

  // Handle sign out
  const handleSignOut = async () => {
    await signOut(auth)
    setAuthUser(null)
  }

  if (!authUser) {
    return <AuthModal open={authModalOpen} onClose={() => {}} onAuthSuccess={setAuthUser} />
  }

  // Show loading while checking role
  if (authUser && roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized if user is authenticated but not admin
  if (authUser && !roleLoading && userRole !== 'admin') {
  
    return <UnauthorizedAccess user={authUser} onSignOut={handleSignOut} />
  }

  // Show role error if there's an error fetching role
  if (authUser && roleError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Error</h2>
            <p className="text-red-200 mb-4">{roleError}</p>
            <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const paidMembers = membersData.filter((member) => member.status === "paid")
  const freeMembers = membersData.filter((member) => member.status === "free")

  const exportToCSV = () => {
    // Define CSV headers
    const headers = ["Name", "Email", "Phone", "Pin Code", "Role", "Status", "Amount (GHS)", "Registration Date"]
    // Convert data to CSV format
    const csvContent = [
      headers.join(","),
      ...membersData.map((member) =>
        [
          `"${member.name}"`,
          `"${member.email}"`,
          `"${member.phone}"`,
          `"${member.pinCode}"`,
          `"${member.role}"`,
          `"${member.status}"`,
          typeof member.amount === "string" && member.amount.match(/\d+/) ? member.amount.match(/\d+/)[0] : member.amount,
          `"${new Date(member.date).toLocaleDateString()}"`,
        ].join(","),
      ),
    ].join("\n")
    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `members_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const paidPercentage = stats.totalMembers ? (stats.paidMembers / stats.totalMembers) * 100 : 0
  const freePercentage = stats.totalMembers ? (stats.freeMembers / stats.totalMembers) * 100 : 0

  const handleTotalMembersClick = () => {
    if (window.innerWidth < 1024) {
      setShowMembersList(true)
    }
  }

  const handleTotalRevenueClick = () => {
    if (window.innerWidth < 1024) {
      setShowRevenueList(true)
    }
  }

  const handleFreeMembersClick = () => {
    if (window.innerWidth < 1024) {
      setShowFreeList(true)
    }
  }

  const closeAllModals = () => {
    setShowMembersList(false)
    setShowRevenueList(false)
    setShowFreeList(false)
  }

  // Pagination logic
  const totalPages = Math.ceil(membersData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMembers = membersData.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  return (
    <>
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

        <div className="relative z-10 min-h-screen p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-2xl overflow-hidden">
                <img src="/placeholder.svg?height=32&width=32" alt="Dashboard Icon" className="w-8 h-8 object-cover" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-purple-200 text-lg">Overview of members and revenue</p>
            </div>

            {/* Mobile Members List Modal */}
            {showMembersList && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden">
                <div className="absolute top-16 left-2 right-2 bottom-2 sm:top-20 sm:left-4 sm:right-4 sm:bottom-4 bg-gradient-to-br from-violet-900/95 via-purple-900/95 to-indigo-900/95 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">All Members</h2>
                    <Button variant="ghost" size="sm" onClick={closeAllModals} className="text-white hover:bg-white/10">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                    <div className="space-y-3">
                      {membersData.map((member) => (
                        <div
                          key={member.id}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{member.name}</h3>
                            <Badge
                              className={
                                member.status === "paid"
                                  ? "bg-green-500/20 text-green-300 border-green-400/30"
                                  : "bg-orange-500/20 text-orange-300 border-orange-400/30"
                              }
                            >
                              {member.status === "paid" ? "Paid" : "Free"}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-purple-200">
                            <p>{member.email}</p>
                            <p>{member.phone}</p>
                            <p className="font-mono text-purple-300">Pin: {member.pinCode || 'N/A'}</p>
                            <div className="flex justify-between items-center pt-2">
                              <span>{new Date(member.date).toLocaleDateString()}</span>
                              <span className="font-medium text-white">
                                {member.status === "paid" ? `GH₵${typeof member.amount === 'string' && member.amount.match(/\d+/) ? member.amount.match(/\d+/)[0] : member.amount}` : "Free"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex-shrink-0">
                      <Button
                        onClick={exportToCSV}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                      >
                        Export to CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Revenue List Modal */}
            {showRevenueList && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden">
                <div className="absolute top-16 left-2 right-2 bottom-2 sm:top-20 sm:left-4 sm:right-4 sm:bottom-4 bg-gradient-to-br from-violet-900/95 via-purple-900/95 to-indigo-900/95 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Payment Details</h2>
                    <Button variant="ghost" size="sm" onClick={closeAllModals} className="text-white hover:bg-white/10">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                    <div className="mb-4 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                      <div className="text-center">
                        <p className="text-green-300 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-green-300 text-xs mt-1">From {paidMembers.length} paid members</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {paidMembers.map((member) => (
                        <div
                          key={member.id}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{member.name}</h3>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-300">
                                GH₵{typeof member.amount === 'string' && member.amount.match(/\d+/) ? member.amount.match(/\d+/)[0] : member.amount}
                              </p>
                              <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">Paid</Badge>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-purple-200">
                            <p>{member.email}</p>
                            <p>{member.phone}</p>
                            <p className="font-mono text-purple-300">Pin: {member.pinCode || 'N/A'}</p>
                            <div className="flex justify-between items-center pt-2">
                              <span>Payment Date: {new Date(member.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex-shrink-0">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <p className="text-xs text-purple-300">Average Payment</p>
                          <p className="text-lg font-bold text-white">
                            GH₵{paidMembers.length > 0 ? Math.round(paidMembers.reduce((sum, m) => sum + (typeof m.amount === 'string' && m.amount.match(/\d+/) ? parseInt(m.amount.match(/\d+/)[0], 10) : m.amount), 0) / paidMembers.length) : 0}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <p className="text-xs text-purple-300">Total Payments</p>
                          <p className="text-lg font-bold text-white">{paidMembers.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Free Members List Modal */}
            {showFreeList && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden">
                <div className="absolute top-16 left-2 right-2 bottom-2 sm:top-20 sm:left-4 sm:right-4 sm:bottom-4 bg-gradient-to-br from-violet-900/95 via-purple-900/95 to-indigo-900/95 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Free Members</h2>
                    <Button variant="ghost" size="sm" onClick={closeAllModals} className="text-white hover:bg-white/10">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                    <div className="mb-4 p-4 bg-orange-500/20 rounded-lg border border-orange-400/30">
                      <div className="text-center">
                        <p className="text-orange-300 text-sm">Free Members</p>
                        <p className="text-2xl font-bold text-white">{freeMembers.length}</p>
                        <p className="text-orange-300 text-xs mt-1">{freePercentage.toFixed(1)}% of total members</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {freeMembers.map((member) => (
                        <div
                          key={member.id}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{member.name}</h3>
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">Free</Badge>
                          </div>
                          <div className="space-y-1 text-sm text-purple-200">
                            <p>{member.email}</p>
                            <p>{member.phone}</p>
                            <p className="font-mono text-purple-300">Pin: {member.pinCode || 'N/A'}</p>
                            <div className="flex justify-between items-center pt-2">
                              <span>Joined: {new Date(member.date).toLocaleDateString()}</span>
                              <span className="text-orange-300 font-medium">No Payment</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex-shrink-0">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-purple-300">Potential Revenue</p>
                        <p className="text-lg font-bold text-white">
                          GH₵{freeMembers.length * 51} - GH₵{freeMembers.length * 102}
                        </p>
                        <p className="text-xs text-purple-300 mt-1">If converted to paid memberships</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Members - Clickable on mobile */}
              <Card
                className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl lg:cursor-default cursor-pointer lg:hover:bg-white/10 hover:bg-white/15 transition-all duration-200"
                onClick={handleTotalMembersClick}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-purple-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalMembers.toLocaleString()}</div>
                  <div className="flex items-center space-x-1 text-xs text-green-300 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{stats.memberGrowth}% from last month</span>
                  </div>
                  <div className="lg:hidden text-xs text-purple-300 mt-2">Tap to view members</div>
                </CardContent>
              </Card>

              {/* Paid Members */}
              <Card
                className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl lg:cursor-default cursor-pointer lg:hover:bg-white/10 hover:bg-white/15 transition-all duration-200"
                onClick={handleTotalRevenueClick}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Paid Members</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.paidMembers.toLocaleString()}</div>
                  <div className="text-xs text-purple-300 mt-1">{paidPercentage.toFixed(1)}% of total members</div>
                  <div className="lg:hidden text-xs text-purple-300 mt-2">Tap to view payments</div>
                </CardContent>
              </Card>

              {/* Free Members - Clickable on mobile */}
              <Card
                className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl lg:cursor-default cursor-pointer lg:hover:bg-white/10 hover:bg-white/15 transition-all duration-200"
                onClick={handleFreeMembersClick}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Free Members</CardTitle>
                  <UserX className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.freeMembers.toLocaleString()}</div>
                  <div className="text-xs text-purple-300 mt-1">{freePercentage.toFixed(1)}% of total members</div>
                  <div className="lg:hidden text-xs text-purple-300 mt-2">Tap to view free members</div>
                </CardContent>
              </Card>

              {/* Total Revenue - Clickable on mobile */}
              <Card
                className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl lg:cursor-default cursor-pointer lg:hover:bg-white/10 hover:bg-white/15 transition-all duration-200"
                onClick={handleTotalRevenueClick}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="flex items-center space-x-1 text-xs text-green-300 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{stats.revenueGrowth}% from last month</span>
                  </div>
                  <div className="lg:hidden text-xs text-purple-300 mt-2">Tap to view payments</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Breakdown */}
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-300" />
                    <CardTitle className="text-xl font-bold text-white">Revenue Breakdown</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200">Monthly and total revenue overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                    <div>
                      <p className="text-sm text-purple-200">This Month</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(stats.monthlyRevenue)}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-300" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                    <div>
                      <p className="text-sm text-purple-200">All Time</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-300" />
                  </div>
                </CardContent>
              </Card>

              {/* Member Distribution */}
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-300" />
                    <CardTitle className="text-xl font-bold text-white">Member Distribution</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200">Breakdown of paid vs free members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Paid Members Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">Paid Members</span>
                      <span className="text-green-300">{stats.paidMembers.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${paidPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-purple-300">{paidPercentage.toFixed(1)}% of total</p>
                  </div>

                  {/* Free Members Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">Free Members</span>
                      <span className="text-orange-300">{stats.freeMembers.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${freePercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-purple-300">{freePercentage.toFixed(1)}% of total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Members Table - Hidden on mobile when modal is available */}
            <div className="mb-8 hidden lg:block">
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-300" />
                      <CardTitle className="text-xl font-bold text-white">Recent Members</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportToCSV}
                      className="bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                    >
                      CSV
                    </Button>
                  </div>
                  <CardDescription className="text-purple-200">
                    Latest member registrations and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Phone</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Pin Code</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentMembers.map((member) => (
                          <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 text-sm text-white font-medium">{member.name}</td>
                            <td className="py-3 px-4 text-sm text-purple-200">{member.email}</td>
                            <td className="py-3 px-4 text-sm text-purple-200">{member.phone}</td>
                            <td className="py-3 px-4 text-sm text-purple-200 font-mono">{member.pinCode || 'N/A'}</td>
                            <td className="py-3 px-4">
                              <Badge
                                className={
                                  member.status === "paid"
                                    ? "bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30"
                                    : "bg-orange-500/20 text-orange-300 border-orange-400/30 hover:bg-orange-500/30"
                                }
                              >
                                {member.status === "paid" ? "Paid" : "Free"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-white font-medium">
                              {member.status === "paid" ? `GH₵${typeof member.amount === 'string' && member.amount.match(/\d+/) ? member.amount.match(/\d+/)[0] : member.amount}` : "-"}
                            </td>
                            <td className="py-3 px-4 text-sm text-purple-200">
                              {new Date(member.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="text-sm text-purple-300">
                        Showing {startIndex + 1}-{Math.min(endIndex, membersData.length)} of {membersData.length} members
                      </p>
                      <p className="text-xs text-purple-400">
                        Page {currentPage} of {totalPages}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Detailed Reports
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:text-white backdrop-blur-sm font-semibold px-8 py-3 transition-all duration-300"
              >
                <Users className="w-5 h-5 mr-2" />
                Manage Members
              </Button>
            </div>

            {/* Bottom text */}
            <div className="text-center mt-8 pb-8">
              <p className="text-purple-300 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
