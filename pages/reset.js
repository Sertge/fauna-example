import { useRouter } from 'next/router'
import Layout from '../components/layout'

  const requestCode=async({password,token})=>{
    console.log(password,token)
    const response = await fetch('/api/reset-password',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, token }),
    })
    if (response.status !==200){
      throw new Error(await response.text())
    }
  }

const recoverPassword=()=>{
  const router=useRouter()
  return(
  <Layout>
    <h1>Almost there! </h1>
    <h2>You have confirmed your email, please fill the field with your new password</h2>
    <form onSubmit={
      (content)=>{
        content.preventDefault(),
        requestCode({password:content.target.password.value,token:router.query.token})
      }
    }>
      <input type="password" name="password"/>
      <input type="submit" value="Submit" />
    </form>
  </Layout>)
}

export default recoverPassword