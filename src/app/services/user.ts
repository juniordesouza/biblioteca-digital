export interface UserName {
  title: string;
  first: string;
  last: string;
}

export interface User {
  gender: string;
  name: UserName;
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export class UserModel implements User {
  constructor(public name: UserName, public gender: string, public email: string, public picture: any) {}

  get fullName(): string {
    return `${this.name.first} ${this.name.last}`;
  }
}
