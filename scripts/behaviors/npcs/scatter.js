var CommandUtil = require('../../../src/command_util.js')
  .CommandUtil;
var chooseRandomExit = require('../../../src/pathfinding.js').chooseRandomExit;

exports.listeners = {
  playerEnter: chooseRandomExit
};
