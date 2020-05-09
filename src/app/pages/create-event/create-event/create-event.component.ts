import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  eventId: string;
  constructor(private router: Router, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
  }

}
