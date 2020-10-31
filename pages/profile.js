import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { withAuthSync } from '../utils/auth'
import Layout from '../components/layout'

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (res.status >= 300) {
      throw new Error('API Client error')
    }

    return res.json()
  })

const Profile = () => {
  const router = useRouter()
  let { data: user, error: errorUser } = useSWR('/api/profile', fetcher)

  useEffect(() => {
    if (errorUser) {errorUser=null; router.push('/')}
  }, [errorUser, router])

  return (
    <Layout>
      {errorUser ? (
        <h1>An error has occurred: {errorUser.message}</h1>
      ) : user ? (
        <h1>Your user id is {user.userId}</h1>
      ) : (
        <h1>Loading...</h1>
      )}
      <style jsx>{`
        h1 {
          margin-bottom: 0;
        }
      `}</style>
    </Layout>
  )
}

export default withAuthSync(Profile)
