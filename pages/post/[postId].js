import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { withAuthSync } from '../../utils/auth'
import Layout from '../../components/layout'

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (res.status >= 300) {
      throw new Error('API Client error')
    }

    return res.json()
  })

const giveLike=async (postId)=>{
  const response = await fetch ('api/like-post',{
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
  const response= await fetch ('../api/post-comment',{
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
  mutate(`api/comments/${postId}`)
}

const postView=()=>{
  const router = useRouter()
  const postId=(router.query.postId && router.query.postId!='undefined')?router.query.postId:''  
  const {data:post,errorPost}=useSWR(`/api/post/${postId}`,fetcher)
  const {data:comments,errorComments}=useSWR(`/api/comments/${postId}`,fetcher)
  console.log(comments)
  useEffect(()=>{
    if(errorPost||errorComments) router.push('/')
  },[errorPost,errorComments,router])
  return(
    <Layout>
      <h1>On this page, you should see a post</h1>
      {(errorPost||errorComments)?<h1>An error has occurred: {errorPost.message||errorPost.message}</h1>
        :post?(
          <div>
            <p><b>{post.userIsOwner?'You':post.owner}</b> posted:</p>
            <h4><i>{post.description}</i></h4>
            <p>on {new Date(post.date).toUTCString()}</p>
            <p> {post.userIsOwner?'Your':'This'} post has {post.likes} Likes <button onClick={()=>giveLike(post.postId)}>{post.isLiked?'Dislike':'Like'}</button></p>
            <p> {post.userIsOwner?'Your':'This'} post has {post.comments} Comments</p>
            <h3>Comments:</h3>
          {comments
            ?(comments.map((comment,index)=>{
              console.log(comment)
              return(
              <p key={index}>User {comment.owner} wrote: {comment.description}</p>
              )
            })):<p>no comments</p>}
          <form onSubmit={(event)=>{event.preventDefault(),postComment(post.postId,event)}}> 
          <h3>Write a comment</h3>
          <input type='text' name='description'/>
          <input type='submit' value='Add comment'/>
        </form>
          </div>
        ):<h1>Loading</h1>
      }
      
      
    </Layout>
  )
}

export default withAuthSync(postView)