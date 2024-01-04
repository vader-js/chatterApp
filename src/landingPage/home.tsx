import { useState, MouseEvent } from "react";
import hero from "../assets/images/landinghero.jpg";
import aboutimg from "../assets/images/aboutimg.jpg";
import analytics from "../assets/images/analytics.png";
import community from "../assets/images/community.png";
import content from "../assets/images/content.png";
import diego from "../assets/images/diego.jpg";
import imagex from "../assets/images/imagex.jpg";
import alex from "../assets/images/alex.jpg";
import { feedbacks } from "../assets/feedbacks/feedbacks";
import "./home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [idNum, setIdNum] = useState<number>(1);
  interface feedback {
    id: number;
    name: string;
    title: string;
    image: string;
    feedback: string;
  }

  const feeds = feedbacks as feedback[];



// useEffect(() => {
//     const interval = setInterval(() => {
//       if (idNum === feeds.length) {
//         setIdNum(1);
//       } else {
//         setIdNum(idNum + 1);
//       }
//     }, 10000);
//     return () => clearInterval(interval);
// }, [idNum]);
const navigate =  useNavigate();
const handleAuth = (e: MouseEvent) => {
  e.preventDefault();
  if(e.currentTarget.innerHTML === "Log in") {
    navigate("/auth/login")
  } else {
    navigate("/auth")
}
}

  return (
    <main className="container">
      <nav>
        <div className="title">
          <span className="ball"></span> <sup>vader</sup>{" "}
          <span className="titlebig">CHATTER</span>
        </div>
        <ul className="navigation">
          <li className="nav">home</li>
          <li className="nav">about us</li>
          <li className="nav">contacts</li>
          <li className="nav">blogs</li>
        </ul>
        <ul className="auth">
          <li className="authlist" onClick={(e)=> handleAuth(e)}>Log in</li>
          <li className="authlist"onClick={(e)=> handleAuth(e)}>Sign up</li>
        </ul>
      </nav>
      <section className="hero">
        <img src={hero} alt="" />
        <div className="herocontent">
          <h1 className="herohead">
            welcome to vader-chatter: a haven for text-based content
          </h1>
          <p className="herotext">
            unleash the power of words, connect with like-minded readers and
            writers, and discover new stories you'll love.
          </p>
          <button className="herobutton" onClick={(e)=> handleAuth(e)}>Get started</button>
        </div>
      </section>
      <section className="about">
        <aside className="aboutcontent">
          <h1 className="abouthead">About Chatter</h1>
          <p className="abouttext">
            vader Chatter is a multi-functional platform where authors and
            readers can have access to their own content.Our vision is to foster
            an inclusive and vibrant community of readers and writers where
            diversity is celebrated. We encourage open-midedness and respect for
            all individuals, regardless of their backgrounds or beliefs by
            promoting dialogue and understanding through the power of words.
          </p>
        </aside>
        <aside className="aboutimg">
          <img src={aboutimg} alt="" />
        </aside>
      </section>
      <section className="join">
        <h1 className="joinhead">why you should join vader chatter</h1>
        <p className="jointext">
          our goal is to make writters and readers see our platform as their
          next heaven for blogging, ensuring ease in interaction, connecting
          with like-minded peers, have access to favourite content based on
          interest and able to communicate your great ideas with others.
        </p>
        <aside className="joincontent">
          <article className="analytics">
            <span className="logo">
              <img src={analytics} alt="" />
            </span>
            <h1>Analytics</h1>
            <p className="analyticsContent">
              Analytics to track the number of views, likes and comment and also
              analyze the performance of your articles over a period of time
            </p>
          </article>
          <article className="community">
            <span className="logo">
              <img src={community} alt="" />
            </span>
            <h1>Social Interactions</h1>
            <p className="analyticsContent">
              Users on the platform can interact with posts they like, comment
              and engage in discussions
            </p>
          </article>
          <article className="content">
            <span className="logo">
              <img src={content} alt="" />
            </span>
            <h1>Content creation</h1>
            <p className="analyticsContent">
              Write nice and appealing with our in-built markdown, a rich text
              editor
            </p>
          </article>
        </aside>
      </section>
      <section className="feedbacks">
        {feeds
          .filter((feedId) => feedId.id === idNum)
          .map((feed) => {
            return (
              <div className="feedback" key={feed.id}>
                <div className="feeds">
                  <aside className="feedsImage">
                    <img src={feed.image} alt="" />
                  </aside>
                  <article className="feedsdesc">
                    <p className="desc">{feed.feedback}</p>
                    <p className="name">
                      {feed.name}, <span>{feed.title}</span>
                    </p>
                    <button onClick={(e)=> handleAuth(e)}>Join vader-chatter</button>
                  </article>
                </div>
                <div className="radio">
                {[...Array(feeds.length)].map((_, index)=>{
                    return <span className={index + 1 === idNum ? "feedactive" : "feedinactive"} onClick={()=>setIdNum(index+ 1)} key={index}></span>
                })}
                </div>
                
              </div>
            );
          })}
      </section>
      <section className="share">
        <article className="shares">
        <aside className="imagebox">
          <img src={imagex} alt="" className="imagex"/>
          <img src={diego} alt="" />
          <img src={alex} alt="" />
        </aside>
        <aside className="sharecontent">
          <div className="content">
          <h1 className="shareHead">
            Write read and connect with great minds on chatter
          </h1>
          <p className="shareText">
            Share people your great ideas, and also read write-ups based on your interest. Connect with people of the same interests and goals
          </p>
          <button className="shareeButton" onClick={(e)=> handleAuth(e)}> Get Started</button>
          </div>
        </aside>
        </article>
      </section>
      <section className="footer">
        <div className="footerdetails">
        <div className="appName">
          <h1 className="appNameHead">
          <sup>vader</sup>
           CHATTER
          </h1>
        </div>
        <article className="appdetails">
          <aside className="explore">
            <p className="detailHead">
              Explore
            </p>
            <ul className="detailBody">
              <li className="detailtext">
                community
              </li>
              <li className="detailtext">
                Trending blogs
              </li>
              <li className="detailtext">
                Chatter for teams
              </li>
            </ul>
          </aside>
          <aside className="explore">
            <p className="detailHead">
              Support
            </p>
            <ul className="detailBody">
              <li className="detailtext">
                Support docs
              </li>
              <li className="detailtext">
                Join slack
              </li>
              <li className="detailtext">
                Contacts
              </li>
            </ul>
          </aside>
          <aside className="explore">
            <p className="detailHead">
              Official blog
            </p>
            <ul className="detailBody">
              <li className="detailtext">
                Official blog
              </li>
              <li className="detailtext">
                Engineering blog
              </li>
            </ul>
          </aside>
        </article>
        </div>
      </section>
    </main>
  );
}
