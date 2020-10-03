import { query as q } from 'faunadb'
import { serverClient, serializeFaunaCookie } from '../../utils/fauna-auth'

export default async function signuo(req, res) {
  const { email, password } = await req.body

  try {
    if (!email || !password) {
      throw new Error('Email and password must be provided.')
    }
    console.log(`email: ${email} trying to create user.`)

    let loginRes

    try {
      loginRes = await serverClient.query(
        q.Call(q.Function('signupUser'), [ email , password ])
      )
    } catch (error) {
      console.error('Fauna create user error:', error)
      throw new Error('No secret present in login query response.')
    }

    if (!loginRes.secret) {
      throw new Error('No ref present in create query response.')
    }

    const cookieSerialized = serializeFaunaCookie(loginRes.secret)

    res.setHeader('Set-Cookie', cookieSerialized)
    res.status(200).end()
  } catch (error) {
    res.status(400).send(error.message)
  }
}
