import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  currentUser: Ember.inject.service('current-user'),
  model: function() {
    let user = this.get('currentUser.user.id');
    return this.get('store').query('entity', {
      'kind':31,
      'memberships__person__user': user
    });
  },
});