'use strict';

const meta = require.main.require('./src/meta');
const topics = require.main.require('./src/topics');


const ArchiveDeletedPlugin = {
  settings: null
};

ArchiveDeletedPlugin.init = async function (data) {
  function render(_, res) {
    res.render('admin/plugins/archive-deleted', {});
  }

  data.router.get('/admin/plugins/archive-deleted', data.middleware.admin.buildHeader, render);
  data.router.get('/api/admin/plugins/archive-deleted', render);

  ArchiveDeletedPlugin.settings = await meta.settings.get('archive-deleted');

  return;
}

ArchiveDeletedPlugin.addAdminNavigation = async function (custom_header) {
  custom_header.plugins.push({
    'route': '/plugins/archive-deleted',
    "name": 'Archive Deleted'
  });
  return custom_header;
};

ArchiveDeletedPlugin.onTopicDelete = async function ({ topic }) {
  return await topics.tools.move(topic.tid, { cid: ArchiveDeletedPlugin.settings.targetCid });
}

module.exports = ArchiveDeletedPlugin;