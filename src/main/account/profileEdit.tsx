import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

type ProfileEditProps = {
  bio: string;
  count: number;
  handleText: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleback: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  profession: string;
  setProfession: React.Dispatch<React.SetStateAction<string>>;
  name: string;
 setName: React.Dispatch<React.SetStateAction<string>>;
name_message: string;
setname_message:React.Dispatch<React.SetStateAction<string>>;
};

const ProfileEdit: React.FC<ProfileEditProps> = ({bio, count, handleText, handleback, profession, setProfession, name, setName, name_message, setname_message})=> {
const handleName = (e)=>{
  setName(e.target.value);
if(e.target.value.length > 0){
  setname_message('')
}
}

  return (
    <main className='profileEdit_main'>
    <div className='container'>
      
      <div className='body'>
      <aside className="edit_name">
        {name_message && <p className='name_message'> {name_message}</p>}
        <input type="text" name="name" id="name" value={name} onChange={(e)=> handleName(e)}/>
      </aside>
    
      <aside className="profession">
        <input type="text" name="profession" id="profession" placeholder='what is your profession' value={profession} onChange={(e)=> setProfession(e.target.value)}/>
      </aside>
        <section className='body_bio'>
          <textarea
            name="bio"
            id='textarea'
            placeholder="write your bio..."
            value={bio}
            onChange={(e) => handleText(e)}
            onKeyDown={(e) => handleback(e)}
          ></textarea>
          <p className='count'> word count : {count} / 100 </p>
        </section>
      </div>
    </div>
    
    </main>
  )
}

export default ProfileEdit;