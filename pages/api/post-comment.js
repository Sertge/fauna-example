import { query as q } from 'faunadb'
import { faunaClient,FAUNA_SECRET_COOKIE } from '../../utils/fauna-auth'
import cookie from 'cookie'

export default async function postComment(req,res){
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const faunaSecret = cookies[FAUNA_SECRET_COOKIE]
  if (!faunaSecret) {
    return res.status(401).send('Auth cookie missing.')
  }
  
  let postId= q.Ref(q.Collection('Posts'), req.body.postId)
  let description=await req.body.description
  
  try {
    const commentCreated= await faunaClient(faunaSecret)
    .query(q.Call(q.Function('postComment'),[postId,description]))
    .catch((error)=>{console.log(error); return error})
    if (commentCreated.message){
      if(commentCreated.message=='unauthorized') return res.status(401).send('invalid Auth cookie')
      throw new Error(commentCreated.message)
    }
    res.status(200).send(commentCreated.data)
  }catch(err){
    console.log(err)
    return res.status(400).send(err.message)
  }
}