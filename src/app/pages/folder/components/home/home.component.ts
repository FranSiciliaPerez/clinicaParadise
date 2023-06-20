import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('slideRef') slides: IonSlides;

  slideOptions = {
    initialSlide: 0, 
    autoplay: {
      delay: 2000, 
    },
    speed: 500, 
  };
  ngOnInit() {}
   // Función para pasar al siguiente slide al hacer clic en un botón
   nextSlide() {
    this.slides.slideNext();
  }

  // Función para pasar al slide anterior al hacer clic en un botón
  prevSlide() {
    this.slides.slidePrev();
  }
}
