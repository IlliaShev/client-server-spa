import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from 'src/app/common/common.model';
import { ServiceService } from 'src/app/service/service.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
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
export class GroupComponent implements OnInit {

  state: string = "hide";

  @Input()
  group!: Group;

  form!: FormGroup;

  constructor(private service: ServiceService,
    private router: Router,
    private dialog: MatDialog) {
      
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.group.name, [Validators.minLength(2), Validators.required]),
      description: new FormControl(this.group.description, [Validators.minLength(2), Validators.required])
    })
  }

  showFullInfo() {
    this.state = this.state == 'hide' ? 'visible': 'hide';
  }

  async submitForm(): Promise<void> {
    if(this.form.valid) {
      const groupToSend: Group = {
        id: this.group.id,
        name: this.form.value.name,
        description: this.form.value.description
      }
      const response = await this.service.updateGroup(groupToSend);
      if(response.code == 204) {
        this.group = groupToSend;
        this.dialog.open(DialogComponent, {
          data: {header: 'Успіх', text: `Група успішно оновлена`}
        })
      } else {
        this.form.reset();
        this.dialog.open(DialogComponent, {
          data: {header: 'Exception', text: `Code: ${response.code}, Text: ${response.text}`}
        })
      }
    }
  }

  onClick() {
    this.service.getAllGroups();
  }

  async deleteGroup() {
    const groupId = this.group.id!;
    await this.service.deleteGroup(groupId);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/']);
  }
}

