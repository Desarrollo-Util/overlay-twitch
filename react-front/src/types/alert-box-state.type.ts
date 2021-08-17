import { AlertTypes } from "./alert-types.type";

export type AlertBoxState = {
  actualEvent?: AlertBoxEvent;
  eventList: Array<AlertBoxEvent>;
};

export type AlertBoxEvent = {
  id: string;
  type: AlertTypes;
  username: string;
  message?: string;
};
