import { Profile } from '../../types';

type ChosenProfilesProps = {
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  chosenProfiles: Profile[];
  onDeleteProfile: (uuid: string) => void;
  isHighlightedList: boolean;
};

export const ChosenProfiles: React.FC<ChosenProfilesProps> = ({
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  chosenProfiles,
  onDeleteProfile,
  isHighlightedList,
}) => (
  <div
    className="Chosen-profiles col-7"
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onDrop={onDrop}
    onDragEnd={onDragEnd}
  >
    <h3 className="mb-3 p-2 pl-4 border rounded ">Избранные</h3>
    <ul
      className={`Chosen-profiles__profiles list-group p-0 border rounded ${
        isHighlightedList && 'Chosen-profiles__profiles_highlight'
      }`}
    >
      {!chosenProfiles.length && (
        <li className="list-group-item text-center">
          Добавьте избранных пользователей.
        </li>
      )}
      {Boolean(chosenProfiles.length) &&
        chosenProfiles.map((profile) => (
          <li
            className="list-group-item d-flex justify-content-between show-new-item"
            data-id={profile.login.uuid}
            key={profile.login.uuid}
            draggable
          >
            <div>
              <img
                src={profile.picture.thumbnail}
                className="rounded float-left mt-2 mr-3 Chosen-profiles__avatar"
                alt={profile.name.first}
              />
              <div>
                <p>
                  {profile.name.first} {profile.name.last}, дата регистрации:{' '}
                  {Intl.DateTimeFormat('ru-RU').format(
                    Date.parse(profile.registered.date)
                  )}
                </p>
                <p className="mb-0">{profile.email}</p>
              </div>
            </div>
            <img
              onClick={() => onDeleteProfile(profile.login.uuid)}
              src="images/trash.svg"
              className="Chosen-profiles__delete-img"
              alt="delete profile"
            />
          </li>
        ))}
    </ul>
  </div>
);
