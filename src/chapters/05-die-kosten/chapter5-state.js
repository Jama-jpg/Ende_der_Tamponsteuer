/* Shared physics instance that lives across scenes 17k → 25k. */
export const ch5State = {
  physics:    null,   // createPhysicsWorld() handle
  hasPlayed:  false,  // true once tampon animation has started (play once per page load)
  morphed:    false,  // true once the morph to 1000€ balls has triggered
};
