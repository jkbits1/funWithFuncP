/**
 * Created by Jon on 28/02/16.
 */

"use strict";

export module WheelCalcs {
//  interface CalcsIf {
//    t (s: string): string
//  }

  declare module _ {
    interface RIf {
      drop<T>(n:number, array:T[]): T[];
      take<T>(n:number, array:T[]): T[];
      head<T>(array:List<T>): T;
      //compose<V0, V1, T1>(fn0: (x0: V0, x1: V1) => T1): (x0: V0, x1: V1) => T1;
      //compose<V0, T1, T2>(fn1: (x: T1) => T2, fn0: (x0: V0) => T1): (x0: V0) => T2;
    }

    interface List<T> {
      [index: number]: T;
      length: number;
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
  }

  declare var R: _.RIf;
  declare var _: _.lodashIf;

  export type WheelPos         = Array<number>;
  export type WheelLoop        = Array<WheelPos>;
  export type LoopsPermutation = Array<WheelPos>;

  export class Calcs1 { //implements CalcsIf

    constructor() {}

    turnWheel(wheel: WheelPos, turns: number): WheelPos {
      var dropPart = R.drop(turns, wheel);
      var takePart = R.take(turns, wheel);

      return dropPart.concat(takePart);
    }

    getWheelLoop (positions: Array<WheelPos>, pos:WheelPos, count:number): WheelLoop {
      if (count === 0) {
        return [pos].concat(positions);
      }

      return this.getWheelLoop([this.turnWheel(pos, count)].concat(positions), pos, count - 1);
    }

    createWheelLoop (initialPos: WheelPos): WheelLoop {
      return this.getWheelLoop([], initialPos, initialPos.length - 1);
    }

    twoWheelPerms (first: WheelPos, secLoop:WheelLoop): Array<LoopsPermutation> {
      return secLoop.map(secPos => [first].concat([secPos]));
    }

    appendTwoWheelPerms (twoWheelPermsLocal: Array<LoopsPermutation>, thrPos: WheelPos) :Array<LoopsPermutation> {
      return twoWheelPermsLocal.map(twoLoopsPerm => twoLoopsPerm.concat([thrPos]));
    }

    threeLoopPerms (first: WheelPos, secLoop: WheelLoop, thrLoop: WheelLoop): Array<LoopsPermutation> {
      var self = this;

      // works with this
      var twoWheelPermsLocal = self.twoWheelPerms(first, secLoop);

      // AS CURRIED FUNCTION
      // var addPosToTwoWheelPerms = (_.curry(appendTwoWheelPerms))(twoWheelPermsLocal);

      // AS CLOSURE
      function addPosToTwoWheelPerms2 (thrPos: WheelPos): Array<LoopsPermutation> {
        // fails with this
        return self.appendTwoWheelPerms(twoWheelPermsLocal, thrPos);
      }

      //return _.flatten(thrLoop.map(addPosToTwoWheelPerms));
      return _.flatten(thrLoop.map(addPosToTwoWheelPerms2));

      // NOTE: why flatten instead of concat
    }

  }
}
