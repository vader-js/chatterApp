import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./account.css";
import noimage from "../../assets/images/noimage.jpg";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import SkeletonUi from "../Helpers/skeleton";
import NoContent from "../Helpers/NoContent";
import { Modal, Tabs } from "antd";
import PictureEdit from "./pictureEdit";
import ProfileEdit from "./profileEdit";
import {
  uploadHeader,
  uploadProfileMedia,
  useDownloadHeaderImage,
  useDownloadProfileImage,
  useGetDoc,
  useGetUserDoc,
  useMediaHandler,
} from "../Helpers/hooks";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { ProfileCircle } from "iconsax-react";
import { setUserHeaderImage, setUserProfileImage, updateUser } from "../../app/authSlice";
import EachPostOthers from "../feed/eachPostOthers";

export default function Account() {
  const {
    user: {
      userRef,
      profileImage,
      fullName,
      headerImage,
      profession: user_profession,
      bio: user_bio,
    },
  } = useSelector((state: any) => state.reducer.user);
  // const { user } = useSelector((state: any) => state.user);

  const { getDocument } = useGetDoc();
  const { getUserDoc } = useGetUserDoc();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile_Image, setProfileImage] = useState(profileImage);
  const [_header, set_header] = useState(headerImage)
  const [name, setName] = useState("");
  const [header_set, set_header_set] = useState(false);

  const dispatch = useDispatch();

  // custom hook for uploading image
  const { image, handleMedia, removeMedia } = useMediaHandler();

  // function for changing header
  const header_upload = (e: any)=>{
    if(e){
   
      uploadHeader(e , userRef, set_header_set)
      setHeader(false)
      set_header_set(false)
   
    }
   
  }

  //upload profile image
  const { uploadProfileImage } = uploadProfileMedia("profile_image");

  // download profile image
  const { downloadProfileImage } = useDownloadProfileImage();

  //download header umage
  const {downloadHeaderImage} = useDownloadHeaderImage()

  //for profile details
  const [bio, setBio] = useState("");
  const [count, setCount] = useState(0);
  const [profession, setProfession] = useState("");
  const [header, setHeader] = useState(false)
  const [liked, setLiked] = useState(false);
  const chooseref = useRef<HTMLInputElement>(null);

  const handleText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (count >= 100) {
      setBio((prev) => prev + "");
    } else {
      setBio(e.target.value);
    }
  };
  const handleback = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 8) {
      setCount((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (bio && bio.trim().length === 0) {
      setCount(0);
    } else if (bio) {
      setCount(bio.trim().split(" ").length);
    }
  }, [bio]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", `${userRef}`), (doc: any) => {
      // console.log("Current data: ", doc.data());
      // console.log({ prof: doc.data().profession });
      if (doc.data().profession || doc.data().bio) {
        let { fullName: Name, email, title, uid, bio, profession } = doc.data();
        dispatch(
          updateUser({ fullName: Name, email, title, uid, bio, profession })
        );
      }
    });
    return () => unsub();
  }, [userRef]);

  useEffect(() => {
    const fetchData = async () => {
      const profile_image = await downloadProfileImage(userRef);
      if (profile_image) {
        setProfileImage(profile_image);
        dispatch(setUserProfileImage(profile_image));
      }
    };
    fetchData();
  }, [image, userRef]);

  useEffect(() => {
    const fetchData = async () => {
      const header_image = await downloadHeaderImage(userRef);
   
      if (header_image) {
        set_header(header_image)
        dispatch(setUserHeaderImage(header_image));
      }
    };
    fetchData();
  }, [userRef, header_set]);

  useEffect(() => {
    setName(fullName);
    setProfession(user_profession);
    setBio(user_bio);
  }, [userRef]);
  // const handleLike = async (post: any) => {
  //     try {
  //       const { postDoc, postRef } = await getDocument(post.id);
  //       const { userDoc, userCollectionRef } = await getUserDoc(userRef);

  //       if (postDoc.exists()) {
  //         let filteredDocs = postDoc
  //           .data()
  //           .likedBy.filter((doc) => doc === userRef);
  //         console.log({ filteredDocs });
  //         if (filteredDocs.length) {
  //           setLiked(false);
  //           await updateDoc(postRef, {
  //             likedBy: arrayRemove(userRef),
  //             likes: increment(-1),
  //           });
  //         } else {
  //           await updateDoc(postRef, {
  //             likedBy: arrayUnion(userRef),
  //             likes: increment(1),
  //           });
  //           setLiked(true);
  //         }
  //       }
  //       if (!userDoc.exists()) {
  //         console.log("doc does not exist");
  //         return;
  //       } else {
  //         const userPost = userDoc.data().post;
  //         const updateUserPost = userPost.map((posts) => {
  //           if (posts.id === post.postedById) {
  //             const isLiked = posts.likedBy.indexOf(`${userRef}`);
  //             console.log("isLiked", isLiked);
  //             if (isLiked !== -1) {
  //               const likes = posts.likes - 1;
  //               const likedBySlice = posts.likedBy.slice(isLiked, isLiked + 1);
  //               const likedBy = posts.likedBy.filter(
  //                 (like) => like !== likedBySlice[0]
  //               );
  //               console.log({ likedBy });
  //               return { ...posts, likes, likedBy };
  //             } else {
  //               const likes = posts.likes + 1;
  //               const likedBy = [...posts.likedBy, userRef];
  //               return { ...posts, likes, likedBy };
  //             }
  //           }
  //           return posts;
  //         });
  //         await updateDoc(userCollectionRef, { post: updateUserPost });
  //       }
  //       console.log({ userDoc });
  //     } catch (error) {
  //       console.error("Error handling like:", error);
  //     }
  //   };

  const handleLike = async (post: any) => {
    try {
      const { postDoc, postRef }: any = await getDocument(post.id);
      const { userDoc, userCollectionRef }: any = await getUserDoc(userRef);

      if (postDoc.exists()) {
        let filteredDocs = postDoc
          .data()
          .likedBy.filter((doc: any) => doc === userRef);
        console.log({ filteredDocs });
        if (filteredDocs.length) {
          setLiked(false);
          await updateDoc(postRef, {
            likedBy: arrayRemove(userRef),
            likes: increment(-1),
          });
        } else {
          await updateDoc(postRef, {
            likedBy: arrayUnion(userRef),
            likes: increment(1),
          });
          setLiked(true);
        }
      }
      if (!userDoc.exists()) {
        console.log("doc does not exist");
        return;
      } else {
        const userPost = userDoc.data().post;
        const updateUserPost = userPost.map((posts: any) => {
          if (posts.id === post.postedById) {
            const isLiked = posts.likedBy.indexOf(`${userRef}`);
            console.log("isLiked", isLiked);
            if (isLiked !== -1) {
              const likes = posts.likes - 1;
              const likedBySlice = posts.likedBy.slice(isLiked, isLiked + 1);
              const likedBy = posts.likedBy.filter(
                (like: any) => like !== likedBySlice[0]
              );
              console.log({ likedBy });
              return { ...posts, likes, likedBy };
            } else {
              const likes = posts.likes + 1;
              const likedBy = [...posts.likedBy, userRef];
              return { ...posts, likes, likedBy };
            }
          }
          return posts;
        });
        await updateDoc(userCollectionRef, { post: updateUserPost });
      }
      console.log({ userDoc });
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    const getPost = collection(db, "posts");
    const querry = query(getPost, where("userId", "==", `${userRef}`));
    const unSubscribe = onSnapshot(querry, (querySnapShot) => {
      const post = [] as any;
      querySnapShot.forEach((doc) => {
        const postData = doc.data();
        post.push(postData);
      });
      setPosts(post.sort((a: any, b: any) => b.createdAt - a.createdAt));
      setLoading(false);
      // console.log({posts})
    });
    return () => {
      unSubscribe();
    };
  }, [userRef, profileImage]);

  // modal
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const[name_message, setname_message] = useState('');
  
  // const [loading, setLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    if (image) {
      await uploadProfileImage({ image, userRef });
    }
    if(!name){
      setname_message('name cannot be blank');
      setConfirmLoading(false);
      return 
    }else{
      if (profession || bio || name) {
        await updateDoc(doc(db, "users", userRef), {
          fullName: name,
          bio,
          profession,
        });
      }
      setConfirmLoading(false);
    removeMedia();
    setOpen(false);
    }
    
  };

  const handleCancel = () => {
    removeMedia();
    //  handleMedia(null);

    setOpen(false);
  };
  const handlefileSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    e.preventDefault();
    if (chooseref.current) {
        chooseref.current.click();
    }
  }

  useEffect(() => {
    set_header(headerImage)
  },[headerImage]);

  return (
    <div className="account_container">
      <main className="account_main" >
        <section className="account_header"  >
          {
            _header ?
            <img src={_header} alt="header" className="account_header_img"/>:
            <img src={noimage} alt="header" className="account_header_img no_image"/>
          }
         
          <span className="header_menu" >
            <TfiLayoutMenuSeparated size={24} onClick={()=> setHeader(true)}/>
          </span>
          <span className={header ? "header_menu_container": 'header_false'}>
            <ul className="header_menu_lists">
              <li className="header_menu_list" onClick={(e: any)=> handlefileSelect(e)}>change header</li>
              <li className="header_menu_list">delete header</li>
            </ul>
          </span>
          <input
              type="file"
              name="projectheader"
              id="projectheader"
              accept="image/jpeg, image/png"
              ref={chooseref}
              onChange={(e) => header_upload(e.target.files?.[0])}
            />
        </section>
        <section className="account_profile_page" onClick={()=> header? setHeader(false): null}>
          <section className="account_profile">
            <div className="account_image">
              {profile_Image ? (
                <img src={profile_Image} alt="profileimage" />
              ) : (
                <ProfileCircle size="120" color="#555555" />
              )}

              <span className="account_name"></span>
            </div>
            <div className="account_edit" onClick={showModal}>
              Edit Profile
            </div>
          </section>
          <section className="account_details">
            <p className="account_name">{fullName ? fullName : "Anonymous"}</p>
            <p className="account_profession">
              {user_profession ? user_profession : "whats your profession ..."}
            </p>
            <p className="account_bio">
              {user_bio ? user_bio : "write a bio ...."}
            </p>
            <p className="account_post_title">Post</p>
          </section>
        </section>
        <section className="account_post">
          {loading ? (
            <>
              <div className="skeleton">
                <SkeletonUi numRows={4} />
              </div>

              <div className="skeleton">
                <SkeletonUi numRows={4} />
              </div>

              <div className="skeleton">
                <SkeletonUi numRows={4} />
              </div>
            </>
          ) : posts.length > 0 ? (
            posts.map((post: any) => {
              return (
                <EachPostOthers
                  post={post}
                  handleLike={handleLike}
                  fullName={fullName}
                  userRef={userRef}
                  profession={user_profession}
                />
              );
            })
          ) : (
            <NoContent size={300} />
          )}
        </section>
        <Modal
          title="Edit Profile"
          className="account_modal"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Submit Profile"
        >
          <main className="account_model_main">
            <Tabs
              defaultActiveKey="1"
              centered
              items={[
                {
                  label: "Profile picture edit",
                  key: "1",
                  children: (
                    <PictureEdit image={image} handleMedia={handleMedia} />
                  ),
                },
                {
                  label: "Profile detail edit",
                  key: "2",
                  children: (
                    <ProfileEdit
                      bio={bio}
                      profession={profession}
                      setProfession={setProfession}
                      handleText={handleText}
                      handleback={handleback}
                      count={count}
                      name={name}
                      setName={setName}
                      name_message={name_message}
                      setname_message={setname_message}
                      // setName={setName}
                    />
                  ),
                },
              ]}
            />
          </main>
        </Modal>
      </main>
    </div>
  );
}
