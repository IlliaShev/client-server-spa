import { ServiceService } from './../../service/service.service';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/common/common.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
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
export class ProductComponent implements OnInit {

  state: string = 'hide';

  @Input()
  product!: Product;

  form!: FormGroup;

  count: number = 0;

  constructor(private service: ServiceService,
    private dialog: MatDialog,
    private router: Router) {
    
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.product.name, [Validators.minLength(2), Validators.required]),
      description: new FormControl(this.product.description, [Validators.minLength(2), Validators.required]),
      vendor: new FormControl(this.product.vendor, [Validators.minLength(2), Validators.required]),
      price: new FormControl(this.product.price, [Validators.min(1), Validators.required]),
      amount: new FormControl(this.product.count, [Validators.min(0), Validators.required])
    })
  }

  openFullInfo() {
    this.state = this.state === 'hide' ? 'visible': 'hide';
  }

  async addProduct() {
    const response = await this.service.addProduct(this.product.name, this.count);
    if(response.code != 201) {
      this.dialog.open(DialogComponent, {
        data: {header: 'Exception', text: `Code: ${response.code}, text: ${response.text}`}
      })
    } else {
      this.product.count = response.text.count;
    }
    this.count = 0;
  }

  async removeProduct() {
    const response = await this.service.removeProduct(this.product.name, this.count);
    if(response.code != 201) {
      this.dialog.open(DialogComponent, {
        data: {header: 'Exception', text: `Code: ${response.code}, text: ${response.text}`}
      })
    } else {
      this.product.count = response.text.count;
    }
    this.count = 0;
  }

  async submitForm() {
    console.log(this.form.value);
    if(this.form.valid) {
      const formValues = this.form.value;
      const updatedProduct: Product = {
        id: this.product.id,
        name: formValues.name,
        description: formValues.description,
        vendor: formValues.vendor,
        price: formValues.price,
        count: formValues.amount,
        group: this.product.group
      } 
      const response = await this.service.updateProduct(updatedProduct);
      if(response.code == 204) {
        this.product = updatedProduct;
        this.dialog.open(DialogComponent, {
          data: {header: 'Успіх', text: `Продукт успішно оновлена`}
        })
      } else {
        this.form.reset();
        this.dialog.open(DialogComponent, {
          data: {header: 'Exception', text: `Code: ${response.code}, Text: ${response.text}`}
        })
      }
    }
  }

  async deleteProduct() {
    const productId = this.product.id!;
    await this.service.deleteProduct(productId);
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

}
