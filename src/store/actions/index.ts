import { ActionType } from '../actionTypes';

import { GroupedProfiles, Profile } from '../../types';

type FetchProfileActionStart = {
  type: ActionType.FETCH_PROFILES_START;
};

type FetchProfileActionSuccess = {
  type: ActionType.FETCH_PROFILES_SUCCESS;
  payload: GroupedProfiles;
};

type FetchProfileActionFailure = {
  type: ActionType.FETCH_PROFILES_FAILURE;
  payload: string;
};

type ProfileSearching = {
  type: ActionType.PROFILES_SEARCHING;
  payload: GroupedProfiles;
};

type AddChosenProfile = {
  type: ActionType.ADD_CHOSEN_PROFILE;
  payload: Profile[];
};

type DeleteChosenProfile = {
  type: ActionType.DELETE_CHOSEN_PROFILE;
  payload: Profile[];
};

type ReplaceChosenProfile = {
  type: ActionType.REPLACE_CHOSEN_PROFILE;
  payload: Profile[];
};

export type Action =
  | FetchProfileActionStart
  | FetchProfileActionSuccess
  | FetchProfileActionFailure
  | ProfileSearching
  | AddChosenProfile
  | DeleteChosenProfile
  | ReplaceChosenProfile;
