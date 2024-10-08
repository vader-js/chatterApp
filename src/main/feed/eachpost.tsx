import {

    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
 
    onSnapshot,
    query,

    updateDoc,
    where,
  } from "firebase/firestore";
  import {
    ProfileCircle,
    Book1,
    MessageNotif,
   
    Activity,
    Send,
  } from "iconsax-react";
  import {BsBookmarks, BsFillBookmarksFill} from 'react-icons/bs'
  import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
  import { db} from "../firebase/firebaseConfig";
  import { useEffect, useState, useRef } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useDownloadProfileImage, useDownloadimage, useGetDoc,  } from "../Helpers/hooks";
  import { Link } from "react-router-dom";
  import ReactTimeAgo from "react-time-ago";

import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { Popconfirm } from "antd";
import { updateInview } from "../../app/authSlice";
import './feed.css'



 function EachPost({ post, handleLike, userRef, fullName, profession}: any) {


    const { getDocument } = useGetDoc();
    // const {getUserDoc} = useGetUserDoc();
    const [isComment, setIsComment] = useState(false);
    const [comment, setComment] = useState("");
    const [image, setImage] = useState('')
    const [profileImage, setProfileImage] = useState('')
    const [menu_display, set_menu_display] = useState(false)


    const dispatch = useDispatch();

    const {user: {inview}} = useSelector((state: any)=> state.reducer.user)
   
    // console.log({location})

    const {downloadImage} = useDownloadimage()

          // download profile image
const {downloadProfileImage} = useDownloadProfileImage();
  


    const handleComment = (e: React.FormEvent<HTMLInputElement>) => {
      setComment(e.currentTarget.value);
      console.log({ comment });
    };
    const handleIsComment = async (post: any, comment: string) => {
      try {
        const {  postRef }: any = await getDocument(post.id);
        const current_time = new Date()
        if (comment && postRef) {
          await updateDoc(postRef, {
            comments: arrayUnion({fullName, comment, current_time}),
          });
          console.log("comment successfully updated");
          setComment("");
        } else {
          console.error("en error updating comment");
        }
      } catch (error) {
        console.error("Error handling like:", error);
      }
    };
    const handleBookmark = async() => {
      try{
        const {postDoc, postRef}: any = await getDocument(post.id)  
        const post_id = post.id;
        const current_time = new Date();
        const current_time_string = current_time.toString();
        if (postDoc.exists()){
          let view_present = postDoc.data().views.filter((_view: any )=> _view.userRef === userRef);
          if(view_present.length <= 0){
            await updateDoc(postRef, {
              views: arrayUnion({
                userRef, current_time: current_time_string,
              })
            })
          }
         
          let filteredDocs = postDoc
          .data()
          .bookmarks.filter((doc: any) => doc.userRef === userRef);  
        if (filteredDocs.length) {
          let bookmark_to_remove = filteredDocs[0]
          // console.log({bookmark_time})
          await updateDoc(postRef, {
            bookmarks: arrayRemove(bookmark_to_remove),
          });
        } else {
          await updateDoc(postRef, {
            bookmarks: arrayUnion({userRef, current_time, post_id}),
          });
        }
  
        }
      }catch (error) {
        console.log("addbookmark error: " + error)
      }
    }
    // const imageDownload = () => {
    //   let {downloadUrl} = downloadImage(post.id)
    //   setImage(downloadUrl)
    // }
    const feedRef = useRef(null);

    // useEffect(() => {
    //   const options = {
    //     root: null,
    //     rootMargin: '0px',
    //     threshold: 0.5,
    //   };
  
    //   const handleIntersection = (entries) => {
    //     entries.forEach((entry) => {
    //       if (entry.isIntersecting) {
    //           set_current_view(entry.target.id);
    //         // Here, you can update your state or Redux store with the ID of the feed in the middle
    //       }
    //     });
  
    //   };
    //   const observer = new IntersectionObserver(handleIntersection, options);
    
    //   if (feedRef.current) {
    //     observer.observe(feedRef.current);
    //   }
    
    //   return () => {
    //     if (feedRef.current) {   
    //       observer.unobserve(feedRef.current);
    //     }
    //   };
    // }, []);


    // useEffect(() => {    
    //         const targettedPost = document.getElementById(`${inview}`);
    //         if (targettedPost) {
    //           targettedPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //           targettedPost.classList.add('currentView')
    //           setTimeout(()=>{
    //             targettedPost.classList.remove('currentView')
    //           }, 3000)
    //         }

    // }, [inview]);



  useEffect(() => {
    const targettedPost = document.getElementById(`${inview}`)
    if (targettedPost) {
      targettedPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
      targettedPost.classList.add('currentView')
      setTimeout(()=>{
        targettedPost.classList.remove('currentView');
        dispatch(updateInview(''));
      }, 4000)
    }
    
}, [inview]);
   
 
  
    useEffect(() => {
    if(post.image){
      const fetchData = async () => {
        let downloadUrl = await downloadImage(post.postedById);
        // console.log({downloadUrl})
        if (downloadUrl) {
          setImage(downloadUrl);
        }
      };
    
      fetchData();
    }
    }, []);

    useEffect(() =>{
      const fetchData = async () => {
        const profile_image = await downloadProfileImage(post.userId);
        if (profile_image) {
          setProfileImage(profile_image)
          // dispatch(setUserProfileImage(profile_image))
        }}
        fetchData();
    },[post.userId])

    useEffect( () =>{
      const fetchData = async () =>{
        const { postRef}: any = await getDocument(post.id)
       if(post.userId === userRef){
        await updateDoc(postRef, {profession, name : fullName})
       }
      }
      fetchData();
    }, [post, profession, fullName, userRef])

    const confirm = async (id: string)=>{
      const getPost = collection(db, "posts");
      const querry = query(getPost, where("postedById", "==", `${id}`));
     onSnapshot(querry, (querySnapShot) => {
        querySnapShot.forEach( async (docs) => {
          await deleteDoc(doc(db, "posts", docs.id));
        });
      });
    }
    const confirm_delete = async (id: string)=>{
      return confirm(id).then(() => {});
    }


    return (
      <main className='eachpost_main' key={post.id} ref={feedRef} id={`${post.id}`}>
        <section className="feed_head">
          <div className="image_container">
           {
            profileImage ? <img src={profileImage} alt="profile" className="post_profile" />:  <ProfileCircle size="75" />
           } 
           
          </div>
          <div className="image_profile">
            <div className="profile_name">{post.name}</div>
            <div className="profile_desc">
             <p>{post.profession ? post.profession : 'redacted'}</p> 
              <span className="profile_time">
                {post.createdAt && (
                  <ReactTimeAgo
                    date={post?.createdAt.toDate()}
                    locale="en-US"
                    timeStyle="round-minute"
                    className="timestamp"
                  />
                )}
              </span>
            </div>
          </div>
          <span className="post_menu" onClick={()=> set_menu_display(!menu_display)}>
          <TfiLayoutMenuSeparated />
          </span>
          <span className={menu_display? "post_menu_display": "post_menu_display_none"}>
          {
           post.userId === userRef ? <ul className="self_menu_lists">
            <li className="self_menu_list">Share post</li>
            <li className="self_menu_list">
            <Popconfirm
        placement="bottom"
        title="Delete Post?"
        description='Are you sure you want to Delete this post?'
        onConfirm={ async () => {
          await confirm_delete(post.postedById);}}
        okText="Yes"
        cancelText="No"
      >
              Delete post
              </Popconfirm>
              </li>
           </ul> : <ul className="non_self_menu_lists">
            <li className="non_self_menu_list"> Share post</li>
           </ul>
          }
          </span>
        </section>
        <section className="feed_title" onClick={()=> set_menu_display(false)}>
          <h4>{post.title}</h4>
          <div>
            <span>
              <Book1 size="18" />
            </span>
            {Math.round(post.body.split(" ").length / 200) < 1
              ? 1
              : Math.round(post.body.split(" ").length / 200)}{" "}
            mins read
          </div>
        </section>
        <section className="profile_body" onClick={()=> set_menu_display(false)}>
          {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo eos maiores magni doloribus, 
              optio impedit fugiat! Nisi fugiat beatae deleniti consequatur aliquam voluptatem est quibusdam
               illum sint dignissimos! Possimus, neque. */}
          {post.body.split(" ").length > 35 ? (
            <p>
              {post.body.split(" ").slice(0, 35).join(" ")}{" "}
              <Link to={`/home/feed/${post.id}`} state={{ post, profileImage, fullName, image}} className="see_more">
                ...see more
              </Link>
            </p>
          ) : (
            <div>
              <p className="">{post.body}</p>
            </div>
          )}
          <div className="post_image_container">
          {image && <img src={image} className="post_image"/>}
          </div>
        </section>
        <section className="profile_info">
          <div className="profile_comment">
            <span className="info_icon" onClick={() => setIsComment(!isComment)}>
              <MessageNotif size="18" />
            </span>
            {post.comments ? post?.comments?.length : 0}
          </div>
          <div className="profile_likes">
            <span
              className="info_icon like"
              onClick={() => handleLike(post)}
            >
              {
                post.likedBy.map((ref: any )=> ref.userRef === userRef).length > 0 ? <AiFillHeart color='red' size={18}/>: <AiOutlineHeart size={18}/> 
              }            
            </span>
            {post.likes}
          </div>
          <div className="profile_bookmark">
            <span className="info_icon bookmark"
            onClick={handleBookmark}>
              {
                post.bookmarks.filter((book: any)=> book.userRef === userRef).length > 0 ? <BsFillBookmarksFill size={18} color='#543EE0'/> :  <BsBookmarks size={18} />
              }
            </span>
          {post.bookmarks.length}
          </div>
          <div className="profile_views">
            <span className="info_icon">
              <Activity size="18" />
            </span>
            {post?.views.length} views
          </div>
        </section>
        {isComment && (
          <section className="comment_sec">
            <ul className="comment_lists">
              {post.comments
                ? post.comments.map((com: any) => {
                    return (
                      <li className="com_list" key={com}>
                        <span className="com_image">
                          {" "}
                          <ProfileCircle size="22" />
                        </span>
                        <div className="com_info">
                          <span className="com_name">{com.fullName}</span>
                          <span className="com_main">{com.comment}</span>
                        </div>
                        <span className="com_like">
                          {" "}
                          <AiOutlineHeart size={18}/>
                        </span>
                      </li>
                    );
                  })
                : null}
            </ul>
            <div className="comment">
              <input
                type="text"
                className="com_input"
                placeholder="comment..."
                value={comment}
                onChange={handleComment}
              />
              <button
                className="send"
                onClick={() => handleIsComment(post, comment)}
              >
                <Send size="18" color="white" />
              </button>
            </div>
          </section>
        )}
  
        <hr className="post_line" />
      </main>
    );
  }


  export default EachPost