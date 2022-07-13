import { DialogComponent } from './../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/common/common.model';
import { ServiceService } from 'src/app/service/service.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
  animations: [
    trigger('full-info', [
      state('hide',
        style({height: '0', padding: '0'})
      ),
      state('visible',
        style({height: '*'})
      ),
      transition('visible <=> hide', [
        style({transformOrigin: 'top'}),
        animate('200ms')
      ]),
    ])
  ]
})
export class GroupListComponent implements OnInit {

  state: string = 'hide';
  loading: boolean = false;
  groups: Group[] = [];
  form: FormGroup;
  costTogether: number = 0;

  constructor(private service: ServiceService,
    private dialog: MatDialog) { 
    this.form = new FormGroup({
      name: new FormControl('', [Validators.minLength(2)]),
      description: new FormControl('', [Validators.minLength(2)])
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.groups = await this.service.getAllGroups();
    const response = await this.service.getTotalCost();
    if(response.code == 201) {
      this.costTogether = response.text;
    }
    this.loading = false;
  }

  showFormAddGroup() {
    this.state = this.state === 'hide' ? 'visible': 'hide';
  }

  async addGroup() {
    if(this.form.valid) {
      const groupToSend: Group = {
        name: this.form.value.name,
        description: this.form.value.description
      }
      const response = await this.service.addGroup(groupToSend);
      if(response.code != 201) {
        this.dialog.open(DialogComponent, {
          data: {header: 'Exception', text: `Code: ${response.code}, text: ${response.text}`}
        })
      } else {
        this.dialog.open(DialogComponent, {
          data: {header: 'Успіх', text: `Група успішно додана`}
        })
        this.loading = true;
        this.groups = await this.service.getAllGroups();
        this.loading = false;
        this.form.reset();
      }
    }
  }

}
