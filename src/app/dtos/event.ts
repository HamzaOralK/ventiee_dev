export class Event {
  id: string;
  title: string;
  peopleCount: number;
  time: Date;
  startDate: Date;
  endDate: Date;
  venue: string;
  location: MLocation;
}

export class MLocation {
  district: string;
  city: string;
  long: string;
  lat: string;
}
