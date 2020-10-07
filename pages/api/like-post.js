import { query as q } from 'faunadb'
import { faunaClient,FAUNA_SECRET_COOKIE } from '../../utils/fauna-auth'
import cookie from 'cookie'

export default async function likePost(req,res){
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const faunaSecret = cookies[FAUNA_SECRET_COOKIE]
  if (!faunaSecret) {
    return res.status(401).send('Auth cookie missing.')
  }
  
  try {
    const isLiked= await faunaClient(faunaSecret)
    .query(q.Call(q.Function('toggleLike'),req.body))
    .catch((error)=>{console.log(error); return error})
    if (isLiked.message){
      if(isLiked.message=='unauthorized') return res.status(401).send('invalid Auth cookie')
      throw new Error(isLiked.message)
    }
    console.log(isLiked)
    res.status(200).send(isLiked)
  }catch(err){
    console.log(err)
    return res.status(400).send(err.message)
  }
}