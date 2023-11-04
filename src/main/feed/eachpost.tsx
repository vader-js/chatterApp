import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    onSnapshot,
    query,
    updateDoc,
    where,
  } from "firebase/firestore";
  import {
    ProfileCircle,
    Book1,
    MessageNotif,
    Lovely,
    Activity,
    Send,
  } from "iconsax-react";
  import {BsBookmarks, BsFillBookmarksFill} from 'react-icons/bs'
  import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
  import { db, storage } from "../firebase/firebaseConfig";
  import { useEffect, useState } from "react";
  import { useSelector } from "react-redux";
  import { useDownloadimage, useGetDoc, useGetUserDoc } from "../Helpers/hooks";
  import { Link } from "react-router-dom";
  import ReactTimeAgo from "react-time-ago";
import { ref } from "firebase/storage";


 function EachPost({ post, handleLike, userRef }: any) {
    const { getDocument } = useGetDoc();
    // const {getUserDoc} = useGetUserDoc();
    const [isComment, setIsComment] = useState(false);
    const [comment, setComment] = useState("");
    const [image, setImage] = useState('')
    const {downloadImage} = useDownloadimage()
  
    
    const handleComment = (e: React.FormEvent<HTMLInputElement>) => {
      setComment(e.currentTarget.value);
      console.log({ comment });
    };
    const handleIsComment = async (post: any, comment: string) => {
      try {
        const { postDoc, postRef } = await getDocument(post.id);
        // const {userDoc, userCollectionRef} = await getUserDoc(userRef)
        const userRefs = doc(db, "users", userRef);
        if (comment && postRef) {
          await updateDoc(postRef, {
            comments: arrayUnion(comment),
          });
          await updateDoc(userRefs, {
            comments: arrayUnion(comment),
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
        const {postDoc, postRef} = await getDocument(post.id)
        if (postDoc.exists()){
          let filteredDocs = postDoc
          .data()
          .bookmarks.filter((doc) => doc === userRef);
        console.log({ filteredDocs });
        if (filteredDocs.length) {
          await updateDoc(postRef, {
            bookmarks: arrayRemove(userRef),
          });
        } else {
          await updateDoc(postRef, {
            bookmarks: arrayUnion(userRef),
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
    useEffect(() => {
    // let imageRef = ref(storage, `postImage/${post.postedById}`)
    if(post.image){
      const fetchData = async () => {
        let downloadUrl = await downloadImage(post.postedById);
        console.log({downloadUrl})
        if (downloadUrl) {
          setImage(downloadUrl);
        }
      };
    
      fetchData();
    }
    }, []);
    return (
      <main className="post" key={post.id}>
        <section className="feed_head">
          <div className="image_container">
            {/* <img src="" alt="" /> */}
            <ProfileCircle size="75" />
          </div>
          <div className="image_profile">
            <div className="profile_name">{post.name}</div>
            <div className="profile_desc">
             <p>product designer{" "}</p> 
              <span className="profile_time">
                {post.createdAt && (
                  <ReactTimeAgo
                    date={post.createdAt.toDate()}
                    locale="en-US"
                    timeStyle="round-minute"
                    className="timestamp"
                  />
                )}
              </span>
            </div>
          </div>
        </section>
        <section className="feed_title">
          <h2>{post.title}</h2>
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
        <section className="profile_body">
          {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo eos maiores magni doloribus, 
              optio impedit fugiat! Nisi fugiat beatae deleniti consequatur aliquam voluptatem est quibusdam
               illum sint dignissimos! Possimus, neque. */}
          {post.body.split(" ").length > 35 ? (
            <p>
              {post.body.split(" ").slice(0, 35).join(" ")}{" "}
              <Link to="/home/feed" state={{ post }} className="see_more">
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
            <span className="info_icon" onClick={() => setIsComment(true)}>
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
                post.likedBy.indexOf(userRef) === -1 ? <AiOutlineHeart size={18}/> : <AiFillHeart color='red' size={18}/>
              }            
            </span>
            {post.likes}
          </div>
          <div className="profile_bookmark">
            <span className="info_icon bookmark"
            onClick={handleBookmark}>
              {
                post.bookmarks.indexOf(userRef) === -1 ? <BsBookmarks size={18} /> : <BsFillBookmarksFill size={18} color='#543EE0'/>
              }
            </span>
          {post.bookmarks.length}
          </div>
          <div className="profile_views">
            <span className="info_icon">
              <Activity size="18" />
            </span>
            {post.views} views
          </div>
        </section>
        {isComment && (
          <section className="comment_sec">
            <ul className="comment_lists">
              {post.comments
                ? post.comments.map((com) => {
                    return (
                      <li className="com_list" key={com}>
                        <span className="com_image">
                          {" "}
                          <ProfileCircle size="22" />
                        </span>
                        <div className="com_info">
                          <span className="com_name">{post.name}</span>
                          <span className="com_main">{com}</span>
                        </div>
                        <span className="com_like">
                          {" "}
                          <Lovely size="20" />
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