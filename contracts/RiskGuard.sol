// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract RiskGuard {
  struct Caps { uint256 perTradeBpsMax; uint256 dailyLossCapBps; uint256 leverageMaxBps; }
  mapping(address=>Caps) public caps;
  function setCaps(address user, Caps calldata c) external { caps[user]=c; }
  function withinRisk(address user, uint256 tradeBps, uint256 dayLossBps) external view returns (bool) {
    Caps memory c = caps[user];
    return tradeBps <= c.perTradeBpsMax && dayLossBps <= c.dailyLossCapBps;
  }
}
