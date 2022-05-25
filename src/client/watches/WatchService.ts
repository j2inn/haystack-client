/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { HGrid } from 'haystack-core'
import { Ids } from '../../util/hval'
import { ClientServiceConfig } from '../ClientServiceConfig'
import { DEFAULT_POLL_RATE_SECS, Watch } from './Watch'
import { ApiSubject } from './ApiSubject'
import { BatchSubject } from './BatchSubject'
import { Subject } from './Subject'
import { WatchApis } from './WatchApis'

/**
 * A service for using watches.
 */
export class WatchService {
	/**
	 * Internal subject used for watches.
	 */
	readonly #subject: Subject

	/**
	 * Constructs a service object.
	 *
	 * @param serviceConfig Service configuration.
	 * @param watchApis Watch network APIs implementation.
	 */
	public constructor(
		serviceConfig: ClientServiceConfig,
		watchApis: WatchApis
	) {
		const apiSubject = new ApiSubject(
			watchApis,
			serviceConfig,
			DEFAULT_POLL_RATE_SECS
		)

		this.#subject = new BatchSubject(apiSubject)
	}

	/**
	 * Create a new watch on the specified data.
	 *
	 * https://project-haystack.org/doc/Ops#watchSub
	 * https://project-haystack.org/doc/Ops#watchUnsub
	 * https://project-haystack.org/doc/Ops#watchPoll
	 *
	 * @param display Display name for the watch.
	 * @param ids The ids to watch.
	 * @param grid An optional empty grid to use for the watch.
	 * @returns An opened watch.
	 */
	public async make(display: string, ids: Ids, grid?: HGrid): Promise<Watch> {
		return Watch.open({
			subject: this.#subject,
			ids,
			display,
			grid,
		})
	}

	/**
	 * Closes any open watches for this watch service.
	 */
	public async close(): Promise<void> {
		await Watch.close(this.#subject)
	}
}
