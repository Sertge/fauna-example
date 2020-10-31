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
const usersListed = () => {
  const router = useRouter()
  let { data, error } = useSWR('/api/premium', fetcher)
  useEffect(() => {
    if (error) {error=null; router.push('/')}
  }, [error, router])
  
  return (
    <Layout>
      <h1>This page shows the premium content available for a VIP user</h1>
      {error ? (
        <h1>An error has occurred: {error.message}</h1>
      ) : data ? (
        data.map((video,index)=>(
        <div key={index}>
          <hr/>
          <p>Description: {video.text}</p>
          <iframe width="560" height="315" src={`https://www.youtube.com/embed/${video.video}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
        ))
      ) : (
        <h1>If you see no content here, you don't have the permissions to see it</h1>
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
