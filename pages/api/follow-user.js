import { query as q } from 'faunadb'
import { faunaClient,FAUNA_SECRET_COOKIE } from '../../utils/fauna-auth'
import cookie from 'cookie'

export default async function followUser(req,res){
  const cookies=cookie.parse(req.headers.cookie??'')
  const faunaSecret=cookies[FAUNA_SECRET_COOKIE]
  let followee= q.Ref(`collections/Users/${await req.body.followee}`)
  if(!faunaSecret){
    return res.status(401).send('Auth cookie missing.')
  }

  try{
    const followResponse= await  faunaClient(faunaSecret)
    .query(q.Call(q.Function('followUser'),followee))
    .catch((error)=>{console.log(error);return error})
    if (followResponse.message){
      if(followResponse.message=='unauthorized') return res.status(401).send('invalid Auth cookie')
      throw new Error(followResponse.message)
    }
    res.status(200).send(followResponse)
  }catch(err){
    console.log(err);
    return res.status(400).send(err.message)
  }
}