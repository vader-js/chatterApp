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
    },
}

export const userSlice: any = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      sessionStorage.setItem('user', JSON.stringify(action.payload));
      state.user = JSON.parse(sessionStorage.getItem('user') as string);
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
      };
    },
    setUserRef: (state, action) => {
      sessionStorage.setItem('userRef', JSON.stringify(action.payload));
      state.user = state.user || {};
      state.user.userRef = JSON.parse(sessionStorage.getItem('userRef') as string) || '';
    }
  },
})

export const {setUser,removeUser, setUserRef} = userSlice.actions
export default userSlice.reducer
