
import './helpers.css'

type Props = {
    size?: number,
    description?: string
}
export default function NoContent({size, description}: Props){
  return (
    <main className='noData_main'>
       <img src='/src/assets/images/noContent.jpg' alt="no content" 
       width={size || 300} height={size || 300} /> 
       <p>{description ? description : 'no content'}</p>
    </main>
  )
}
