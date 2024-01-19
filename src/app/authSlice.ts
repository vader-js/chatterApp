import { createSlice } from '@reduxjs/toolkit'

type User = {
  user: {
    fullName: string,
    email: string,
    titles?: string
    displayPicture?: string,
    token?: string,
    uid: string,
    userRef?: string,
    profileImage?: string,
    headerImage?: string | null,
    bio?: string,
    profession?: string,
    post_no?: number,
    inview?: string,
    p_inview?: string,
  } ,
}

const initialState: User | null= {
    user: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : 
    {
      fullName: '',
      email: '',
      titles: '',
      displayPicture: '',
      token: '',
      uid: '',
      userRef: "",
      profileImage: '',
      headerImage: '',
      post_no: 15,
      inview: '',
      p_inview: '',
    },
}

export const userSlice: any = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      sessionStorage.setItem('user', JSON.stringify(action.payload));
      state.user = {...JSON.parse(sessionStorage.getItem('user') as string), post_no: 15, inview: '', p_inview: ''};
    },
    removeUser: (state) => {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userRef');
      state.user =  {
        fullName: '',
        email: '',
        titles: '',
        displayPicture: '',
        token: '',
        uid: '',
        userRef: '',
        profession: '',
        bio: '',
        profileImage: '',
      };
    },
    setUserRef: (state, action) => {
      sessionStorage.setItem('userRef', JSON.stringify(action.payload));
      state.user = state.user || {};
      state.user.userRef = JSON.parse(sessionStorage.getItem('userRef') as string) || '';
    },
    setUserProfileImage: (state, action) =>{
      sessionStorage.setItem('user', JSON.stringify({...state, profileImage: action.payload}));
      state.user.profileImage = action.payload;
    },
    setUserHeaderImage: (state, action) =>{
      sessionStorage.setItem('user', JSON.stringify({...state, headerImage: action.payload}));
      state.user.headerImage = JSON.parse(sessionStorage.getItem('user') as string).headerImage;
    },
    updateUser: (state, action)=>{
      const update = action.payload;
      const user_state = state.user
      sessionStorage.setItem('user', JSON.stringify({...user_state, ...update}));
      state.user = JSON.parse(sessionStorage.getItem('user') as string);
      console.log('state', state.user)
      
    },
    
    updatePostNo: (state,action)=>{
      // const update = state.user.post_no + action.payload;
      // const user_state = state.user
      // sessionStorage.setItem('user', JSON.stringify({...user_state, post_no: update}))
      // const postNo = JSON.parse(sessionStorage.getItem('post_no') as string).post_no
      // console.log('postNo', postNo)
      // state.user.post_no = postNo;
      state.user.post_no = state.user.post_no + action.payload
      },
      updateInview: (state,action)=>{
        state.user.inview = action.payload
      },
      PrevInview: (state,action)=>{
        state.user.p_inview = action.payload
      },
  },
})

export const {setUser,removeUser, setUserRef, setUserProfileImage, updateUser, setUserHeaderImage, updatePostNo, updateInview, PrevInview} = userSlice.actions
export default userSlice.reducer
