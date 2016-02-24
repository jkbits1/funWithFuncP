/**
 * Created by Jon on 23/02/16.
 */

"use strict";

// taken from definitely typed lodash to get rid of ramda errors
declare module _ {
  //_.drop
  //interface LoDashStatic {
  interface R {
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

  //, interface lodash {
  //
  //}
}

declare var R: _.R;

window.onload = function () {
  type WheelPos         = Array<number>;
  type WheelPosx        = number[];
  type WheelLoop        = Array<WheelPos>;
  type LoopsPermutation = Array<WheelPos>;

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
  //function threeLoopPerms (first: WheelPos, secLoop: WheelLoop, thrLoop: WheelLoop) {
  //  function addPosToTwoWheelPerms () {
  //
  //    return perms;
  //  }

    var perms = twoWheelPerms(first, secLoop);
    //var curry1 = _.curry(appendTwoWheelPerms);
    //var appendTwoWheelPermsCurry = curry1(perms);

    var addPosToTwoWheelPerms = (_.curry(appendTwoWheelPerms))(perms);

    COULD DO AS A CLOSURE

    //: Array<LoopsPermutation> = ;


    //return thrLoop.map(addPosToTwoWheelPerms).concat([]);
    //return thrLoop.map(addPosToTwoWheelPerms);
    //return thrLoop.map(appendTwoWheelPermsCurry);
    //return thrLoop.map(appendTwoWheelPermsCurry).concat([]);
    return _.flatten(thrLoop.map(addPosToTwoWheelPerms));
  }

  var perms3 = threeLoopPerms(wheelPos1, secLoop, thrLoop);

  var i = 2;
};
