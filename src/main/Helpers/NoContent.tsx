
import './helpers.css'
import noContent from '../../assets/images/noContent.jpg'

type Props = {
    size?: number,
    description?: string
}
export default function NoContent({size, description}: Props){
  return (
    <main className='noData_main'>
       <img src={noContent} alt="no content" 
       width={size || 300} height={size || 300} /> 
       <p className='nocontent_desc'>{description ? description : 'no content'}</p>
    </main>
  )
}
