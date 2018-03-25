import { Component,ViewChild } from '@angular/core';
import { NavController,Slides,ToastController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  Woocommerce: any;
  products: any[];
  moreProducts:any[];
  page:  number;

  @ViewChild('productSlides') productSlides: Slides;


  constructor(public navCtrl: NavController, public toasCtrl: ToastController) {
    this.page= 2;

    this.Woocommerce = WC({
      url: "http://localhost/ecommarce",
     // endpoint:"/wc-auth/v2/authorize",
      consumerKey:"ck_95ab1cd86d0763b9951b527616057acb70aed85f",
      consumerSecret:"cs_72c6078ae075528183216485e9baae39bc3354af"
    });
      //infinite scroll
    this.loadMoreProducts(null);


    this.Woocommerce.getAsync("products").then((data) =>{
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    },(err)=>{
     console.log(err)
   }
  )

  }
   ionViewDidLoad(){
    setInterval(()=> {
      //set untuk auto slider product kerena ada bug ionic tidak bisa auto slider 2
      if(this.productSlides.getActiveIndex() == this.productSlides.length() -1)
        this.productSlides.slideTo(0);
      this.productSlides.slideNext();
    }, 3000)
 }

 loadMoreProducts(event){
  //infinite scroll
  if(event ==null){
    this.page =2;
    this.moreProducts = [];
  }
  else
  this.page++;
  //load data for page
this.Woocommerce.getAsync("products?page=" + this.page).then( (data) => {
  console.log(JSON.parse(data.body));
  this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

  if(event !=null)
  {
    event.complete();
  }

  if(JSON.parse(data.body).products.length <10){
    event.enable(false);

    this.toasCtrl.create({
      message: "No More Product",
      duration: 5000
    }).present();
  }

  },(err)=>{
    console.log(err)
  }
)
 }

  }

