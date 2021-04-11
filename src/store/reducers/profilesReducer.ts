import { ActionType } from '../actionTypes';
import { Action } from '../actions';

import { GroupedProfiles, Profile } from '../../types';

type ProfilesState = {
  loading: boolean;
  error: string | null;
  groupedProfiles: GroupedProfiles;
  displayedProfiles: GroupedProfiles;
  chosenProfiles: Profile[];
};

const initialState = {
  loading: false,
  error: null,
  groupedProfiles: [],
  displayedProfiles: [],
  chosenProfiles: [],
};

export const profilesReducer = (
  state: ProfilesState = initialState,
  action: Action
): ProfilesState => {
  switch (action.type) {
    case ActionType.FETCH_PROFILES_START:
      return { ...state, loading: true };
    case ActionType.FETCH_PROFILES_SUCCESS:
      return {
        ...state,
        loading: false,
        groupedProfiles: action.payload,
        displayedProfiles: action.payload,
      };
    case ActionType.FETCH_PROFILES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ActionType.PROFILES_SEARCHING:
      return { ...state, displayedProfiles: action.payload };
    case ActionType.ADD_CHOSEN_PROFILE:
    case ActionType.REPLACE_CHOSEN_PROFILE:
    case ActionType.DELETE_CHOSEN_PROFILE:
      return { ...state, chosenProfiles: action.payload };
    default:
      return state;
  }
};
