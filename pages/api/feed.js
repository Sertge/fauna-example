import { query as q } from 'faunadb'
import { faunaClient,FAUNA_SECRET_COOKIE } from '../../utils/fauna-auth'
import cookie from 'cookie'

export default async function getFeed(req,res){
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const faunaSecret = cookies[FAUNA_SECRET_COOKIE]
  if (!faunaSecret) {
    return res.status(401).send('Auth cookie missing.')
  }
  let after= await req.query.after
  
  try {
    const feedResponse= await faunaClient(faunaSecret)
    .query(q.Call(q.Function('getFeed'),after||[null]))
    .catch((error)=>{console.log(error); return error})
    if (feedResponse.message){
      if(feedResponse.message=='unauthorized') return res.status(401).send('invalid Auth cookie')
      throw new Error(feedResponse.message)
    }
    feedResponse.data.forEach((el)=>{
      el.owner=el.owner.id
      el.date=el.date.value
      el.collection=el.postId.collection.id
      el.postId=el.postId.id
    })
    res.status(200).send(feedResponse.data)
  }catch(err){
    console.log(err)
    return res.status(400).send(err.message)
  }
}