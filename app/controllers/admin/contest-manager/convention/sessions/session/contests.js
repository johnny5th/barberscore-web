import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  contestSortProperties: [
    'nomen:asc',
  ],
  sortedContests: Ember.computed.sort(
    'model.contests',
    'contestSortProperties'
  ),
  awardCall: Ember.computed(function() {
    let convention = this.get('model.convention.id');
    return this.get('store').query('award', {
      'entity__hosts__convention': convention,
      'page_size': 1000,
    });
  }),
  awardOptions: Ember.computed.filter(
    'awardCall',
    function(award) {
      return award.get('kind') === this.get('model.kind');
    }
  ),
  searchTask: task(function* (term){
    yield timeout(600);
    return this.get('store').query('award', {'nomen__icontains': term})
      .then((data) => data);
  }),
  flashMessage: Ember.get(this, 'flashMessages'),
  actions: {
    deleteContest(contest) {
      contest.destroyRecord()
      .then(() => {
        this.get('flashMessages').warning('Deleted');
        this.transitionToRoute('admin.contest-manager.convention.sessions.session.contests');
      })
      .catch((error) => {
        console.log(error);
      });
    },
    addContest(){
      let contest = this.get('store').createRecord('contest', {
        session: this.get('model'),
        award: this.get('award'),
      });
      contest.save()
      .then(() => {
        this.set('award', null);
        this.get('flashMessages').success('Success');
      })
      .catch((error) => {
        contest.deleteRecord();
        console.log(error);
        this.get('flashMessages').danger('Error');
      });
    },
  }
});