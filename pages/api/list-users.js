import { query as q } from 'faunadb'
import { faunaClient,FAUNA_SECRET_COOKIE } from '../../utils/fauna-auth'
import cookie from 'cookie'

export default async function listUsers(req,res){
  //read the cookie
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const faunaSecret = cookies[FAUNA_SECRET_COOKIE]
  //when there's no cookie, send status 401, Unauthorized
  if (!faunaSecret) {
    return res.status(401).send('Auth cookie missing.')
  }
  let after= await req.query.after
  
  try {
    // use query to call Fauna function
    const usersPage= await faunaClient(faunaSecret)
    .query(q.Call(q.Function('listUsers'),after||[null]))
    .catch((error)=>{console.log(error); return error})
    //catch errors in case there's any
    if (usersPage.message){
      //if the error has the message 'unauthorized', send status 401 as the login is invalid
      if(usersPage.message=='unauthorized') return res.status(401).send('invalid Auth cookie')
      throw new Error(usersPage.message)
    }
    
    res.status(200).send(usersPage.data)
  }catch(err){
    console.log(err)
    return res.status(400).send(err.message)
  }

}