import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Group } from 'src/app/common/common.model';
import { ServiceService } from 'src/app/service/service.service';
import { DialogComponent } from '../dialog/dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
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
export class ProductListComponent implements OnInit {

  state: string = 'hide';
  loading: boolean = false; 
  products: Product[] = [];
  groupId: string = 'all';
  form: FormGroup;
  search: string = '';

  constructor(private activeRoute: ActivatedRoute,
    private service: ServiceService,
    private router: Router,
    private dialog: MatDialog) {
    this.groupId = activeRoute.snapshot.paramMap.get('group')!;
    this.form = new FormGroup({
      name: new FormControl('', [Validators.minLength(2)]),
      description: new FormControl('', [Validators.minLength(2)]),
      vendor: new FormControl('', [Validators.minLength(2)]),
      price: new FormControl('', [Validators.min(0)]),
      count: new FormControl('', [Validators.min(0)]),
      groupName: new FormControl('', [Validators.minLength(2)])
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    if(this.groupId === 'all') {
      this.products = await this.service.getAllProducts(); 
    } else {
      const responseGroup = await this.service.getGroupById(this.groupId);
      if(responseGroup.code != 201) {
        this.dialog.open(DialogComponent, {
          data: { header: 'Exception', text: `Code: ${responseGroup.code}, text: ${responseGroup.text}`}
        });
        this.router.navigateByUrl('/');
      }
      let groupName = null;
      (responseGroup.text as unknown as Group[]).forEach((group => {
        if(group.id == +this.groupId) {
          groupName = group.name;
        }
      }));
      if(groupName == null) {
        this.dialog.open(DialogComponent, {
          data: { header: 'Exception', text: `No group exist with such id`}
        });
        this.router.navigateByUrl('/');
      } else {
        const responseProduct = await this.service.getProductsForGroup(groupName);
        if(responseGroup.code != 201) {
          this.dialog.open(DialogComponent, {
            data: { header: 'Exception', text: `Code: ${responseGroup.code}, text: ${responseGroup.text}`}
          });
          this.router.navigateByUrl('/');
        } else {
          this.products = responseProduct.text as unknown as Product[];
        }
      }
    }
    this.loading = false;
  }

  showFormAddProduct() {
    this.state = this.state === 'hide' ? 'visible': 'hide';
  }

  async searchProducts() {
    this.loading = true;
    const searchObject = {
      nameStart: this.search
    }
    console.log(searchObject);
    let response = await this.service.filterProducts(searchObject);
    if(response.code != 201) {
      this.dialog.open(DialogComponent, {
        data: {header: 'Exception', text: `Code: ${response.code}, text: ${response.text}`}
      })
    } else {
      this.products = response.text;
    }
    this.loading = false;
  }

  async addProduct() {
    if(this.form.valid) {
      const productToSend: Product = {
        name: this.form.value.name,
        description: this.form.value.description,
        vendor: this.form.value.vendor,
        price: this.form.value.price,
        count: this.form.value.count,
        group: this.form.value.groupName
      }
      const response = await this.service.addProductToGroup(productToSend);
      if(response.code != 201) {
        this.dialog.open(DialogComponent, {
          data: {header: 'Exception', text: `Code: ${response.code}, text: ${response.text}`}
        })
      } else {
        this.dialog.open(DialogComponent, {
          data: {header: 'Успіх', text: `Група успішно додана`}
        })
        this.loading = true;
        this.products = await this.service.getAllProducts();
        this.loading = false;
        this.form.reset();
      }
    }
  }
}
