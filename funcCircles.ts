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
  }

  interface lodashTy {
    //curry<T1, R>(func: (t1: T1) => R):
    //  CurriedFunction1<T1, R>;
    curry<T1, T2, R>(func: (t1: T1, t2: T2) => R):
      CurriedFunction2<T1, T2, R>;
    flatten<T>(array: List<T|T[]>): T[];
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

  type WheelPos         = Array<number>;
  type WheelPosx        = number[];
  type WheelLoop        = Array<WheelPos>;
  type LoopsPermutation = Array<WheelPos>;
  //type LoopsPermColumn  = [number, number, number];
  type LoopsPermColumn  = Triple;

  class Triple {
    //a: number;
    //b: number;
    //c: number;
    result: number;

    constructor (a: number, b: number, c: number) {
      this.result = a + b + c;
    }
  }

  function Triple2 (a,b,c) {
    return
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

  function sumTriple (permCol: LoopsPermColumn): number {
  //  var [a, b, c] = permCol;
  //
  //  return a + b + c;
    return permCol.result;
  }

  var i = 2;
};
