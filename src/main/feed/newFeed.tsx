// import React from 'react'
import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./feed.css";
import { Back } from "iconsax-react";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { setUserRef } from "../../app/authSlice";
import { useUploadImage } from "../Helpers/hooks";
import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

export default function NewFeed({ setNewPost }: any) {
  type User = {
    user: {
      fullName: string,
      email: string,
      titles?: string
      displayPicture?: string,
      token?: string,
      uid: string,
      userRef: string,
    }
  }
  type userState = {
    reducer: {
      user: User
    }  
  }
  const apiKey = import.meta.env.VITE_TINY_KEY;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state} = useLocation();
  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState("");
  const [docId, setDocId] = useState("")
  const [isEditorLoaded, setIsEditorLoaded] = useState(false)
  const [image, setimage] = useState("")
  const { user } = useSelector((state: userState) => state.reducer.user);

  const [button_load, setbutton_load] = useState(false)
  const {uploadImageToStorage} = useUploadImage()

  function generateUniqueId() {
    // Generate a timestamp
    const timestamp = new Date().getTime();
  
    // Generate a random number (between 0 and 1, inclusive)
    const random = Math.random();
  
    // Convert the random number to a string and remove the decimal point
    const randomString = random.toString().slice(2);
  
    // Combine the timestamp and random number to create a unique ID
    const uniqueId = `${timestamp}${randomString}`;
  
    return uniqueId;
  };

  const back = async ()=>{
    const editorContent = editorRef.current.getContent()
    if(!state){
      if(title || editorContent){
       await drafts()
      }
    }
    navigate(-1);
  }

  useEffect(()=>{
    if (state){
      if(state.title){
        setTitle(state.title)
      }
        if(state.body && editorRef.current){
      const new_content = `<p>${state.body}</p>`
      editorRef.current.setContent(new_content)
    }
    }
  
  },[state, editorRef.current]);

  const drafts = async ()=>{
    const editorContent = editorRef.current.getContent().replace(/<\/?[^>]+(>|$)/g, "");
    const time = new Date();
    await addDoc(collection(db, 'drafts'), {
      title,
      createdAt: time.toDateString(),
      body: editorContent,
      userRef: user.userRef,
      draftId: generateUniqueId()
    })
  }
  const Delete_draft = async (id)=>{
    const getDraft = collection(db, "drafts");
    const querry = query(getDraft, where("draftId", "==", `${id}`));
    const unSubscribe =  onSnapshot(querry, (querySnapShot) => {
      querySnapShot.forEach( async (docs: any) => {
        await deleteDoc(doc(db, "drafts", docs.id));
      });
    });
  }
 
  const log = async () => {
    setbutton_load(true);
    if (editorRef.current) {
// Check if there is content in the editor
const editorContent = editorRef.current.getContent().replace(/<\/?[^>]+(>|$)/g, "");
    
if (editorContent.length > 0) {
      let Img = editorRef.current.dom.select('img')
      const UniqueId = generateUniqueId();
          try {
            if(image){
              const {upload} = await uploadImageToStorage({image, UniqueId})
            }
            const time = new Date();
            await addDoc(collection(db, 'posts'),{
              title,
              body: editorContent,
              createdAt: time,
              bookmark: false,
              bookmarks:[],
              postedById: UniqueId,
              id: generateUniqueId(),
              likedBy: [],
              likes: 0,
              comment:[],
              views: [],
              image: Img.length > 0 ? true: false ,
              name: user.fullName,
              userId: user.userRef,
            }).then(async () => {
              editorRef.current.setContent('');
              setTitle('');
           await Delete_draft(state.draftId);

            })
            
          }catch (error) {
            console.log("error creating post db")
          }
      
      setbutton_load(false);
     setNewPost(false);
    }
  }
    setbutton_load(false);
  };
  const editorInit = (ext, editor) => {
    // setIsEditorLoaded(true);
    editorRef.current = editor;
    setIsEditorLoaded(true);
  }
  useEffect(()=>{
    const usersCollectionRef = collection(db, "users");
          const querry = query(
            usersCollectionRef,
            where("email", "==", `${user.email}`)
          );
          getDocs(querry)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log("Document ID:", doc.id);
                setDocId(doc.id);
                dispatch(setUserRef(doc.id));
              });
            })
            .catch((error) => {
              console.error("Error getting documents:", error);
            });
  },[])
  useEffect(()=>{
    console.log({docId});
  },[docId])
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  return (
    <main className="new_feed_main">
      <h3 className="back" onClick={back}>
        {" "}
        <span>
          <Back size="25" />
        </span>{" "}
        Back
      </h3>

      <div className="title_input">
      { isEditorLoaded && <input
          type="text"
          name=""
          id=""
          value={title}
          onChange={handleChange}
          placeholder="Title"
        />}
      </div>
      <Editor
        apiKey={apiKey}
        onInit={editorInit}
        initialValue=""
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | link image | code |" +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: function (cb, value, meta) {
              var input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
          
              /*
                Note: In modern browsers input[type="file"] is functional without
                even adding it to the DOM, but that might not be the case in some older
                or quirky browsers like IE, so you might want to add it to the DOM
                just in case, and visually hide it. And do not forget do remove it
                once you do not need it anymore.
              */
          
              input.onchange = function () {
                var file = input.files[0];
                setimage(file);
                var reader = new FileReader();
                reader.onload = function () {
                 var dataURL = reader.result;
      
                // Pass the Data URL to TinyMCE
                cb(dataURL);

      // Optionally, you can save the file data for later use
    };
    reader.readAsDataURL(file);
              };
          
              input.click();
              setimage('')
            },
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      {/* <button onClick={log}>Log editor content</button> */}
      <div className="post_button">
       {isEditorLoaded && <Button onClick={log}
       loading={button_load}
       className="new_post_button">post</Button>}
      </div>
    </main>
  );
}
