import React, { useEffect } from 'react'
import {  useNavigate, Routes, route } from 'react-router-dom'
import PT from 'prop-types'
import axios from 'axios'

export default function Articles(props){
    props.articles,
    props.getArticles,
    props.deleteArticle,
    props.setCurrentArticleId,
    props.updateArticle

  const navigate = useNavigate()  

  
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token ) {
      navigate('/')
    }
    
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get('http://localhost:9000/api/articles', { headers: { Authorization: token } })
        props.getArticles(data)
      } catch (error) {
        localStorage.removeItem('token')
        navigate('/')
      }
    }
    fetchArticles()
  }, [])


  const handleEditClick = async (article) => {
    props.setCurrentArticleId(article.article_id)
  }

  const handleDeleteClick = async (article_id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`http://localhost:9000/api/articles/${article_id}`, { headers: { Authorization: token }});
      props.deleteArticle(article_id, response.data)    
    } catch (error) {
      console.error('failed')
    }
  }


  return (
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        !props.articles.length
          ? 'No articles yet'
          : props.articles.map(article => {
            return (
              <div className="article" key={article.article_id}>
                <div>
                  <h3>{article.title}</h3>
                  <p>{article.text}</p>
                  <p>Topic: {article.topic}</p>
                </div>
                <div>
                  <button onClick={() => handleEditClick(article)}>Edit</button>
                  <button onClick={() => handleDeleteClick(article.article_id)}>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
