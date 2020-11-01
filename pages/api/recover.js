import { query as q } from 'faunadb'
import { serverClient } from '../../utils/fauna-auth'
const sgMail = require('@sendgrid/mail')

async function recoverEmail(req, res) {
  const { email } = await req.body

  try {
    if (!email) {
      throw new Error('Email must be provided.')
    }

    const passswordRecovery = await serverClient.query(
      q.Call(q.Function('recoverPassword'), email)
    ).catch(err=>{console.log(err)})

    if (passswordRecovery.message) {
      throw new Error('No secret present in login query response.')
    }else{
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      const msg={
        to:email,
        from:process.env.VERIFIED_EMAIL,
        subject: 'password recovery',
        text:'Password recovery process from yourWebsite.com',
        html:`
          <html>
            <head>
              <title></title>
            </head>
            <body>
              <div>
                <h1> Did you forget your password on yourWebsite.com? </h1>
                <div>  
                  <p>click on the following link and it will redirect you to a form to change your password.</p>
                    <a href="${
                      process.env.NODE_ENV == 'production'
                        ? 'http://yourWebsite.com'
                        : 'http://localhost:3000'
                    }/reset?token=${passswordRecovery.secret}">password recovery </a> 
                  </div>
              </div>
            </body>
          </html>
        `
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    }

    res.status(200).send({confirmation:'done'})
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }
}
export default recoverEmail