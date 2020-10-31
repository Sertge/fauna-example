import { query as q } from 'faunadb'
import { faunaClient,FAUNA_SECRET_COOKIE } from '../../utils/fauna-auth'
import cookie from 'cookie'

export default async function getFullPost(req,res){
  const cookies = cookie.parse(req.headers.cookie??'')
  const faunaSecret = cookies[FAUNA_SECRET_COOKIE]
  if(!faunaSecret){
    return res.status(401).send('Auth cookie missing.')
  }

  try{
    const videos=await faunaClient(faunaSecret)
    .query(q.Call(q.Function('premiumContent'),[]))
    .catch((error)=>{
      console.log(error)
      return error
    })
    if (videos.message){
      if(videos.message=='unauthorized') {
        return res.status(401).send('invalid Auth cookie')
      }else if(videos.message=='permission denied')
        return res.status(200).send(false)
      throw new Error(videos.message)
    }
    res.status(200).send(videos.data)
  }catch(err){
    console.log(err)
    return res.status(400).send(err.message)
  }
}