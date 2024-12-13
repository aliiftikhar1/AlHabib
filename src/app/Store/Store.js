// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // You can use sessionStorage or custom storage as needed
import userReducer from './Slice'; 
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
  key: 'root', // Unique key for your persisted state
  storage, // Default is localStorage
  whitelist: ['user'], // Optional: List specific reducers to persist (if you want to limit the persisted state)
};

const reducer = persistReducer(persistConfig, userReducer);

const Store = configureStore({
  reducer,
  // Add the serializableCheck option here to disable serializability checks for persisted values
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action types or paths that can have non-serializable values (like functions)
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const Persistori = persistStore(Store);

export { Store, Persistori };
