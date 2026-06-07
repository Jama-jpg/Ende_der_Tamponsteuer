/* Shared physics instance that lives across scenes 17k → 25k. */
export const ch5State = {
  physics:     null,   // createPhysicsWorld() handle
  hasPlayed:   false,  // true once tampon animation has started (play once per page load)
  coinsAdded:  false,  // true once the 8 extra coins have been dropped
  coinHandle:  null,   // handle returned by physics.addCoins()
};
