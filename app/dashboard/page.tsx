"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, TrendingUp, UserCheck, UserX, Sparkles, BarChart3, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { db } from "../config/firebase"
import { collection, addDoc, getDocs } from "firebase/firestore"

export default function DashboardPage() {
  const [membersData, setMembersData] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalMembers: 0,
    paidMembers: 0,
    freeMembers: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    const fetchMembers = async () => {
      const snapshot = await getDocs(collection(db, "webinar-1"))
      const members = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: `${data.surname} ${data.otherNames}`,
          email: data.email,
          phone: data.phone,
          status: data.payed ? "paid" : "free",
          amount: data.price,
          date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split("T")[0] : "",
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
      })
    }
    fetchMembers()
  }, [])

  const exportToCSV = () => {
    // Define CSV headers
    const headers = ["Name", "Email", "Phone", "Status", "Amount (GHS)", "Registration Date"]

    // Convert data to CSV format
    const csvContent = [
      headers.join(","),
      ...membersData.map((member) =>
        [
          `"${member.name}"`,
          `"${member.email}"`,
          `"${member.phone}"`,
          `"${member.status}"`,
          member.amount.match(/\d+/),
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

  const paidPercentage = (stats.paidMembers / stats.totalMembers) * 100
  const freePercentage = (stats.freeMembers / stats.totalMembers) * 100

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

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-2xl overflow-hidden">
            <img
                src="/images.jpg"
                alt="Admin Registration Icon"
                className="w-16 h-16 object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-purple-200 text-lg">Overview of members and revenue</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Members */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Total Members</CardTitle>
                <Users className="h-4 w-4 text-purple-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalMembers.toLocaleString()}</div>
                
              </CardContent>
            </Card>

            {/* Paid Members */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Paid Members</CardTitle>
                <UserCheck className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.paidMembers.toLocaleString()}</div>
  
              </CardContent>
            </Card>

            {/* Free Members */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Free Members</CardTitle>
                <UserX className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.freeMembers.toLocaleString()}</div>

              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</div>
             
              </CardContent>
            </Card>
          </div>

       

          {/* Members Table */}
          <div className="mb-8">
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
                        <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-purple-200">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersData.slice(0, 6).map((member) => (
                        <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-sm text-white font-medium">{member.name}</td>
                          <td className="py-3 px-4 text-sm text-purple-200">{member.email}</td>
                          <td className="py-3 px-4 text-sm text-purple-200">{member.phone}</td>
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
                            { `${member.amount}`}
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
                  <p className="text-sm text-purple-300">Showing 6 of {membersData.length} members</p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                      disabled
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-purple-200 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

    

          {/* Bottom text */}
          <div className="text-center mt-8 pb-8">
            <p className="text-purple-300 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
