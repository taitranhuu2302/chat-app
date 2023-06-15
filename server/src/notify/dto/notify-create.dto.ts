import { NotifyEnum } from '../notify.model';

export class NotifyCreateDto {
  title: string;
  description?: string;
  type: NotifyEnum;
  owner?: string;
  userFriend?: string;
  userRequestFriend?: string;
}
