/**
 * Created by Jon on 27/11/15.
 */

import {Component, FORM_DIRECTIVES, CORE_DIRECTIVES, Observable, EventEmitter} from 'angular2/angular2';
//import {Http, URLSearchParams} from 'angular2/http';
//import {JSONP_PROVIDERS, Jsonp} from 'angular2/http';

@Component({
    selector: 'my-app',
    //providers: [JSONP_PROVIDERS],
    template: `
<div>
<input #wheel1 type="text" (keyup)="keyup1($event)">
<input #wheel2 type="text" (keyup)="keyup2($event)">
<input #wheel3 type="text" (keyup)="keyup3($event)">
<input #wheel4 type="text" (keyup)="keyup4($event)">
<ul>
  <li *ng-for="#result of results">{{result.val}}&nbsp;{{result.id}}</li>
</ul>
<pre>{{ wheel1.value }}</pre>
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
  results = [];

  //constructor(http:Http, jsonp:Jsonp) {
  constructor() {
    this.id = 0;
    this.results = [];
    this.wheel1input._subject
      .debounceTime(50)
      .distinctUntilChanged()
      //.switchMap(term => {
      //})
      .subscribe((term) => {
        console.log('term: ' + term);
        this.results.push({
          id: this.id++,
          val: term
        });
      },
        error => {
          console.error('Error');
        },
        () => {
          console.log('Completed!');
        }
      );
  }

  keyup1 ($event) {
    this.wheel1input.next($event.currentTarget.value);
  }

  keyup2 ($event) {
    this.wheel2input.next($event.currentTarget.value);
  }

  keyup3 ($event) {
    this.wheel3input.next($event.currentTarget.value);
  }

  keyup4 ($event) {
    this.wheel4input.next($event.currentTarget.value);
  }
}
