import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { fabric } from 'fabric';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public page: Page;
  protected _canvas?: fabric.Canvas;
  image?: fabric.Image;


  constructor(@Inject('BASE_URL') baseUrl: string, sanitizer: DomSanitizer) {
    const url = sanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'page');
    this.page = new Page(url);
    console.log("IMG LINK", this.page.src)
    fabric.Image.fromURL((this.page.src as any).changingThisBreaksApplicationSecurity as string, (oImg) => {
      oImg.scaleX = 0.5;
      oImg.scaleY = 0.5;
      this.image = oImg;
      console.log("IMAGE", this.image)
      this._canvas = new fabric.Canvas('fabricSurface', {
        selection: false,
        preserveObjectStacking: true,
        width: this.image.width * 0.5,
        height: this.image.height * 0.5,
        isDrawingMode: true
      });
      this._canvas.setBackgroundImage(
        this.image,
        this._canvas.renderAll.bind(this._canvas)
      );
      this._canvas.renderAll();
    })
  }

  ngOnInit() {

  }
}

class Page {
  src: SafeUrl;

  constructor(src: SafeUrl) {
    this.src = src;
  }
}
