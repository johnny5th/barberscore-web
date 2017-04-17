import Ember from 'ember';
import Model from 'ember-data/model';
import DS from 'ember-data';

export default Model.extend({
  nomen: DS.attr('string'),
  status: DS.attr('assignment-status'),
  category: DS.attr('assignment-category'),
  // designation: DS.attr('string'),
  kind: DS.attr('assignment-kind'),
  slot: DS.attr('number'),
  convention: DS.belongsTo('convention', {async: true}),
  person: DS.belongsTo('person', {async: true}),
  permissions: DS.attr(),
  categorySort: Ember.computed(
    'category',
    'categoryOptions',
    function() {
      return this.get('categoryOptions').indexOf(this.get('category'));
    }
  ),
  kindSort: Ember.computed(
    'kind',
    'kindOptions',
    function() {
      return this.get('kindOptions').indexOf(this.get('kind'));
    }
  ),
  statusOptions: [
    'New',
    'Scheduled',
    'Confirmed',
    'Validated',
    'Final',
  ],
  categoryOptions: [
    'DRCJ',
    'CA',
    'ACA',
    'Music',
    'Performance',
    'Singing',
  ],
  kindOptions: [
    'Official',
    'Practice',
  ],
});
