import { combineReducers } from 'redux';
import userReducer from './authSlice'
import postsReducer from './postSlice'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

const persistConfig = {
    key: 'posts', // specify a unique key for the postReducer
    storage,
  };

const rootReducer = combineReducers({
  user: userReducer,
  posts: persistReducer(persistConfig, postsReducer),
});

export default rootReducer;