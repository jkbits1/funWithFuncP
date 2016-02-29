/**
 * Created by Jon on 27/11/15.
 */

import {Component, FORM_DIRECTIVES, CORE_DIRECTIVES, Observable, EventEmitter} from 'angular2/angular2';
//import {Http, URLSearchParams} from 'angular2/http';
//import {JSONP_PROVIDERS, Jsonp} from 'angular2/http';
//import { Calcs1 } from './wheelCalcs';
import { WheelCalcs } from './wheelCalcs';

enum WheelNums { First, Second, Third, Answers };

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
<br>Wheel 1
1 - {{wheels[0].toString()}}
<br>Wheel 2
2- {{wheels[1].toString()}}
<br>Wheel 3
3- {{wheels[2].toString()}}
<br>Wheel 4
4- {{wheels[3].toString()}}
<br>Loop 2
4- {{secLoop}}
<br>Loop 3
4- {{thrLoop}}
<br>Loop ans
4- {{ansLoop}}
<br>Perms 2
4- {{perms2}}
<br>Perms 3
4- {{perms3}}


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

  wheels: Array<WheelCalcs.WheelPos> = [[],[], [], []];

  secLoop: WheelCalcs.WheelLoop = [];
  thrLoop: WheelCalcs.WheelLoop = [];
  ansLoop: WheelCalcs.WheelLoop = [];

  perms2: Array<WheelCalcs.LoopsPermutation> = [];
  perms3: Array<WheelCalcs.LoopsPermutation> = [];

  calcs: WheelCalcs.Calcs1 = undefined;

  //constructor(http:Http, jsonp:Jsonp) {
  constructor() {
    this.id = 0;

    this.results1 = [1];
    this.results2 = [2];
    this.results3 = [3];
    this.results4 = [4];

    this.handleWheelInputs(this.wheel1input._subject, this.results1, WheelNums.First);
    this.handleWheelInputs(this.wheel2input._subject, this.results2, WheelNums.Second);
    this.handleWheelInputs(this.wheel3input._subject, this.results3, WheelNums.Third);
    this.handleWheelInputs(this.wheel4input._subject, this.results4, WheelNums.Answers);

    this.calcs = new WheelCalcs.Calcs1();

    this.wheels[WheelNums.First]    = [1, 2, 3];
    this.wheels[WheelNums.Second]   = [4, 5, 6];
    this.wheels[WheelNums.Third]    = [7, 8, 9];
    this.wheels[WheelNums.Answers]  = [12, 15, 18];

    //var turn1:WheelCalcs.WheelPos =
    //  this.calcs.turnWheel(this.wheels[1], 1);
  }

  handleWheelInputs (subject, results, wheelPos) {
    subject
      .debounceTime(50)
      .distinctUntilChanged()
      //.switchMap(term => {
      //})
      .subscribe(
        // this returns a fn that handles input
        this.updateModel(this, results, wheelPos),
        error => {
          console.error('Error');
        },
        () => {
          console.log('Completed!');
        }
      );
  }

  // NOTE: this may be an abstraction too far, but keen to show this fn name
  //       Especially, the self seems too fiddly
  updateModel (self, results, wheelPos) {

    function processInput (term) {
      console.log('term: ' + term);
      results.push({
        id: this.id++,
        val: term
      });
      self.wheels[wheelPos] = term.split(",");
    }

    // need a better name
    function manageModel (term) {
      processInput(term);

      self.updateCalculations();
    }

    return manageModel;
  }

  updateCalculations () {
    this.secLoop = this.calcs.createWheelLoop(this.wheels[WheelNums.Second]);
    this.thrLoop = this.calcs.createWheelLoop(this.wheels[WheelNums.Third]);
    this.ansLoop = this.calcs.createWheelLoop(this.wheels[WheelNums.Answers]);

    this.perms2 = this.calcs.twoWheelPerms(this.wheels[WheelNums.First], this.secLoop);
    this.perms3 = this.calcs.threeLoopPerms(this.wheels[WheelNums.First],
      this.secLoop, this.thrLoop);

    var i = 2;
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
