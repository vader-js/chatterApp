import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { persistStore } from 'redux-persist';

const store = configureStore({
  reducer: {
    reducer: rootReducer,
  },
})

const persistor = persistStore(store);
export {store, persistor}
