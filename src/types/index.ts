export type Profile = {
  name: {
    first: string;
    last: string;
  };
  email: string;
  registered: {
    date: string;
    age: number;
  };
  picture: {
    thumbnail: string;
  };
  login: {
    uuid: string;
  };
};

export type GroupedProfiles = Array<Profile[]>;
