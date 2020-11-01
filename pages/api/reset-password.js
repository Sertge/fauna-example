import { query as q } from 'faunadb'
import { faunaClient } from '../../utils/fauna-auth'

async function resetPassword(req,res){
  const faunaSecret = req.body.token
  if (!faunaSecret) {
    return res.status(401).send('Auth token missing.')
  }
  
  try {
    const passwordConfirm= await faunaClient(faunaSecret)
    .query(q.Call(q.Function('resetPassword'),req.body.password))
    .catch((error)=>{console.log(error); return error})
    if (passwordConfirm.message){
      if(passwordConfirm.message=='unauthorized') return res.status(401).send('This token has expired')
      throw new Error(passwordConfirm.message)
    }
    res.status(200).send(passwordConfirm)
  }catch(err){
    console.log(err)
    return res.status(400).send(err.message)
  }
}

export default resetPassword