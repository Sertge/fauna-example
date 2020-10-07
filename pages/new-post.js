import { withAuthSync } from '../utils/auth'
import Layout from '../components/layout'

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (res.status >= 300) {
      throw new Error('API Client error')
    }

    return res.json()
  })

  const postUpdate=async(content)=>{
    content.preventDefault()
    // console.log(content.target.description.value)
    const response = await fetch('/api/new-post',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description:content.target.description.value }),
    })
    if (response.status !==200){
      throw new Error(await response.text())
    }
  }

const uploadPosts=()=>{
  return(
  <Layout>
    <h1>Say it aloud!</h1>
    <form onSubmit={postUpdate}>
      <input type="text" name="description"/>
      <input type="submit" value="Submit" />
    </form>
  </Layout>)
}

export default withAuthSync(uploadPosts)