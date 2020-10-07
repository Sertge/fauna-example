import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { withAuthSync } from '../utils/auth'
import Layout from '../components/layout'
import Link from 'next/link'

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (res.status >= 300) {
      throw new Error('API Client error')
    }

    return res.json()
  })

const giveLike=async (postId)=>{
  const response = await fetch ('/api/like-post',{
    method:"POST",
    headers:{ 'Content-Type': 'application/json' },
    body:JSON.stringify({postId})
  })
  if (response.status!==200){
    throw new Error(await response.text())
  }
  mutate('/api/feed')
}

const postComment=async(postId,formEvent)=>{  
  const response= await fetch ('api/post-comment',{
    method:"POST",
    headers:{ 'Content-Type': 'application/json' },
    body:JSON.stringify({
      postId,
      description:formEvent.target.description.value
    })
  })
  if (response.status!==200){
    throw new Error(await response.text())
  }
}

const userFeed=()=>{
  const router = useRouter()
  const {data:posts,error}=useSWR('/api/feed',fetcher)
  useEffect(()=>{
    if(error) router.push('/')
  },[error,router])

  return(
    <Layout>
      <h1>This page shows your feed</h1>
      <p>if you see this page empty, go and follow some <Link href='/list-users'><a>users</a></Link>, or create some <Link href='/new-post'><a>posts</a></Link></p>
      {
      error
      ?(<h1>An error has occurred: {error.message}</h1>)
      :posts?(
        posts.map((post,index)=>(
          <div key={index}>
            <hr/>
            <p><b>{post.userIsOwner?'You':post.owner}</b> posted:</p>
            <h4><i>{post.description}</i></h4>
            <Link href={`/post/${post.postId}`}><a>See post and comments</a></Link>
            <p>on {new Date(post.date).toUTCString()}</p>
            <p> {post.userIsOwner?'Your':'This'} post has {post.likes} Likes <button onClick={()=>giveLike(post.postId)}>{post.isLiked?'Dislike':'Like'}</button></p>
            <p> {post.userIsOwner?'Your':'This'} post has {post.comments} Comments</p>
            <form onSubmit={(event)=>{event.preventDefault(),postComment(post.postId,event)}}> 
              <p>Write a comment</p>
              <input type='text' name='description'/>
              <input type='submit' value='Add comment'/>
            </form>
          </div>
        ))
        ):<h1>Loading...</h1>
      }
    </Layout>
  )
}

export default withAuthSync(userFeed)