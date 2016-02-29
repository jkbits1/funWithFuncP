/**
 * Created by Jon on 27/11/15.
 */

import {Component, FORM_DIRECTIVES, CORE_DIRECTIVES, Observable, EventEmitter} from 'angular2/angular2';
//import {Http, URLSearchParams} from 'angular2/http';
//import {JSONP_PROVIDERS, Jsonp} from 'angular2/http';
//import { Calcs1 } from './wheelCalcs';
import { WheelCalcs } from './wheelCalcs';

@Component({
    selector: 'my-app',
    //providers: [JSONP_PROVIDERS],
    template: `
<div>
<input #wheel1 type="text" (keyup)="keyup1($event)">
<input #wheel2 type="text" (keyup)="keyup2($event)">
<input #wheel3 type="text" (keyup)="keyup3($event)">
<input #wheel4 type="text" (keyup)="keyup4($event)">
<button (click)="testclick($event)">test</button>
<ul>
  <!--<li *ng-for="#result of results1">{{result.val}}&nbsp;{{result.id}}</li>-->
  <!--<li *ng-for="#result of results2">{{result.val}}&nbsp;{{result.id}}</li>-->
</ul>
<pre>{{ wheel1.value }}</pre>
<br>
1 - {{wheels[0].toString()}}
<br>
2- {{wheels[1].toString()}}
<br>
3- {{wheels[2].toString()}}
<br>
4- {{wheels[3].toString()}}
</div>
`,
directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class App {
  wheel1input = new EventEmitter();
  wheel2input = new EventEmitter();
  wheel3input = new EventEmitter();
  wheel4input = new EventEmitter();

  id: number = 0;
  results1 = [];
  results2 = [];
  results3 = [];
  results4 = [];

  wheels = [[],[], [], []];

  //constructor(http:Http, jsonp:Jsonp) {
  constructor() {
    this.id = 0;

    this.results1 = [1];
    this.results2 = [2];
    this.results3 = [3];
    this.results4 = [4];

    this.getWheelInputs(
      this.wheel1input._subject,
      this.results1, this.wheels, 0);
    this.getWheelInputs(
      this.wheel2input._subject,
      this.results2, this.wheels, 1);
    this.getWheelInputs(
      this.wheel3input._subject,
      this.results3, this.wheels, 2);
    this.getWheelInputs(
      this.wheel4input._subject,
      this.results4, this.wheels, 3);

    var calcs = new WheelCalcs.Calcs1();

    //var wheelPos1:WheelCalcs.WheelPos   = [1, 2, 3];
    this.wheels[0] = [1, 2, 3];
    //var wheelPos2:WheelCalcs.WheelPos   = [4, 5, 6];
    this.wheels[1] = [4, 5, 6];
    //var wheelPos3:WheelCalcs.WheelPos   = [7, 8, 9];
    this.wheels[2] = [7, 8, 9];
    var wheelPosAns:WheelCalcs.WheelPos = [12, 15, 18];

    var turn1:WheelCalcs.WheelPos =
      calcs.turnWheel(this.wheels[1], 1);

    var secLoop: WheelCalcs.WheelLoop =
      calcs.createWheelLoop(this.wheels[1]);
    var thrLoop: WheelCalcs.WheelLoop = calcs.createWheelLoop(this.wheels[2]);
    var ansLoop: WheelCalcs.WheelLoop = calcs.createWheelLoop(wheelPosAns);

    var i = 2;
  }

  getWheelInputs (subject, results, wheels, wheelPos) {
    subject
      .debounceTime(50)
      .distinctUntilChanged()
      //.switchMap(term => {
      //})
      .subscribe((term) => {
          console.log('term: ' + term);
          results.push({
            id: this.id++,
            val: term
          });
          wheels[wheelPos] = term.split(",");
        },
        error => {
          console.error('Error');
        },
        () => {
          console.log('Completed!');
        }
      );
  }

  passOnEvent (input: EventEmitter, $event: any) {
    input.next($event.currentTarget.value);
  }


  keyup1 ($event) {
    this.passOnEvent(this.wheel1input, $event);
  }

  keyup2 ($event) {
    this.passOnEvent(this.wheel2input, $event);
  }

  keyup3 ($event) {
    this.passOnEvent(this.wheel3input, $event);
  }

  keyup4 ($event) {
    this.passOnEvent(this.wheel4input, $event);
  }

  testclick ($event) {

  }
}
