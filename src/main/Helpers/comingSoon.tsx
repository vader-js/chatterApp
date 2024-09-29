
import './helpers.css'
import comingSoon from '../../assets/images/comingSoon.jpg'

type Props = {
    size?: number,
}
export default function ComingSoon({size}: Props){
  return (
    <main className='noData_main'>
       <img src={comingSoon} alt="no content" 
       width={size || 300} height={size || 300} /> 
       {/* <p className='nocontent_desc'>{description ? description : 'no content'}</p> */}
    </main>
  )
}
