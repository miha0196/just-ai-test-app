import { Profile } from '../../types';

type ChosenProfilesProps = {
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  chosenProfiles: Profile[];
  onDeleteProfile: (uuid: string) => void;
};

export const ChosenProfiles: React.FC<ChosenProfilesProps> = ({
  onDragStart,
  onDragOver,
  onDrop,
  chosenProfiles,
  onDeleteProfile,
}) => (
  <div
    className="Chosen-profiles col-7"
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onDrop={onDrop}
  >
    <h3 className="mb-3 p-2 pl-4 border rounded ">Избранные</h3>
    <ul className="Chosen-profiles__profiles list-group p-0 border rounded">
      {/* {
        !chosenProfiles.length && <li className="list-group-item">Добавьте избранных пользователей</li>
      } */}
      {!!chosenProfiles.length &&
        chosenProfiles.map((profile) => (
          <li
            className="list-group-item d-flex justify-content-between"
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
