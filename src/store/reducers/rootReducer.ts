import { combineReducers } from 'redux';

import { profilesReducer as profiles } from './profilesReducer';

export const rootReducer = combineReducers({
  profiles,
});

export type RootState = ReturnType<typeof rootReducer>;
