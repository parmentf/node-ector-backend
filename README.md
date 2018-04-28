# node-ector-backend
HTTP API for ECTOR

## Routes

### reply

`/v1/reply/{user}/{entry}`

Get ECTOR's reply to the `user`'s `entry`.

> *Warning*: ECTOR learns from the `entry`, so if that entry 
> is incorrect, it would nevertheless be learned. Everything 
> that's learned may be used in ECTOR's replies. See [Tay](https://en.wikipedia.org/wiki/Tay_(bot)).

### concept-network

`/v1/concept-network`

Get the Concept Network object.
That may be useful to save ECTOR's concepts memory (not its memory for what you said to him lately).
