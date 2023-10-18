import './App.css'
import Home from './landingPage/home'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

function App() {

  return (
    <>
     <Home/>
    </>
  )
}

export default App
