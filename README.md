# node-ector-backend

HTTP API for ECTOR

## Launch

To launch ector backend server, use either:

```bash
npm start
```

or:

```bash
heroku local web
```

## Routes

### reply

`/v1/reply/{user}/{entry}`

Get ECTOR's reply to the `user`'s `entry`.

> *Warning*: ECTOR learns from the `entry`, so if that entry
> is incorrect, it would nevertheless be learned. Everything
> that's learned may be used in ECTOR's replies. See [Tay](https://en.wikipedia.org/wiki/Tay_(bot)).

### learn

`/v1/learn/{source}/{entry}`

Add knowledge to ECTOR's concept network.

No activation value added. The source is an identifier of where the knowledge comes from (eg Wikipedia).

Returns the nodes created.

### concept-network

`/v1/concept-network`

Get the Concept Network object.
That may be useful to save ECTOR's concepts memory (not its memory for what you said to him lately).

### concept-network-state

`/v1/concept-network-state/{user}`

Get the concept network state of a `user`, that is to say the activation values within the concept network.
It's from these activation values that ECTOR choose the words from which it will form a sentence to reply.
