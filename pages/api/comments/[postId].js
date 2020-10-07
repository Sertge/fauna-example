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
    const comments=await faunaClient(faunaSecret)
    .query(q.Call(q.Function('getComments'),q.Ref(q.Collection('Posts'),postId)))
    .catch((error)=>{
      console.log(error)
      return error
    })
    if (comments.message){
      if(comments.message=='unauthorized') return res.status(401).send('invalid Auth cookie')
      throw new Error(comments.message)
    }
    comments.data.forEach((el)=>el.owner=el.owner.id)
    res.status(200).send(comments.data)
  }catch(err){
    console.log(err)
    return res.status(400).send(err.message)
  }
}