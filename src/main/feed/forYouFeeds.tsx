// import React from 'react'
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, increment, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { ProfileCircle, Book1, MessageNotif, Lovely, Activity, Send } from "iconsax-react"
import { db } from "../firebase/firebaseConfig"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


export default function ForYouFeeds() {
    type Post = {
        body: string,
        bookmark: boolean,
        bookmarks: [],
        id: string,
        likes: number,
        like: boolean,
        comment: [],
        name: string,
        title: string,
        createdAt: string,
        views: number
    }
    const [posts, getPosts] = useState<Post[]>([])
    const [liked, setLiked] = useState(false)
    const {user: {userRef}} = useSelector((state: any) => state.user)
    console.log(userRef)
    useEffect(() => {
        const getPost = collection(db, 'posts');
        const unSubscribe = onSnapshot(getPost, (querySnapShot)=>{
            const post = [] as any;
            querySnapShot.forEach((doc)=>{
                const postData = doc.data();
                post.push(postData); 
            })
            getPosts([...post])
        }) 
        return ()=>{
            unSubscribe();
        }
    },[])

    const handleLike = async (post : any) => {
        const postCollectionRef = collection(db, 'posts');
        const q = query(postCollectionRef, where('id', '==', post.id));
        const querySnapShot = await getDocs(q)
        let documentId = ''
        if (!querySnapShot.empty){
            querySnapShot.forEach((docs)=>{
                documentId = docs.id
            })
        }
        const postRef = doc(db, 'posts',documentId);
        const postDoc = await getDoc(postRef);
       


        if (postDoc.exists()) {
            let filteredDocs = postDoc.data().likedBy.filter((doc: any) => doc === userRef);
            console.log({ filteredDocs})
            if(filteredDocs.length){
                setLiked(false);
                await updateDoc(postRef, {
                    likedBy: arrayRemove(userRef)
                })
                if (postDoc.data().like <= 0){
                    return
                }else{
                    await updateDoc(postRef, {
                        likes: increment(-1)
                    })
                }
            }else{
                await updateDoc(postRef,{
                    likedBy: arrayUnion(userRef)
                })
                setLiked(true);
                     //  update the 'likes' count
                     await updateDoc(postRef, {
                        likes: increment(1)
                    });
            }
           

     
            
            
}
    }
  
        
    // const handleIsComment = async ()=>{
    //     const postRef = doc(db, 'posts');
    //     try {
    //         // Get the document and its ID
    //         const postDoc = await getDoc(postRef);
        
    //         if (postDoc.exists()) {
    //           // Access the document data using doc.data()
    //           const postData = postDoc.data();
        
    //           // Access the document ID using doc.id
    //           const documentId = postDoc.id;
        
    //           // Toggle the 'like' field to its opposite value
    //           const currentLikeValue = postData.isComment;
    //           const updatedLikeValue = !currentLikeValue;
    //           console.log(currentLikeValue, updatedLikeValue);
        
    //           // Update the 'like' field with the new value
    //           await updateDoc(postRef, {
    //             isComment: updatedLikeValue,
    //           });
        
    //           console.log('Like updated successfully');
    //         } else {
    //           console.log('Document does not exist');
    //         }
    //       } catch (error) {
    //         console.error('Error:', error);
    //       }
    //     }
       
        useEffect(()=>{
            console.log({posts})
        },[posts])
  return (
    <main>
        {posts ? 
        posts.map((post: any)=>{
            return (
//                 <main className="post" key={post.id}>

//     <section className="feed_head">
//         <div className="image_container">
//             {/* <img src="" alt="" /> */}
//             <ProfileCircle size="75" />
//         </div>
//         <div className="image_profile">
//             <div className="profile_name">
//                 {post.name}
//             </div>
//             <div className="profile_desc">
//                 product designer <span className="profile_time">
//                     May 25th 2023
//                 </span>
//             </div>
//         </div>
//     </section>   
//     <section className="feed_title">
//         <h2>{post.title}</h2>
//         <div><span><Book1 size="18"/></span>10 mins read</div>
//     </section> 
//     <section className="profile_body">
//         Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo eos maiores magni doloribus, 
//         optio impedit fugiat! Nisi fugiat beatae deleniti consequatur aliquam voluptatem est quibusdam
//          illum sint dignissimos! Possimus, neque.

//     </section>
//     <section className="profile_info">
//         <div className="profile_comment">
//             <span className="info_icon"
//             >
//             <MessageNotif size="18"/>
//             </span>
//             {post.comment.length}
//         </div>
//         <div className="profile_likes">
//         <span className="info_icon like" onClick={()=> handleLike(post)}
//         style={post.likedBy.filter((p: string)=> p === userRef).length > 0? {color: 'red'} : undefined}>
//         <Lovely size="18" />
//         </span>
//             {post.likes}
//         </div>
//         <div className="profile_views">
//         <span className="info_icon">
//         <Activity size="18" />
//         </span>
//         {post.views} views
//         </div>
//     </section> 

//     <section className="comment_sec">
//     <ul className="comment_lists">
//         <li className="com_list">
//             <span className="com_image"> <ProfileCircle size="22" /></span>
//             <div className="com_info">
//                 <span className="com_name">
//                     {post.name}
//                 </span>
//                 <span className="com_main">
//                     hello first post!
//                 </span>
//             </div>
//             <span className="com_like"> <Lovely size="20" /></span>
//         </li>
//     </ul>
//     <div className="comment">

//     <input type="text" className="com_input" placeholder="comment..."/>
//     <span className="send">
//         <Send size="25" color="#FF8A65"/>
//     </span>
//     </div>
// </section> 
    
//     <hr className="post_line" />
//     </main>
                <EachPost key={post.id} post={post} handleLike={handleLike} userRef={userRef}/>
            )})
    : null
        }
    </main>
  )
}

function EachPost({post, handleLike, userRef}: any){
    const [isComment, setIsComment] = useState(false)
    return (
        <main className="post" key={post.id}>

        <section className="feed_head">
            <div className="image_container">
                {/* <img src="" alt="" /> */}
                <ProfileCircle size="75" />
            </div>
            <div className="image_profile">
                <div className="profile_name">
                    {post.name}
                </div>
                <div className="profile_desc">
                    product designer <span className="profile_time">
                        May 25th 2023
                    </span>
                </div>
            </div>
        </section>   
        <section className="feed_title">
            <h2>{post.title}</h2>
            <div><span><Book1 size="18"/></span>10 mins read</div>
        </section> 
        <section className="profile_body">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo eos maiores magni doloribus, 
            optio impedit fugiat! Nisi fugiat beatae deleniti consequatur aliquam voluptatem est quibusdam
             illum sint dignissimos! Possimus, neque.
    
        </section>
        <section className="profile_info">
            <div className="profile_comment">
                <span className="info_icon"
                onClick={()=> setIsComment(true)}>
                <MessageNotif size="18"/>
                </span>
                {post.comment.length}
            </div>
            <div className="profile_likes">
            <span className="info_icon like" onClick={()=> handleLike(post)}
            style={post.likedBy.filter((p: string)=> p === userRef).length > 0? {color: 'red'} : undefined}>
            <Lovely size="18" />
            </span>
                {post.likes}
            </div>
            <div className="profile_views">
            <span className="info_icon">
            <Activity size="18" />
            </span>
            {post.views} views
            </div>
        </section> 
    {
        isComment && 
        <section className="comment_sec">
        <ul className="comment_lists">
            <li className="com_list">
                <span className="com_image"> <ProfileCircle size="22" /></span>
                <div className="com_info">
                    <span className="com_name">
                        {post.name}
                    </span>
                    <span className="com_main">
                        hello first post!
                    </span>
                </div>
                <span className="com_like"> <Lovely size="20" /></span>
            </li>
        </ul>
        <div className="comment">
    
        <input type="text" className="com_input" placeholder="comment..."/>
        <span className="send">
            <Send size="25" color="#FF8A65"/>
        </span>
        </div>
    </section> 
    }
      
        
        <hr className="post_line" />
        </main>
    )
}
