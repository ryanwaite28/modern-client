import { ICommonModel } from './_common.interface';

export interface IUser extends ICommonModel {
  firstname:                   string;
  middlename:                  string;
  lastname:                    string;
  username:                    string;
  displayname:                 string;
  email:                       string;
  paypal:                      string;
  password?:                   string;
  phone:                       string;
  bio:                         string;
  headline:                    string;
  tags:                        string;
  icon_link:                   string;
  icon_id:                     string;
  photo_id_link:               string;
  photo_id_id:                 string;
  wallpaper_link:              string;
  wallpaper_id:                string;
  location:                    string;
  location_id:                 string;
  location_json:               string;
  zipcode:                     string;
  city:                        string;
  state:                       string;
  county:                      string;
  country:                     string;
  lat:                         number;
  lng:                         number;
  public:                      boolean;
  online:                      boolean;
  premium:                     boolean;
  certified:                   boolean;
  email_verified:              boolean;
  phone_verified:              boolean;
  can_message:                 boolean;
  can_converse:                boolean;
  notifications_last_opened:   string;
}