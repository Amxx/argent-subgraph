import {
	BigInt,
	BigDecimal,
	EthereumEvent,
} from '@graphprotocol/graph-ts'

import {
	Transaction,
} from '../generated/schema'

export function createEventID(event: EthereumEvent): string
{
	return event.block.number.toString().concat('-').concat(event.logIndex.toString())
}

export function logTransaction(event: EthereumEvent): Transaction
{
	let tx = new Transaction(event.transaction.hash.toHex())
	tx.timestamp   = event.block.timestamp
	tx.blockNumber = event.block.number
	tx.save();
	return tx as Transaction;
}
