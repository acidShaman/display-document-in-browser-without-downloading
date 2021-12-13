import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { fabric } from 'fabric';
import Annotation from '../interfaces/annotation';

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
    this.renderPageOnCanvas((this.page.src as any).changingThisBreaksApplicationSecurity as string);
  }

  ngOnInit() {}

  renderPageOnCanvas(url: string) {
    fabric.Image.fromURL(url, (oImg) => {
      oImg.scaleX = 0.5;
      oImg.scaleY = 0.5;
      this.image = oImg;
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
      // this.addRectangle();
      // this.addArrow();
      // this.addPolygon();
      // this.addPolyline();
      this._canvas.renderAll();
    })
  }

  addPolyline() { //which is freehand
    const points = [ 
      {x: 0, y: 0},
      {x: 200, y: 250},
      {x: 300, y: 300},
      {x: 350, y: 100},
    ];
    const polyline = new fabric.Polyline(points,{
      fill: 'transparent',
      stroke: 'red', //border
      strokeWidth: 5,
      left: 0,
      top: 0
    })
    this._canvas.add(polyline)
  }

  addPolygon() {
    const points = [ 
      {x: 0, y: 0},
      {x: 200, y: 250},
      {x: 300, y: 300},
      {x: 350, y: 100},
    ];
    const polygon = new fabric.Polygon(points,{
      fill: 'red', //background
      stroke: 'black', //border
      strokeWidth: 1,
    })
    this._canvas.add(polygon)
  }

  addRectangle() {
    const rect = new fabric.Rect({
      top: 0,
      left: 0,
      width: 200,
      height: 200,
      opacity: 0.5,
      fill: "#000000"
    })
    this._canvas.add(rect);
  }

  addArrow() {
    let {fromy, fromx, toy, tox} = {
      fromy: 0,
      fromx: 0,
      toy: 200,
      tox: 200
    }
    const angle = Math.atan2(toy - fromy, tox - fromx);
    const headlen = 10;  // arrow head size
    const circleRadius = 8;
  
    // bring the line end back some to account for arrow head.
    tox = tox - (headlen) * Math.cos(angle);
    toy = toy - (headlen) * Math.sin(angle);
    fromx = fromx + circleRadius * 1.75;
    fromy = fromy + circleRadius * 1.75;
  
    // calculate the points.
    const points = [
      {
        x: fromx,  // start point
        y: fromy
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
        y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      },{
        x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
        y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      }, {
        x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
      },{
        x: tox + (headlen) * Math.cos(angle),  // tip
        y: toy + (headlen) * Math.sin(angle)
      }, {
        x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
      }, {
        x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      },{
        x: fromx,
        y: fromy
      }
    ];
  
    const pline = new fabric.Polyline(points, {
      fill: 'white',
      stroke: 'black',
      opacity: 1,
      strokeWidth: 2,
      originX: 'left',
      originY: 'top',
    });
    const circle = new fabric.Circle({
      radius: circleRadius,
      top: 1,
      left: 1,
      fill: 'white',
      stroke: 'black',
      opacity: 1,
      strokeWidth: 2,
    })
    const arrowLineGroup = new fabric.Group([pline, circle])
    this._canvas.add(arrowLineGroup);
  }
}

class Page {
  src: SafeUrl;

  constructor(src: SafeUrl) {
    this.src = src;
  }
}
