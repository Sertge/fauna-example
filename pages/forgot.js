import Layout from '../components/layout'

  const requestCode=async(content)=>{
    content.preventDefault()
    const response = await fetch('/api/recover',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email:content.target.email.value }),
    })
    if (response.status !==200){
      throw new Error(await response.text())
    }
  }

const recoverPassword=()=>{
  return(
  <Layout>
    <h1>Lost your password? </h1>
    <h2>Enter your email address here and we will send you the steps to recover it</h2>
    <form onSubmit={requestCode}>
      <input type="text" name="email"/>
      <input type="submit" value="Submit" />
    </form>
  </Layout>)
}

export default recoverPassword