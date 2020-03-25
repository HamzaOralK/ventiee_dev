export class Event {
  _id: string;
  title: string;
  moderatorId: string;
  peopleCount: number;
  startDate: Date;
  endDate: Date;
  venue: string;
  district: string;
  city: string;
  longtitute: string;
  latitute: string;
}

export class MLocation {
  district: string;
  city: string;
  long: string;
  lat: string;
}
