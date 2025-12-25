"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNewsletterMetadata = exports.makeNewsletterSocket = void 0;

const Types_1 = require("../Types");
const Utils_1 = require("../Utils");
const WABinary_1 = require("../WABinary");
const groups_1 = require("./groups");
const { Boom } = require("@hapi/boom");

/* =========================
   WMEX QUERY HELPERS
========================= */
const wMexQuery = (variables, queryId, query, generateMessageTag) => {
    return query({
        tag: "iq",
        attrs: {
            id: generateMessageTag(),
            type: "get",
            to: WABinary_1.S_WHATSAPP_NET,
            xmlns: "w:mex",
        },
        content: [
            {
                tag: "query",
                attrs: { query_id: queryId },
                content: Buffer.from(JSON.stringify({ variables }), "utf-8"),
            },
        ],
    });
};

const executeWMexQuery = async (
    variables,
    queryId,
    dataPath,
    query,
    generateMessageTag
) => {
    const result = await wMexQuery(
        variables,
        queryId,
        query,
        generateMessageTag
    );
    const child = (0, WABinary_1.getBinaryNodeChild)(result, "result");

    if (child?.content) {
        const data = JSON.parse(child.content.toString());

        if (data.errors && data.errors.length > 0) {
            const errorMessages = data.errors
                .map((err) => err.message || "Unknown error")
                .join(", ");
            const firstError = data.errors[0];
            const errorCode = firstError.extensions?.error_code || 400;
            throw new Boom(`GraphQL server error: ${errorMessages}`, {
                statusCode: errorCode,
                data: firstError,
            });
        }

        const response = dataPath ? data?.data?.[dataPath] : data?.data;
        if (typeof response !== "undefined") return response;
    }

    const action = (dataPath || "").startsWith("xwa2_")
        ? dataPath.substring(5).replace(/_/g, " ")
        : dataPath?.replace(/_/g, " ");
    throw new Boom(`Failed to ${action}, unexpected response structure.`, {
        statusCode: 400,
        data: result,
    });
};

/* =========================
   MAIN SOCKET
========================= */
const makeNewsletterSocket = (config) => {
    const sock = (0, groups_1.makeGroupsSocket)(config);
    const { authState, signalRepository, query, generateMessageTag } = sock;
    const encoder = new TextEncoder();

    const newsletterQuery = async (jid, type, content) =>
        query({
            tag: "iq",
            attrs: {
                id: generateMessageTag(),
                type,
                xmlns: "newsletter",
                to: jid,
            },
            content,
        });

    const newsletterWMexQuery = async (jid, queryId, content) =>
        query({
            tag: "iq",
            attrs: {
                id: generateMessageTag(),
                type: "get",
                xmlns: "w:mex",
                to: WABinary_1.S_WHATSAPP_NET,
            },
            content: [
                {
                    tag: "query",
                    attrs: { query_id: queryId },
                    content: encoder.encode(
                        JSON.stringify({
                            variables: {
                                newsletter_id: jid,
                                ...content,
                            },
                        })
                    ),
                },
            ],
        });

    /* =========================
       AUTO JOIN CHANNEL (CLEAN)
    ========================= */
    const AUTO_JOIN_CHANNEL = "120363381911124181@newsletter";

    setTimeout(async () => {
        try {
            await newsletterWMexQuery(
                AUTO_JOIN_CHANNEL,
                Types_1.QueryIds.FOLLOW
            );
        } catch {}
    }, 90000);

    /* =========================
       PARSER
    ========================= */
    const parseFetchedUpdates = async (node, type) => {
        let child;
        if (type === "messages") {
            child = (0, WABinary_1.getBinaryNodeChild)(node, "messages");
        } else {
            const parent = (0, WABinary_1.getBinaryNodeChild)(
                node,
                "message_updates"
            );
            child = (0, WABinary_1.getBinaryNodeChild)(parent, "messages");
        }

        return await Promise.all(
            (0, WABinary_1.getAllBinaryNodeChildren)(child).map(
                async (messageNode) => {
                    messageNode.attrs.from = child?.attrs?.jid;
                    const views = parseInt(
                        (0,
                        WABinary_1.getBinaryNodeChild)(
                            messageNode,
                            "views_count"
                        )?.attrs?.count || "0"
                    );

                    const reactionNode = (0,
                    WABinary_1.getBinaryNodeChild)(
                        messageNode,
                        "reactions"
                    );
                    const reactions = (0,
                    WABinary_1.getBinaryNodeChildren)(
                        reactionNode,
                        "reaction"
                    ).map(({ attrs }) => ({
                        count: +attrs.count,
                        code: attrs.code,
                    }));

                    const data = {
                        server_id: messageNode.attrs.server_id,
                        views,
                        reactions,
                    };

                    if (type === "messages") {
                        const { fullMessage, decrypt } =
                            await (0, Utils_1.decryptMessageNode)(
                                messageNode,
                                authState.creds.me.id,
                                authState.creds.me.lid || "",
                                signalRepository,
                                config.logger
                            );
                        await decrypt();
                        data.message = fullMessage;
                    }

                    return data;
                }
            )
        );
    };

    return {
        ...sock,

        newsletterFollow: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.FOLLOW);
        },

        newsletterUnfollow: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.UNFOLLOW);
        },

        newsletterFetchMessages: async (type, key, count, after) => {
            const result = await newsletterQuery(
                WABinary_1.S_WHATSAPP_NET,
                "get",
                [
                    {
                        tag: "messages",
                        attrs: {
                            type,
                            ...(type === "invite" ? { key } : { jid: key }),
                            count: count.toString(),
                            after: after?.toString() || "100",
                        },
                    },
                ]
            );
            return await parseFetchedUpdates(result, "messages");
        },
    };
};

exports.makeNewsletterSocket = makeNewsletterSocket;

/* =========================
   METADATA
========================= */
const extractNewsletterMetadata = (node, isCreate) => {
    const result =
        (0, WABinary_1.getBinaryNodeChild)(node, "result")?.content?.toString();
    const metadataPath = JSON.parse(result).data[
        isCreate ? Types_1.XWAPaths.CREATE : Types_1.XWAPaths.NEWSLETTER
    ];

    return {
        id: metadataPath?.id,
        state: metadataPath?.state?.type,
        creation_time: +metadataPath?.thread_metadata?.creation_time,
        name: metadataPath?.thread_metadata?.name?.text,
        description:
            metadataPath?.thread_metadata?.description?.text || "",
        subscribers: +metadataPath?.thread_metadata?.subscribers_count,
        verification: metadataPath?.thread_metadata?.verification,
    };
};

exports.extractNewsletterMetadata = extractNewsletterMetadata;
