import { useEffect, useState } from 'react'
import { IoReturnDownBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom'
import SkeletonUi from '../Helpers/skeleton';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useSelector } from 'react-redux';
import NoContent from '../Helpers/NoContent';
import { ProfileCircle } from 'iconsax-react';
import './draft.css'
import { MdDelete } from 'react-icons/md';

interface draft {
    body: string;
    createdAt: string;
    title: string;
    userRef: string;
    draftId: string;
}

export default function Draft() {
    const navigate = useNavigate();
    const [loading, set_loading] = useState(false)
    const [drafts, set_drafts]= useState([])
    const {
        user: { userRef, profileImage, fullName},
      } = useSelector((state: any) => state.reducer.user);

    function formatDate(inputDate: any) {
        // Parse the input date string
        const dateObject = new Date(inputDate);
      
        // Ensure the date is valid
        if (isNaN(dateObject.getTime())) {
          return 'Invalid Date';
        }
      
        // Get day, month, and year components
        const day = dateObject.getDate().toString().padStart(2, '0');
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObject.getFullYear();
      
        // Return the formatted date string
        return `${day}/${month}/${year}`;
      }

    useEffect(() => {
        set_loading(true);
        const getDrafts = collection(db, "drafts");
        const querry = query(getDrafts, where("userRef", "==", `${userRef}`));
        const unSubscribe = onSnapshot(querry, (querySnapShot) => {
          const draft = []  as any;
          querySnapShot.forEach((doc) => {
            const postData = doc.data();
            draft.push(postData);  
          });
         
          set_drafts(draft);
          set_loading(false);
        });
        return () => {
          unSubscribe();
        };
      }, [userRef]);

      const Delete_draft = async (id: string)=>{
        const getDraft = collection(db, "drafts");
        const querry = query(getDraft, where("draftId", "==", `${id}`));
       onSnapshot(querry, (querySnapShot) => {
          querySnapShot.forEach( async (docs: any) => {
            await deleteDoc(doc(db, "drafts", docs.id));
          });
        });
      }

  return (
    <main>
 <section className="draft_top">
            <div className="return" onClick={()=> navigate(-1)}>
            <IoReturnDownBack size={18} color='#543EE0'/>
            </div>
            <div className="title">
            <p className="bookmark_title">Drafts</p>
            </div>
            <div className="clear">
             
            </div>
        </section>
        <section className='draft_main'>
        {loading? 
        <>
        <div className="skeleton">
        <SkeletonUi numRows={1}/>
        </div>
    
        <div className="skeleton">
        <SkeletonUi numRows={1}/>
        </div>
        
        <div className="skeleton">
        <SkeletonUi numRows={1}/>
        </div>
        </>:
       
        <ul className="draft_lists" > 
        { drafts.length ? 
        drafts.map((draft: draft)=> {
            return (       
                    <li className="draft_list" key={draft.title}>
                   
                        <section className="draft_data">
                        <Link to={'/home/newfeed'} state={draft} className='draft_link'>
                            <main className='draft_data_extended'>
                            <div className="draft_image">
                            {profileImage? <img src={profileImage} alt="" />: <ProfileCircle size="40"/>}    
                            </div>
                            <div className="draft_details">
                                <aside className='draft_details_top'>
                                    <p className="draft_name">
                                        {fullName}
                                    </p>
                                    <p className="draft_date">
                                    {formatDate(draft?.createdAt)}
                                        {/* {draft?.createdAt} */}
                                    </p>
                                </aside>
                                <aside className="draft_title">
                                    {draft?.title}
                                </aside>
                                <aside className='draft_body'>
                                    { draft?.body}
                                </aside>
                               
                            </div>
                            </main>
                    </Link>  
                    <aside className="draft_delete" onClick={()=> Delete_draft(draft.draftId)}>
                                <MdDelete size='18' />
                    </aside>  
                        </section>
                   
                     </li>
                   
                   )
                })   
                :
        <NoContent size={300} description='Draft is currently empty'/>
}
</ul>
}
        </section>
    
    </main>
  )
}
