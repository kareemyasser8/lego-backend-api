const debug = require('debug')('app:debug');

const paginateResults = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;

    const items = await model.findAll({
      limit: pageSize,
      offset: offset,
    });

    const totalItems = await model.count(); // Get the total number of items

    const totalPages = Math.ceil(totalItems / pageSize);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    req.paginationResult = {
      page: page,
      pageSize: pageSize,
      totalPages: totalPages,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
      items: items,
    };

    next();

  } catch (error) {
    res.status(500).send(error.message);
    debug(error.message);
  }
};

module.exports = paginateResults;
