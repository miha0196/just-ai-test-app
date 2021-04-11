import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';

import {
  fetchProfiles,
  addChosenProfile,
  replaceChosenProfile,
  deleteChosenProfile,
} from './store';
import { useTypedSelector } from './hooks/useTypedSelector';

import { Loader } from './components/Loader';
import { ProfileList } from './components/ProfileList';
import { ChosenProfiles } from './components/ChosenProfiles';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const {
    displayedProfiles,
    chosenProfiles,
    loading,
    error,
  } = useTypedSelector((state) => state.profiles);
  const dragItem = useRef<string | null>(null);

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const dropHandler = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      const dropId = (event.target as HTMLLIElement).closest('li')?.dataset.id;

      const isChosenUserThere = chosenProfiles.some(
        (user) => user.login.uuid === dragItem.current
      );

      if (dragItem.current) {
        if (isChosenUserThere && dropId) {
          return dispatch(replaceChosenProfile(dragItem.current, dropId));
        }

        dispatch(addChosenProfile(dragItem.current));
      }
    },
    [dispatch, chosenProfiles]
  );

  const dragStartHandler = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest('li')) {
        dragItem.current = (event.target as HTMLElement).closest(
          'li'
        )!.dataset.id!;
      }
    },
    []
  );

  const dragOverHandler = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const deleteProfileHandler = useCallback(
    (uuid: string) => {
      dispatch(deleteChosenProfile(uuid));
    },
    [dispatch]
  );

  return (
    <div className="App p-3">
      <div className="container">
        {loading && <Loader />}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="row">
            <ProfileList
              displayedProfiles={displayedProfiles}
              onDragStart={dragStartHandler}
            />
            <ChosenProfiles
              onDragStart={dragStartHandler}
              onDragOver={dragOverHandler}
              onDrop={dropHandler}
              chosenProfiles={chosenProfiles}
              onDeleteProfile={deleteProfileHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
