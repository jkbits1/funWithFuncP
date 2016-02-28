/**
 * Created by Jon on 27/11/15.
 */

import {Component, FORM_DIRECTIVES, CORE_DIRECTIVES, Observable, EventEmitter} from 'angular2/angular2';
import {Http, URLSearchParams} from 'angular2/http';
import {JSONP_PROVIDERS, Jsonp} from 'angular2/http';

@Component({
    selector: 'my-app',
    providers: [JSONP_PROVIDERS],
    template: `
<div>
<input #item1 type="text" (keyup)="keyup($event)">
<ul>
  <li *ng-for="#result of results">{{result.val}}&nbsp;{{result.id}}</li>
</ul>
<pre>{{ item1.value }}</pre>
</div>
`,
directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class App {
  item1input: EventEmitter = new EventEmitter();

  constructor(http:Http, jsonp:Jsonp) {
    this.id = 0;
    this.results = [];
    this.item1input._subject
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

  keyup($event){
    this.item1input.next($event.currentTarget.value);
  }
}
