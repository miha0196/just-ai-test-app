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

const highlight = (text: string, str: string) => {
  const startIdx = text.toLowerCase().indexOf(str.toLowerCase());
  const endIdx = startIdx + str.length;
  return (
    text.slice(0, startIdx) +
    `<span class="text-highlight">${text.slice(startIdx, endIdx)}</span>` +
    text.slice(endIdx)
  );
};

const insertProfiles = (
  profileList: Profile[],
  dropId: string = '',
  insertProfile: Profile,
  dragId?: string
) => {
  let insertIdx = profileList.findIndex((p) => p.login.uuid === dropId);

  if (!dropId) {
    return [...profileList, insertProfile];
  }

  if (dragId) {
    const cutIdx = profileList.findIndex((p) => p.login.uuid === dragId);

    profileList.splice(cutIdx, 1);
  }

  profileList.splice(insertIdx, 0, insertProfile);
  return profileList;
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
      return group.reduce((newList: Profile[], profile) => {
        const firstName = profile.name.first;
        const lastName = profile.name.last;
        if (firstName.toLowerCase().includes(str.toLowerCase())) {
          const highlighted = highlight(firstName, str);
          return newList.concat({
            ...profile,
            name: { first: highlighted, last: profile.name.last },
          });
        }

        if (lastName.toLowerCase().includes(str.toLowerCase())) {
          const highlighted = highlight(lastName, str);
          return newList.concat({
            ...profile,
            name: { first: profile.name.first, last: highlighted },
          });
        }
        const newName = str
          .toLowerCase()
          .split(' ')
          .map((halfStr) => {
            if (firstName.toLowerCase().includes(halfStr.toLowerCase())) {
              return highlight(firstName, halfStr);
            }

            if (lastName.toLowerCase().includes(halfStr.toLowerCase())) {
              return highlight(lastName, halfStr);
            }

            return '';
          });

        if (newName.filter((item) => item).length === 2) {
          return newList.concat({
            ...profile,
            name: { first: newName[0], last: newName[1] },
          });
        }
        return newList;
      }, []);
    });

    dispatch({
      type: ActionType.PROFILES_SEARCHING,
      payload: foundProfiles,
    });
  };
};

export const addChosenProfile = (id: string, dropId: string) => {
  return (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const groupedProfiles = getState().profiles.groupedProfiles;
    const oldChosenProfiles = getState().profiles.chosenProfiles;
    const newChosenProfile = groupedProfiles
      .flat()
      .find((p) => p.login.uuid === id);

    if (
      !newChosenProfile ||
      oldChosenProfiles.find((p) => p.login.uuid === id)
    ) {
      return;
    }

    const newList = insertProfiles(oldChosenProfiles, dropId, newChosenProfile);

    dispatch({
      type: ActionType.ADD_CHOSEN_PROFILE,
      payload: newList,
    });
  };
};

export const replaceChosenProfile = (dragId: string, dropId: string) => {
  return (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const oldChosenProfiles = getState().profiles.chosenProfiles.concat();
    const dragProfile = oldChosenProfiles.find((p) => p.login.uuid === dragId);

    if (!dragProfile) {
      return;
    }

    const newList = insertProfiles(
      oldChosenProfiles,
      dropId,
      dragProfile,
      dragId
    );

    dispatch({
      type: ActionType.REPLACE_CHOSEN_PROFILE,
      payload: newList,
    });
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
