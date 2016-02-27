/**
 * Created by Jon on 23/02/16.
 */

"use strict";

declare module _ {
  interface RIf {
    drop<T>(n:number, array:T[]): T[];
    take<T>(n:number, array:T[]): T[];
    head<T>(array: List<T>): T;
    //compose<V0, V1, T1>(fn0: (x0: V0, x1: V1) => T1): (x0: V0, x1: V1) => T1;
    //compose<V0, T1, T2>(fn1: (x: T1) => T2, fn0: (x0: V0) => T1): (x0: V0) => T2;
  }

  interface lodashIf {
    curry<T1, T2, R>(func: (t1: T1, t2: T2) => R):
      CurriedFunction2<T1, T2, R>;
    flatten<T>(array: List<T|T[]>): T[];
    head<T>(array: List<T>): T;
    zip<T>(...arrays: List<T>[]): T[][];
    isEqual(value: any, other: any): boolean;
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

declare var R: _.RIf;
declare var _: _.lodashIf;

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

  //var turn1:WheelPos = turnWheel(wheelPos2, 1);

  function getWheelLoop (positions: Array<WheelPos>, pos:WheelPos, count:number): WheelLoop {
    if (count === 0) {
      return [pos].concat(positions);
    }

    return getWheelLoop([turnWheel(pos, count)].concat(positions), pos, count - 1);
  }

  //var loop = getWheelLoop([], wheelPos2, 0);

  function createWheelLoop (initialPos: WheelPos): WheelLoop {
    return getWheelLoop([], initialPos, initialPos.length - 1);
  }

  var secLoop: WheelLoop = createWheelLoop(wheelPos2);
  var thrLoop: WheelLoop = createWheelLoop(wheelPos3);
  var ansLoop: WheelLoop = createWheelLoop(wheelPosAns);

  function twoWheelPerms (first: WheelPos, secLoop:WheelLoop): Array<LoopsPermutation> {
    return secLoop.map(secPos => [first].concat([secPos]));
  }

  //var perms2 = twoWheelPerms(wheelPos1, secLoop);

  function appendTwoWheelPerms (twoWheelPermsLocal: Array<LoopsPermutation>, thrPos: WheelPos) :Array<LoopsPermutation> {

    return twoWheelPermsLocal.map(twoLoopsPerm => twoLoopsPerm.concat([thrPos]));
  }

  function threeLoopPerms (first: WheelPos, secLoop: WheelLoop, thrLoop: WheelLoop): Array<LoopsPermutation> {
    var twoWheelPermsLocal = twoWheelPerms(first, secLoop);

    // AS CURRIED FUNCTION
    // var addPosToTwoWheelPerms = (_.curry(appendTwoWheelPerms))(twoWheelPermsLocal);

    // AS CLOSURE
    function addPosToTwoWheelPerms2 (thrPos: WheelPos): Array<LoopsPermutation> {
      return appendTwoWheelPerms(twoWheelPermsLocal, thrPos);
    }

    //return _.flatten(thrLoop.map(addPosToTwoWheelPerms));
    return _.flatten(thrLoop.map(addPosToTwoWheelPerms2));

    // NOTE: why flatten instead of concat
  }

  //var perms3 = threeLoopPerms(wheelPos1, secLoop, thrLoop);

  function sumColumn ([a, b, c]: LoopsPermColumn): number {
    return a + b + c;
  }

  function columnsFromPermutation (perm: LoopsPermutation): Array<LoopsPermColumn> {
    var firstPos = R.head(perm);
    var secPos = R.head(R.drop(1, perm));
    var thrPos = R.head(R.drop(2, perm));

    var getSpecificPos = R.compose(R.head, R.drop);

    return _.zip(firstPos, secPos, thrPos);
  }

  //var c = columnsFromPermutation(perms3[0]);

  function sumPlusPerm (perm: LoopsPermutation):
                          Array<[LoopsPermAnswers, LoopsPermutation]> {
    var cols:Array<LoopsPermColumn> = columnsFromPermutation(perm);

    return [[cols.map(sumColumn), perm]];
  }

  //var s = sumPlusPerm(perms3[0]);

  function answersPlusPerm (first: WheelPos, secLoop: WheelLoop,
                              thrLoop: WheelLoop):
                                  Array<[LoopsPermAnswers, LoopsPermutation]> {
    var perms3 = threeLoopPerms(first, secLoop, thrLoop);

    return _.flatten(perms3.map(sumPlusPerm));
  }

  var a:Array<[LoopsPermAnswers, LoopsPermutation]> =
          answersPlusPerm(wheelPos1, secLoop, thrLoop);

  function findSpecificAnswer (first: WheelPos, secLoop: WheelLoop,
                                thrLoop: WheelLoop, answersLoop: WheelLoop):
                                  Array<[LoopsPermAnswers, LoopsPermutation]> {
    var candidates:Array<[LoopsPermAnswers, LoopsPermutation]> =
                  answersPlusPerm(first, secLoop, thrLoop);

    function chkForAnswer ([ans, lists]:[LoopsPermAnswers, LoopsPermutation]): boolean {
      // this code has no side effects, such as changing a var in a closure
      var results:Array<WheelPos> = answersLoop.filter( val => _.isEqual(ans, val) );

      return results.length > 0;
    }

    return candidates.filter(chkForAnswer);
  }

  var f = findSpecificAnswer(wheelPos1, secLoop, thrLoop, ansLoop);

  var i = 2;
};
