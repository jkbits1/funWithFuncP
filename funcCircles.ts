/**
 * Created by Jon on 23/02/16.
 */

"use strict";

// taken from definitely typed lodash to get rid of ramda errors
declare module _ {
  //_.drop
  //interface LoDashStatic {
  interface RTy {
    /**
     * Creates a slice of array with n elements dropped from the beginning.
     *
     * @param array The array to query.
     * @param n The number of elements to drop.
     * @return Returns the slice of array.
     */
    drop<T>(n:number, array:T[]): T[];
    take<T>(n:number, array:T[]): T[];
    head<T>(array: List<T>): T;
    //compose<V0, V1, T1>(fn0: (x0: V0, x1: V1) => T1): (x0: V0, x1: V1) => T1;
    //compose<V0, T1, T2>(fn1: (x: T1) => T2, fn0: (x0: V0) => T1): (x0: V0) => T2;
  }

  interface lodashTy {
    //curry<T1, R>(func: (t1: T1) => R):
    //  CurriedFunction1<T1, R>;
    curry<T1, T2, R>(func: (t1: T1, t2: T2) => R):
      CurriedFunction2<T1, T2, R>;
    flatten<T>(array: List<T|T[]>): T[];
    head<T>(array: List<T>): T;
    zip<T>(...arrays: List<T>[]): T[][];
  }

  interface LoDashImplicitArrayWrapper<T> {
    /**
     * @see _.zip
     */
    //zip<T>(...arrays: List<T>[]): _.LoDashImplicitArrayWrapper<T[]>;
  }

  interface CurriedFunction1<T1, R> {
    (): CurriedFunction1<T1, R>;
    (t1: T1): R;
  }

  interface CurriedFunction2<T1, T2, R> {
    (): CurriedFunction2<T1, T2, R>;
    (t1: T1): CurriedFunction1<T2, R>;
    (t1: T1, t2: T2): R;
  }

  interface List<T> {
    [index: number]: T;
    length: number;
  }
}

declare var R: _.RTy;
//declare var lodash: _.lodashTy;
declare var _: _.lodashTy;

window.onload = function () {

  interface Column extends Array<number> { 0: number, 1: number, 2: number}

  type WheelPos         = Array<number>;
  type WheelPosx        = number[];
  type WheelLoop        = Array<WheelPos>;
  type LoopsPermutation = Array<WheelPos>;
  //type LoopsPermColumn  = [number, number, number];
  type LoopsPermColumn  = Column;
  //type LoopsPermColumn  = Triple;
  type LoopsPermAnswers = Array<number>;

  class Triple {
    //a: number;
    //b: number;
    //c: number;
    result: number;

    constructor (a: number, b: number, c: number) {
      this.result = a + b + c;
    }
  }

  function Triple2 (a: number, b: number, c: number) {
    this.result = a + b + c;

    this.result = function ():number {
      return this.result;
    }
  }

  var wheelPos1:WheelPos    = [1, 2, 3];
  var wheelPos2:WheelPos    = [4, 5, 6];
  var wheelPos3:WheelPos    = [7, 8, 9];
  var wheelPosAns:WheelPos  = [12, 15, 18];

  function turnWheel(wheel: WheelPos, turns: number): WheelPos {
      var dropPart = R.drop(turns, wheel);
      var takePart = R.take(turns, wheel);

      return dropPart.concat(takePart);
  }

  var turn1:WheelPos = turnWheel(wheelPos2, 1);

  function getWheelLoop (positions: Array<WheelPos>, pos:WheelPos, count:number): WheelLoop {
    switch (count) {
      case 0:
        return [pos].concat(positions);
        break;
      default:
        return getWheelLoop([turnWheel(pos, count)].concat(positions),
          pos, count - 1);
        break;
    }
  }

  var loop = getWheelLoop([], wheelPos2, 0);

  // return WheelLoop
  function createWheelLoop (initialPos: WheelPos): WheelLoop {
    return getWheelLoop([], initialPos, initialPos.length - 1);
  }

  var secLoop: WheelLoop = createWheelLoop(wheelPos2);
  var thrLoop: WheelLoop = createWheelLoop(wheelPos3);
  var ansLoop: WheelLoop = createWheelLoop(wheelPosAns);

  // return List LoopsPermutation
  function twoWheelPerms (first: WheelPos, secLoop:WheelLoop): Array<LoopsPermutation> {

    //function permItem (first, secPos) {
    //  var item = [first].concat([secPos]);
    //
    //  return item;
    //}

    var perms = secLoop.map
    (secPos => [first].concat([secPos]));
    //(secPos => permItem(first, secPos));

    return perms;
  }

  var perms2 = twoWheelPerms(wheelPos1, secLoop);

  function appendTwoWheelPerms (twoWheelPermsLocal: Array<LoopsPermutation>, thrPos: WheelPos) :Array<LoopsPermutation> {

    return twoWheelPermsLocal.map(twoLoopsPerm => twoLoopsPerm.concat([thrPos]));
  }

  function threeLoopPerms (first: WheelPos, secLoop: WheelLoop, thrLoop: WheelLoop): Array<LoopsPermutation> {
    // CURRIED - works with typescript definition
    var addPosToTwoWheelPerms = (_.curry(appendTwoWheelPerms))(twoWheelPerms(first, secLoop));

    // AS A CLOSURE
    function addPosToTwoWheelPerms2 (thrPos: WheelPos): Array<LoopsPermutation> {
      return appendTwoWheelPerms(twoWheelPerms(first, secLoop), thrPos);
    }

    //return _.flatten(thrLoop.map(addPosToTwoWheelPerms));
    return _.flatten(thrLoop.map(addPosToTwoWheelPerms2));

    // NOTE: why flatten instead of concat
  }

  var perms3 = threeLoopPerms(wheelPos1, secLoop, thrLoop);

  function sumColumn ([a, b, c]: LoopsPermColumn): number {
  //function sumColumn (permCol: LoopsPermColumn): number {
    // return for tuple type
    //var [a, b, c] = permCol;
    return a + b + c;

    // return for class type
    //return permCol.result;
  }

  function columnsFromPermutation (perm: LoopsPermutation):
      Array<LoopsPermColumn> {
      //Array<[number, number, number]> {
      //Array<Column> {
    var firstPos = R.head(perm);
    var secPos = R.head(R.drop(1, perm));
    var thrPos = R.head(R.drop(2, perm));

    var getSpecificPos = R.compose(R.head, R.drop);

    var testPos = getSpecificPos(1, perm);

    var zip3: Array<LoopsPermColumn> = _.zip(firstPos, secPos, thrPos);

    //var zipRetVal = zip3.map(a => {
    //  return [a[0], a[1], a[2]]
    //});

    return zip3;
    //return zipRetVal;
  }

  var c = columnsFromPermutation(perms3[0]);

  function sumPlusTest (perm: LoopsPermutation):
                          Array<[LoopsPermAnswers]> {
    //var cols:Array<LoopsPermColumn> = columnsFromPermutation(perms3[0]);
    var cols:Array<LoopsPermColumn> = columnsFromPermutation(perm);

    return [[cols.map(sumColumn)]];
  }

  var s = sumPlusTest(perms3[0]);

  function answersPlusTest (first: WheelPos, secLoop: WheelLoop,
                              thrLoop: WheelLoop): Array<[LoopsPermAnswers]> {
    var perms3 = threeLoopPerms(first, secLoop, thrLoop);

    var s:Array<[LoopsPermAnswers]> = _.flatten(perms3.map(sumPlusTest));

    return s;
  }

  var a:Array<[LoopsPermAnswers]> = answersPlusTest(wheelPos1, secLoop, thrLoop);

  var i = 2;
};
