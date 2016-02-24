/**
 * Created by Jon on 23/02/16.
 */

"use strict";

// NOTE: consider thought about Haskell/elm return vals

window.onload = function () {
  var wheelPos1   = [1,2,3];
  var wheelPos2   = [4,5,6];
  var wheelPos3   = [7,8,9];
  var wheelPosAns = [12, 15, 18];

  // return WheelPos
  function turnWheel (wheelPos, turnCount) {
    var wheel = wheelPos;
    var turns = turnCount;

    var dropPart = R.drop(turns, wheel);
    var takePart = R.take(turns, wheel);

    return dropPart.concat(takePart);
  }

  var l = turnWheel(wheelPos2, 1);

  // return WheelLoop
  function getWheelLoop (wheelPosList, wheelPos, count) {
    switch (count) {
      case 0:
        return [wheelPos].concat(wheelPosList);
        break;
      default:
        return getWheelLoop([turnWheel(wheelPos, count)].concat(wheelPosList),
                              wheelPos, count - 1);
        break;
    }
  }

  var loop = getWheelLoop([], wheelPos2, 0);

  // return WheelLoop
  function createWheelLoop (wheelPos) {
    return getWheelLoop([], wheelPos, wheelPos.length - 1);
  }

  var secLoop = createWheelLoop(wheelPos2);
  var thrLoop = createWheelLoop(wheelPos3);
  var ansLoop = createWheelLoop(wheelPosAns);

  // return List LoopsPermutation
  function twoWheelPerms (wheelPos, wheelLoop) {
    var first = wheelPos;
    var secLoop = wheelLoop;

    //function permItem (first, secPos) {
    //  var item = [first].concat([secPos]);
    //
    //  return item;
    //}

    var perm = secLoop.map
                    (secPos => [first].concat([secPos]));
                    //(secPos => permItem(first, secPos));

    return perm;
  }

  var perms2 = twoWheelPerms(wheelPos1, secLoop);

  var i = 2;
};