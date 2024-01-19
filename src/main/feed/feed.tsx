import {useState} from 'react'
import "./feed.css"
import {motion} from 'framer-motion'
import {FiEdit2} from 'react-icons/fi'
import NewFeed from './newFeed'
import ForYouFeeds from './forYouFeeds'
import Featured from './Featured'
import Recent from './Recent'
import { Link } from 'react-router-dom'
// import { useSelector } from "react-redux/es/hooks/useSelector"

export default function Feed() {
  // const {user} = useSelector((state: any) => state.user )
  const [display, setDisplay] = useState('For you')
  
  const [newPost, setNewPost] = useState(false)

  const handleDisplay = (e: React.MouseEvent<HTMLElement>)=>{
    e.preventDefault();
    const For_you = 'For you';
    const Featured = 'Featured';
    const Recent = 'Recent';
    let render = e.currentTarget.innerHTML;
    console.log({render})
    switch (render) {
      case For_you:
        return setDisplay(For_you)
      case Featured:
      return setDisplay(Featured)
      case Recent:
        return setDisplay(Recent)
      default:
        break;
    }
   return console.log({display})
  }
  return (
    <motion.main
    transition={{delay: 1}}
    className="feedContainer">
     
        <>
        <section className="feedHead">
          <div className="feedHead_left">
            <h1 >
              FEED
            </h1>
            <p className="head_desc">
              Explore different content you would love
            </p>
          </div>
          <Link className="feed_button" to={'/home/newfeed'}>
            <button>
           <span><FiEdit2/></span> 
               post a content
            </button>
          </Link>
        </section>
        <section className="feeds_container">
          <div className="feeds_sec">
            <span onClick={handleDisplay} style={display === 'For you'? {borderBottom: '2px solid #543EE0'}: undefined}>For you</span>
            <span onClick={handleDisplay} style={display === 'Featured'? {borderBottom: '2px solid #543EE0'}: undefined}>Featured</span>
            <span onClick={handleDisplay} style={display === 'Recent'? {borderBottom: '2px solid #543EE0'}: undefined}>Recent</span>
          </div>
          <div className='feeds_display'>
            { display == 'For you'? <ForYouFeeds/> : display === 'Featured'? <Featured/> : <Recent/>}
          </div>
        </section>
        </>
        {/* </> :
        <NewFeed setNewPost={setNewPost}/>
      } */}
     
    </motion.main>
  )
}
