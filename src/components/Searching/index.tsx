import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { profileSearching } from '../../store';

export const Searching: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const submitSearchingHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      dispatch(profileSearching(inputValue));
    },
    [dispatch, inputValue]
  );

  const changeInputHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(() => event.target.value);
    },
    []
  );

  return (
    <form className="Searching mb-3" onSubmit={submitSearchingHandler}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Поиск пользователей"
          onChange={changeInputHandler}
          value={inputValue}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" type="submit">
            Поиск
          </button>
        </div>
      </div>
    </form>
  );
};
