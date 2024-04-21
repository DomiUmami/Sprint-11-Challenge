import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'


export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)



  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate(loginUrl) }
  const redirectToArticles = () => { navigate(articlesUrl) }

 


  const logout = () => {
    const token = localStorage.getItem('token')
    if (token || !token ){
    navigate('/')
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    }
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  
  }

  const getArticles = (data) => {
    try {
      setMessage(data.message)
      setArticles(data.articles)
    } catch(error){
      console.log('failed')
    } finally {
      setSpinnerOn(false)
    }
    
  }

  const postArticle = async (article) => {
    try{
      setArticles([...articles, article.data.article])
      setMessage(article.data.message)
    } catch(error){
      console.log('failed')
    }finally{
    }
  }


  const updateArticle = async ({ article_id, article }) => {
    try{
    const articleIndex = articles.findIndex(a => a.article_id === article_id)

    if(articleIndex !== -1){
      const updatedArticles = [...articles]
      updatedArticles[articleIndex] = { ...updatedArticles[articleIndex], ...article }
      setArticles(updatedArticles)
    }
      
     
    }catch(error){
      console.log('big nothtings')
    }

  }
  

  const deleteArticle = async (article_id, data) => {
    try{
      const updatedArticles = articles.filter(article => article.article_id !== article_id)
      setArticles(updatedArticles)
      setMessage(data.message)
    } catch(error){
      console.log('failed')
    }

  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm setCurrentArticleId={setCurrentArticleId} updateArticle={updateArticle} postArticle={postArticle} currentArticleId={currentArticleId} articles={articles} setMessage={setMessage}/>
              <Articles setCurrentArticleId={setCurrentArticleId} updateArticle={updateArticle} deleteArticle={deleteArticle} getArticles={getArticles} articles={articles} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
