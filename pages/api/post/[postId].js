import { query as q } from 'faunadb'
import { faunaClient,FAUNA_SECRET_COOKIE } from '../../../utils/fauna-auth'
import cookie from 'cookie'

export default async function getFullPost(req,res){
  const cookies = cookie.parse(req.headers.cookie??'')
  const faunaSecret = cookies[FAUNA_SECRET_COOKIE]
  if(!faunaSecret){
    return res.status(401).send('Auth cookie missing.')
  }
  let postId=await req.query.postId

  try{
    const thePost=await faunaClient(faunaSecret)
    .query(q.Get(q.Ref(q.Collection('Posts'),postId)))
    .catch((error)=>{
      console.log(error)
      return error
    })
    if (thePost.message){
      if(thePost.message=='unauthorized') return res.status(401).send('invalid Auth cookie')
      throw new Error(commentCreated.message)
    }
      thePost.data.date=thePost.data.date.value,
      thePost.data.owner=thePost.data.owner.id
      thePost.data.postId=postId
    res.status(200).send(thePost.data)
  }catch(err){
    console.log(err)
    return res.status(400).send(err.message)
  }
}