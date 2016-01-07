import DS from 'ember-data';

export default DS.Model.extend({
  convention: DS.belongsTo('convention', {async: true}),
  name: DS.attr('string'),
  contests: DS.hasMany('contest', {async: true}),
  rounds: DS.hasMany('round', {async: true}),
  performers: DS.hasMany('performer', {async: true}),
});
