import React from 'react';
import { Carousel } from 'antd';
import './socials.css'
import { AiFillInstagram } from 'react-icons/ai';
import { FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import {motion} from 'framer-motion'
import { IoLink } from 'react-icons/io5';
import {SlSocialGithub} from "react-icons/sl"
import portfolioImg from '../../assets/images/portfolio.png'

const contentStyle: React.CSSProperties = {
  height: '350px',
  color: 'black',
  // lineHeight: '160px',
  // textAlign: 'center',
  backgroundColor: 'rgba(116, 92, 210, 0.3)',
  borderRadius: '8px',
};
const iconVariants={
  hidden:{
    opacity: 0,
  },
  visible:{
    opacity:0.8,
    transition:{ duration: 1,},
  }
}

const Socials: React.FC = () => (
    <main className='social-container'>
  <Carousel autoplay>
    <div>
      <section style={contentStyle} className='socials_panel_1'>
        <aside className='intro'>
          
          <div className="intro_image">
            <img src="" alt="" />
          </div>
          <div className="intro_desc">
           
             <p className="intro_name">
             Ayomide Shittu
              </p> 
            <p className="intro_job">
              FrontEnd Web Developer
            </p>
          </div>
         
         
         
        </aside>
        
        <aside className="summary">
          <p className="job_summary">
          Frontend web developer with two years of hands-on expertise in creating responsive and visually appealing user interfaces. Proficient in HTML, CSS, JavaScript, React.js, Vue.js. 
          
          </p>
        </aside>
        <aside className="social_menu">
        <motion.span 
        variants={iconVariants}
        className="socials">
          <span>
            <a href="https://www.instagram.com/_vader07/">
              <AiFillInstagram size={23} color="white" />
            </a>
          </span>
          <span>
            <a href="https://twitter.com/_vader07">
              <FaTwitter size={23} color="white" />
            </a>
          </span>
          <span>
            <a
              href="www.linkedin.com/in/
ayomide-shittu-a499081a9
"
            >
              <FaLinkedinIn size={23} color="white" />
            </a>
          </span>
          <span>
            <a href="https://github.com/vader-js">
              <FaGithub size={23} color="white" />
            </a>
          </span>
        </motion.span>

        </aside>
        
      </section>
    </div>
    <div>
    <section style={contentStyle} className='socials_panel_1'>
      <article className="portfolio">
        <aside className='portfolio_img'>
          <img src={portfolioImg} alt="" />
        </aside>
        <aside className="portfolio_link">
          <span className='github_link'>
          <a href='https://github.com/vader-js/vader-portfolio' target="_blank">
                      <SlSocialGithub size={23}/> 
                      </a> 
          </span>
          <span className="live_link">
          <a href='https://vader-portfolio.netlify.app/' target="_blank">
                      <IoLink size={23}/>
                      </a> 
          </span>
        </aside>
      </article>
      </section>
      
    </div>
    {/* <div>
      <h3>3</h3>
    </div>
    <div>
      <h3>4</h3>
    </div> */}
  </Carousel>
  </main>
);

export default Socials;