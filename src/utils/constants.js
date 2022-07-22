const xrpl = require('xrpl');

// const net = "wss://s.devnet.rippletest.net:51233";
const net = "wss://s1.ripple.com";
// const net = "wss://s.altnet.rippletest.net:51233";
const walletServicer = net;

const client = new xrpl.Client(net);

const wallet1 = {
    "publicKey": 'ED1289374FD60F4FEAAA6A65203E085118C7A7AA8A08EA5DA09EB0E5CA95A23698',
    "privateKey": 'ED466579B75BBF57EBBF7025255D120A996CDC5A90C374F0283AE6EB69B0DECFD0',
    "classicAddress": 'rBA6m7osy5PLZf3Uiuh9ZV2rFdf32kC3qW',
    "seed": 'sEdT45hypcUcMKTdDTrAakJKP2B5hD2'
}

const wallet2 = {
    "publicKey": 'EDD2206003B4C957F4A022130E5C4875F505E768410C7BB3FB9519935C8C37D77C',
    "privateKey": 'ED233D8C720FFBC450BE36B5A0A0B174D9286BA10DBC5D25F2A6082376697A69E3',
    "classicAddress": 'r3hrxoyoGRgTu4sxFAwRkonZWxxnrCgHn6',
    "seed": 'sEdVGwyt5RQyN2tVrHoVarFRwFYHLtL'
}

const mainWallet = {
    "publicKey": 'EDCB703A46C65FCA9E01BA0B93EA22334404255E602C212F0059BBF7259323835C',
    "privateKey": 'ED58424D422BE7624E801F27FE82B60475FF72727EDD1DD7CBF77696DEACAF21EB',
    "classicAddress": 'rsZzn8bL42Z54dfLp1g2jeYBnS2xXvXjJE',
    "seed": 'sEdSiWKYeSa34EoD8uSaPgX5918dfQh'
}

module.exports = {
    walletServicer,
    net,
    client,
    xrpl,
    wallet1,
    wallet2,
    mainWallet
}