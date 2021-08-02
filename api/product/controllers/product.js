const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const _ = require('lodash');
module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    const { id, IsStore } = ctx.state.user;


    if (IsStore === true) {
      const { name, description, slug, price, image, stock } = ctx.request.body;
      const product = { name, description, slug, price, image, stock, user_creator: id };
      const entity = await strapi.services.product.create(product);

      return sanitizeEntity(entity, { model: strapi.models.product });
    } else {
      return ctx.badRequest('you are not a store');
    }

  },
  async find(ctx) {
    const { id, IsStore } = ctx.state?.user ? ctx.state.user : {};

    if (IsStore === true) {
      let entities;
      if (ctx.query._q) {

        entities = await strapi.services.product.search({ ...ctx.query });

      } else {
        entities = await strapi.services.product.find({ ...ctx.query });

      }

      return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.product }));
    } else {
      let entities;
      let newEntities = [];
      if (ctx.query._q) {


        entities = await strapi.services.product.search({ ...ctx.query });
        console.log(entities)
      } else {

        entities = await strapi.services.product.find({ ...ctx.query });

        newEntities = entities.map(entiyy => {
          return {
            id: entiyy.id,
            name: entiyy.name,
            description: entiyy.description,
            price: entiyy.price,
            image: entiyy.image,
            stock: entiyy.stock,
            user_creator: entiyy.user_creator,
          }
        })

      }

      return newEntities.map(entity => sanitizeEntity(entity, { model: strapi.models.product }));
    }

  },

  async delete(ctx) {
    const { id, IsStore } = ctx.state.user;

    if (IsStore === true) {
      const entity = await strapi.services.restaurant.delete({ id });
      return sanitizeEntity(entity, { model: strapi.models.restaurant });
    }
  },
  async owner(ctx) {
    const { id, IsStore } = ctx.state.user ? ctx.state.user : {};
    if (IsStore === true) {
      const knex = strapi.connections.default;
      const result = await knex('products')
        .select('*')
        .where('user_creator', id || null);
      // .where('cities', 'berlin')
      // .whereNot('cities.published_at', null)
      // .join('chefs', 'restaurants.id', 'chefs.restaurant_id')
      // .select('restaurants.name as restaurant')
      // .select('chef.name as chef')

      return (result);
    } else {
      return ctx.badRequest('you are not a store');
    }

  }
};
