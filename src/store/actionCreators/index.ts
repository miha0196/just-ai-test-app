import { Dispatch } from 'redux';
import { ActionType } from '../actionTypes';
import { Action } from '../actions';

import { RootState } from '../reducers/rootReducer';

import { Profile, GroupedProfiles } from '../../types';

const getGroupedProfiles = (profiles: Profile[]) => {
  const groupedProfiles: GroupedProfiles = [[], [], []];

  profiles
    .sort((a, b) => a.registered.age - b.registered.age)
    .forEach((profile) => {
      if (profile.registered.age < 11) {
        return groupedProfiles[0].push(profile);
      }

      if (profile.registered.age < 21) {
        return groupedProfiles[1].push(profile);
      }

      return groupedProfiles[2].push(profile);
    });

  return groupedProfiles;
};

export const fetchProfiles = () => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.FETCH_PROFILES_START,
    });

    try {
      const response = await fetch('https://randomuser.me/api?results=1000');

      const { results } = await response.json();

      dispatch({
        type: ActionType.FETCH_PROFILES_SUCCESS,
        payload: getGroupedProfiles(results),
      });
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_PROFILES_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const profileSearching = (str: string) => {
  return (dispatch: Dispatch<Action>, getState: () => RootState) => {
    let foundProfiles = getState().profiles.groupedProfiles;

    if (!str) {
      dispatch({
        type: ActionType.PROFILES_SEARCHING,
        payload: foundProfiles,
      });
      return;
    }

    foundProfiles = foundProfiles.map((group) => {
      return group.filter((profile) => {
        return (
          profile.name.first.toLowerCase().includes(str) ||
          profile.name.last.toLowerCase().includes(str)
        );
      });
    });

    dispatch({
      type: ActionType.PROFILES_SEARCHING,
      payload: foundProfiles,
    });
  };
};

export const addChosenProfile = (id: string) => {
  return (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const groupedProfiles = getState().profiles.groupedProfiles;
    const oldChosenProfiles = getState().profiles.chosenProfiles;
    const newChosenProfile = groupedProfiles
      .flat()
      .find((profile) => profile.login.uuid === id);

    if (newChosenProfile) {
      dispatch({
        type: ActionType.ADD_CHOSEN_PROFILE,
        payload: [...oldChosenProfiles, newChosenProfile],
      });
    }
  };
};

export const replaceChosenProfile = (dragId: string, dropId: string) => {
  return (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const oldChosenProfiles = getState().profiles.chosenProfiles.concat();
    const dragProfile = oldChosenProfiles.find((p) => p.login.uuid === dragId);

    let copyList = oldChosenProfiles.concat();
    const insertIdx = oldChosenProfiles.findIndex(
      (p) => p.login.uuid === dropId
    );
    const cutIdx = oldChosenProfiles.findIndex((p) => p.login.uuid === dragId);

    copyList.splice(cutIdx, 1);

    if (dragProfile) {
      copyList.splice(insertIdx, 0, dragProfile);
      dispatch({
        type: ActionType.REPLACE_CHOSEN_PROFILE,
        payload: copyList,
      });
    }
  };
};

export const deleteChosenProfile = (id: string) => {
  return (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const oldChosenProfiles = getState().profiles.chosenProfiles;
    const newChosenProfiles = oldChosenProfiles.filter(
      (p) => p.login.uuid !== id
    );

    dispatch({
      type: ActionType.ADD_CHOSEN_PROFILE,
      payload: newChosenProfiles,
    });
  };
};
