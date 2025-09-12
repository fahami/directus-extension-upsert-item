import { defineEndpoint } from '@directus/extensions-sdk';

interface UpsertRequestBody {
	filter?: Record<string, any>;
	body?: Record<string, any>;
}

interface UpsertResponse {
	success: boolean;
	message: string;
	code: number;
	data?: any;
}

const resData: UpsertResponse = {
	success: true,
	message: 'Success',
	code: 200,
	data: null
};

export default defineEndpoint({
	id: 'upsert', handler: (router, { services, database, getSchema }) => {
		const { ItemsService } = services;

		router.post('/:collection', async (req: any, res) => {
			try {
				const { collection } = req.params;

				if (!collection) {
					throw new Error('Missing collection');
				}

				const reqBody: UpsertRequestBody = req.body || {};
				const { filter = {}, body = {} } = reqBody;

				if (!filter || !Object.keys(filter).length) {
					res.status(400);
					return res.json({ ...resData, success: false, message: 'Missing filter', code: 400 });
				}

				const schema = await getSchema();
				if (!schema) {
					throw new Error('Schema not available');
				}

				const service = new ItemsService(collection, {
					schema: schema,
					accountability: req.accountability
				});

				if (!schema.collections[collection]) {
					throw new Error(`Collection '${collection}' not found in schema`);
				}

				const primaryKeyField = schema.collections[collection].primary;
				const _where = { ...filter };

				const exists = await database
					.select(primaryKeyField)
					.from(collection)
					.where(_where)
					.first();

				let result: any;
				let responseMsg: string;
				let statusCode: number;

				if (exists) {
					// Update existing record
					await service.updateOne(exists[primaryKeyField], body);
					// Read back the updated item
					result = await service.readOne(exists[primaryKeyField], req.sanitizedQuery || {});
					responseMsg = 'Update Success';
					statusCode = 200;
				} else {
					// Create new record
					const createdKey = await service.createOne(body);
					// Read back the created item
					result = await service.readOne(createdKey, req.sanitizedQuery || {});
					responseMsg = 'Create Success';
					statusCode = 201;
				}

				res.status(statusCode);
				return res.json({ ...resData, message: responseMsg, code: statusCode, data: result });
			} catch (error: any) {
				res.status(error.status || 400);
				return res.json({
					...resData,
					success: false,
					message: error.message || error.code || 'An error occurred',
					code: error.status || 400
				});
			}
		});
	}
});
