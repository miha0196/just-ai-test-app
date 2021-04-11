import { Searching } from '../Searching';

import { Profile } from '../../types';

type ProfileListProps = {
  displayedProfiles: Array<Profile[]>;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
};

export const ProfileList: React.FC<ProfileListProps> = ({
  displayedProfiles,
  onDragStart,
}) => {
  return (
    <div className="Profile-list col-5" onDragStart={onDragStart}>
      <Searching />

      <div className="Profile-list__profiles border rounded">
        {displayedProfiles.map((group, idx) => (
          <div className="card" key={idx}>
            <button
              className="btn text-left card-header"
              type="button"
              data-toggle="collapse"
              data-target={`#collapse${idx}`}
              disabled={!group.length}
            >
              {idx * 10 + 1}-{(idx + 1) * 10}
            </button>

            <div id={`collapse${idx}`} className="collapse">
              {group.length && (
                <ul className="list-unstyled">
                  {group.map((profile) => (
                    <li
                      className="list-group-item"
                      key={profile.login.uuid}
                      data-id={profile.login.uuid}
                      draggable="true"
                    >
                      {profile.name.first} {profile.name.last}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
