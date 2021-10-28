import { HaysonDict, HDict, HGrid, HMarker, HRef } from 'haystack-core'
import { ClientServiceConfig } from '../ClientServiceConfig'
import { fetchVal } from '../fetchVal'
import { dictsToGrid } from '../../util/hval'
import { encodeQuery } from '../../util/http'
import { ReadOptions } from '../RecordService'

/**
 * a role record
 */
interface Role extends HDict {
	id: HRef
	userRole: HMarker
}

/**
 * optional parameters available to readByFilter query
 */
export type RolesReadOptions = Omit<ReadOptions, 'unique'>

export class RolesService<T extends Role = Role> {
	/**
	 * The client service configuration.
	 */
	readonly #serviceConfig: ClientServiceConfig

	/**
	 * The url for the service.
	 */
	readonly #url: string

	/**
	 * Constructs a new roles service object.
	 *
	 * @param serviceConfig Service configuration.
	 */
	public constructor(serviceConfig: ClientServiceConfig) {
		this.#serviceConfig = serviceConfig
		this.#url = serviceConfig.getHostServiceUrl('roles')
	}

	/**
	 * Query all roles.
	 *
	 * @param options Optional options for read operation.
	 * @returns The result of the read operation.
	 */
	public async readAll(): Promise<T[]> {
		const roles = await fetchVal<HGrid<T>>(
			`${this.#url}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
			},
			this.#serviceConfig.fetch
		)

		if (roles.isEmpty()) {
			return []
		}

		return roles.getRows()
	}

	/**
	 * Read a role via its id.
	 *
	 * @param id The id of the role to read.
	 * @returns The role record.
	 * @throws An error if the role can't be found.
	 */
	public async readById(id: string | HRef): Promise<T> {
		const role = await fetchVal<T>(
			`${this.#url}/${HRef.make(id).value}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
			},
			this.#serviceConfig.fetch
		)

		return role
	}

	/**
	 * Query some roles via a haystack filter.
	 *
	 * @param filter The haystack filter to query by.
	 * @param options Optional options for read operation.
	 * @returns The result of the read operation.
	 */
	public async readByFilter(
		filter: string,
		options?: RolesReadOptions
	): Promise<HGrid<T>> {
		return fetchVal<HGrid<T>>(
			`${this.#url}${encodeQuery({
				filter,
				...(options ?? {}),
			})}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
			},
			this.#serviceConfig.fetch
		)
	}

	/**
	 * Create multiple role records.
	 *
	 * @param role The roles to create.
	 * @returns A grid of roles.
	 */
	public async create(
		roles: T[] | HaysonDict[] | HGrid<T>
	): Promise<HGrid<T>> {
		return fetchVal<HGrid<T>>(
			`${this.#url}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
				method: 'POST',
				body: JSON.stringify(dictsToGrid(roles).toJSON()),
			},
			this.#serviceConfig.fetch
		)
	}

	/**
	 * Create a single role record.
	 *
	 * @param role The role record to create.
	 * @returns The created role record.
	 */
	public async createRole(role: T | HaysonDict): Promise<T> {
		return fetchVal<T>(
			this.#url,
			{
				...this.#serviceConfig.getDefaultOptions(),
				method: 'POST',
				body: JSON.stringify(HDict.make(role).toJSON()),
			},
			this.#serviceConfig.fetch
		)
	}

	/**
	 * Update a role record.
	 *
	 * @param role The role record to update.
	 * @returns A updated record. Please note, this record doesn't
	 * have any role information just the `id` and `mod`.
	 */
	public async update(id: string | HRef): Promise<T> {
		return fetchVal<T>(
			`${this.#url}/${HRef.make(id).value}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
				method: 'PATCH',
			},
			this.#serviceConfig.fetch
		)
	}

	/**
	 * Delete a role record via its id.
	 *
	 * @param id The id of the record to delete.
	 */
	public async deleteById(id: string | HRef): Promise<void> {
		await fetchVal<T>(
			`${this.#url}/${HRef.make(id).value}`,
			{
				...this.#serviceConfig.getDefaultOptions(),
				method: 'DELETE',
			},
			this.#serviceConfig.fetch
		)
	}
}
