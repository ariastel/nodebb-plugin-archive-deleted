'use strict';

const controllers404 = require.main.require('./src/controllers/404');
const meta = require.main.require('./src/meta');
const posts = require.main.require('./src/posts');
const topics = require.main.require('./src/topics');


const ArchiveDeletedPlugin = {
	settings: null,
};

/**
 * Called on `static:app.load`
 */
ArchiveDeletedPlugin.init = async function init(data) {
	function render(_, res) {
		res.render('admin/plugins/archive-deleted', {});
	}

	data.router.get('/admin/plugins/archive-deleted', data.middleware.admin.buildHeader, render);
	data.router.get('/api/admin/plugins/archive-deleted', render);

	ArchiveDeletedPlugin.settings = await meta.settings.get('archive-deleted');

	return data;
};

/**
 * Called on `filter:admin.header.build`
 */
ArchiveDeletedPlugin.addAdminNavigation = async function addAdminNavigation(custom_header) {
	custom_header.plugins.push({
		route: '/plugins/archive-deleted',
		name: 'Archive Deleted',
	});
	return custom_header;
};

/**
 * Called on `action:topic.delete`
 */
ArchiveDeletedPlugin.onTopicDelete = async function onTopicDelete({ topic }) {
	if (parseInt(ArchiveDeletedPlugin.settings.targetCid, 10)) {
		return topics.tools.move(topic.tid, { cid: ArchiveDeletedPlugin.settings.targetCid });
	}
};

/**
 * Called on `filter:helpers.notAllowed`
 */
ArchiveDeletedPlugin.onVisitNotAllowed = async function onVisitNotAllowed(payload) {
	if (!payload.req.uid || (!payload.req.path.match('/post') && !payload.req.path.match('/topic') && !payload.req.path.match('/category'))) {
		return payload;
	}

	let cid;
	if (payload.req.path.match('/category')) {
		cid = payload.req.params.category_id;
	} else if (payload.req.path.match('/topic')) {
		const { topic_id: tid } = payload.req.params;
		cid = await topics.getTopicField(tid, 'cid');
	} else if (payload.req.path.match('/post')) {
		const { pid } = payload.req.params;
		cid = await posts.getCidByPid(pid);
	}

	const currentCid = parseInt(cid, 10);
	const targetCid = parseInt(ArchiveDeletedPlugin.settings.targetCid, 10);

	if (currentCid && targetCid && currentCid === targetCid) {
		controllers404.send404(payload.req, payload.res);
	}

	return payload;
};

module.exports = ArchiveDeletedPlugin;
