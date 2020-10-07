import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { withAuthSync } from '../utils/auth'
import Layout from '../components/layout'

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (res.status >= 300) {
      throw new Error('API Client error')
    }

    return res.json()
  })

const followUser=async (followee)=>{
  const response = await fetch('/api/follow-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ followee }),
  })

  if (response.status !== 200) {
    throw new Error(await response.text())
  }
  mutate('/api/list-users')
  
}  
const usersListed = () => {
  const router = useRouter()
  const { data: users, error } = useSWR('/api/list-users', fetcher)
  useEffect(() => {
    if (error) router.push('/')
  }, [error, router])
  
  return (
    <Layout>
      <h1>This page shows a list of users and the option to follow them</h1>
      {error ? (
        <h1>An error has occurred: {error.message}</h1>
      ) : users ? (
        users.map((user,index)=>(
        <div key={index}>
          <hr/>
          <p>{user.isSelf?'Your':'This'} user id is <b>{user.userId}</b>  </p>
          <p>Currently, you are {user.isFollowee?'following':'not following'} {user.isSelf?'yourself':'this user'} <button onClick={()=>followUser(user.userId)}>{user.isFollowee?'Unfollow':'Follow'}</button></p>
        </div>
        ))
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

export default withAuthSync(usersListed)
