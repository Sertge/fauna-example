import { query as q } from 'faunadb'
import { faunaClient,FAUNA_SECRET_COOKIE } from '../../utils/fauna-auth'
import cookie from 'cookie'

export default async function newPost(req,res){
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const faunaSecret = cookies[FAUNA_SECRET_COOKIE]

  if (!faunaSecret) {
    return res.status(401).send('Auth cookie missing.')
  }

  try{
    const newPostContent= await faunaClient(faunaSecret)
    .query(q.Call(q.Function('createPost'),req.body.description))
    .catch((error)=>{console.log(error); return error})

    if(newPostContent.message){
      if(newPostContent.message=='unauthorized')return res.status(401).send('invalid Auth cookie')
      throw new Error(newPostContent.message)
    }
    res.status(200).send(newPostContent)
  }catch(err){
    console.log(err)
    return res.status(400).send(err.message)
  }
}