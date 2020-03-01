import {
	BigDecimal,
	EthereumEvent,
} from "@graphprotocol/graph-ts"

import {
	WalletCreated as WalletCreatedEvent,
} from "../generated/WalletFactory/WalletFactory"

import {
	Wallet as WalletTemplate
} from '../generated/templates'

import {
	Wallet,
	WalletCreated,
} from "../generated/schema"

import {
	createEventID,
	logTransaction,
} from './utils'



export function handleWalletCreated(event: WalletCreatedEvent): void
{
	WalletTemplate.create(event.params._wallet)

	let wallet = new Wallet(event.params._wallet.toHex())
	wallet.owner = event.params._owner.toHex()
	wallet.save()

	let ev = new WalletCreated(createEventID(event))
	ev.transaction = logTransaction(event).id
	ev.wallet      = wallet.id
	ev.save()
}
