import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  constructor(private service: ServiceService) { }

  ngOnInit(): void {
  }


  onClick() {
    this.service.getAllGroups();
  }
}
