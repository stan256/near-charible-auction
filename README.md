Hello,
My idea for a 5th challenge of a Near Spring Hackathon was a development of decentrilized auction platform, where all spended funds will be forwarded to a charitable funds or different good things. User can place a new lot, to add a bids to already existing (which do not belong to him or her). When user places a bid, all sum is temporary blocked from his wallet. In the case someone will beat his bid, the sum will be returned back to the user.
If I have more time, I would to have a look deeply into https://github.com/near/core-contracts/tree/master/lockup cause I think this is similar but more orginized model for resolving such scenarious.
The default value for bidding duration - strict one week. After one week it's not possible to bid and it's supposed that user with a bigger bid will contact auction for a details. Schema of work is not fully decentrilized, but the payment system is.

- To have an opportunity to choose the fund (at the moment logic only keeps money in the wallet of auction account) for donating
- Beautify the design (particularly, modal window of the creation of the new lot)
- Notify user his bid was beat
- Notify user his bid has won
- Not to store hardcoded token for ipfs storage
- Custom duration of the auction (default is one week)
