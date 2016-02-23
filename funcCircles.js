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

  //
  function turnWheel (wheelPos, turnCount) {
    var leftBit = R.take(turnCount, wheelPos);

    return leftBit;
  }

  var l = turnWheel(wheelPos2, 1);




};