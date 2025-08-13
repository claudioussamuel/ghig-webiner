import { useState, useEffect } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

interface UserData {
  email: string
  role: string
  [key: string]: any
}

interface UseUserRoleReturn {
  userRole: string | null
  userData: UserData | null
  loading: boolean
  error: string | null
}

export function useUserRole(user: FirebaseUser | null): UseUserRoleReturn {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.email) {
        setUserRole(null)
        setUserData(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Query user document by email field from the 'webinar-1' collection
        const usersQuery = query(
          collection(db, 'users'),
          where('email', '==', user.email)
        )
        const querySnapshot = await getDocs(usersQuery)

        if (!querySnapshot.empty) {
          // Get the first matching document
          const userDoc = querySnapshot.docs[0]
          const data = userDoc.data() as UserData
          setUserData(data)
          setUserRole(data.role || null)

          console.log(data.role)
        } else {
          setError('User document not found in webinar-1 collection')
          setUserRole(null)
          setUserData(null)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user role')
        setUserRole(null)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user?.email])

  return { userRole, userData, loading, error }
}
