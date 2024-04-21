import React, { useEffect, useState } from 'react'
import PT from 'prop-types'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {


  const [values, setValues] = useState(initialFormValues)
  const { postArticle, updateArticle, setCurrentArticleId, currentArticleId, currentArticle, articles, setMessage } = props
  


  useEffect(() => {
    if (props.currentArticleId) {
      const currentArticle = props.articles.find(articles => articles.article_id === currentArticleId)
      if(currentArticle){
        setValues(currentArticle)
      }
    } else {
      setValues(initialFormValues)
    }
  }, [currentArticleId, props.articles])
  

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = async evt => {
    evt.preventDefault()
    const token = localStorage.getItem('token')
    if(!token){
      console.log('User is not authenticated.')
    }


    try{
    if (props.currentArticleId) {
      const  response = await axios.put(`http://localhost:9000/api/articles/${props.currentArticleId}`, values, { headers: { Authorization: token} })
      const { article_id, ...article } = response.data.article 
      updateArticle({ article_id, article })
      //console.log(response.data.article)
      props.setMessage(response.data.message)
    } else {
      const article = await axios.post(`http://localhost:9000/api/articles`, values, { headers: { Authorization: token} })
      postArticle(article)
    }
    setCurrentArticleId(null)
    setValues(initialFormValues)
    }catch(error){
        console.log('failed')
      }
    }
  

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    return !(values.title && values.text && values.topic)
  }

  const onCancelEdit = () => {
    setCurrentArticleId(null)
    setValues(initialFormValues)
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? "Edit Article" : "Create Article"}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        {currentArticleId && (
          <button onClick={onCancelEdit}>Cancel edit</button>
          )}
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
