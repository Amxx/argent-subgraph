import {
	store,
	EthereumEvent,
} from "@graphprotocol/graph-ts"

import {
	OwnerChanged      as OwnerChangedEvent,
	AuthorisedModule  as AuthorisedModuleEvent,
	EnabledStaticCall as EnabledStaticCallEvent,
	Invoked           as InvokedEvent,
	Received          as ReceivedEvent,
} from "../generated/templates/Wallet/Wallet"

import {
	Wallet,
	Module,
	Method,
	WalletModule,
	WalletMethod,
	WalletOwnerChange,
	WalletAuthorizeModule,
	WalletEnabledStaticCall,
	// WalletInvoked,
	// WalletReceived,
} from "../generated/schema"

import {
	createEventID,
	logTransaction,
} from './utils'



export function handleOwnerChanged(event: OwnerChangedEvent): void
{
	let wallet = new Wallet(event.address.toHex())
	wallet.owner = event.params.owner.toHex()
	wallet.save()

	let ev = new WalletOwnerChange(createEventID(event))
	ev.transaction = logTransaction(event).id
	ev.wallet      = wallet.id
	ev.save()
}

export function handleAuthorisedModule(event: AuthorisedModuleEvent): void
{
	let wallet = new Wallet(event.address.toHex())
	let module = new Module(event.params.module.toHex())
	module.save()

	let ev = new WalletAuthorizeModule(createEventID(event))
	ev.transaction = logTransaction(event).id
	ev.wallet      = wallet.id
	ev.module      = module.id
	ev.value       = event.params.value
	ev.save()

	if (event.params.value)
	{
		let wm = new WalletModule(wallet.id + '-' + module.id)
		wm.wallet = wallet.id
		wm.module = module.id
		wm.save()
	}
	else
	{
		store.remove("WalletModule", wallet.id + '-' + module.id)
	}
}

export function handleEnabledStaticCall(event: EnabledStaticCallEvent): void
{
	let wallet = new Wallet(event.address.toHex())
	let module = new Module(event.params.module.toHex())
	let method = new Method(event.params.method.toHex())
	module.save()
	method.save()

	let ev = new WalletEnabledStaticCall(createEventID(event))
	ev.transaction = logTransaction(event).id
	ev.wallet      = wallet.id
	ev.module      = module.id
	ev.method      = method.id
	ev.save()

	let sc = new WalletMethod(wallet.id + '-' + method.id)
	sc.wallet = wallet.id
	sc.module = module.id
	sc.method = method.id
	sc.save()
}

export function handleInvoked(event: InvokedEvent): void
{
	// TODO
}

export function handleReceived(event: ReceivedEvent): void
{
	// TODO
}
