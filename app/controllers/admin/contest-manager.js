import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Controller.extend({
  currentUser: Ember.inject.service('current-user'),
  store: Ember.inject.service(),
  sessionSortProperties: [
    'convention.start_date:asc',
  ],
  sortedSessions: Ember.computed.sort(
    'model',
    'sessionSortProperties'
  ),
  searchTask: task(function* (term){
    yield timeout(600);
    return this.get('store').query('session', {'nomen__icontains': term})
      .then((data) => data);
  }),
  actions: {
    transitionSession(session) {
      this.transitionToRoute('admin.contest-manager.session', session);
    },
    sortBy(sessionSortProperties) {
      this.set('sessionSortProperties', [sessionSortProperties]);
    },
  },
});
