import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Controller.extend({
  assignmentSortProperties: [
    'kindSort:asc',
    'person.name:asc',
  ],
  sortedAssignments: Ember.computed.sort(
    'model.assignments',
    'assignmentSortProperties'
  ),
  flashMessage: Ember.get(this, 'flashMessages'),
  adminCall: Ember.computed(function() {
    return this.get('store').query('person', {
      'memberships__officers__office__kind': 30, //TODO Hardcoded
      // 'judges__status': 1,
      // 'judges__kind': 40,
      'page_size': 1000,
    });
  }),
  adminOptions: Ember.computed.uniq(
    'adminCall'
  ),
  searchTask: task(function* (term){
    yield timeout(600);
    return this.get('store').query('person', {'nomen__icontains': term})
      .then((data) => data);
  }),
  kindOptions: [
    'DRCJ',
    'CA',
    'ACA',
    'Music',
    'Presentation',
    'Singing',
  ],
  actions: {
    addAssignment(){
      let assignment = this.get('store').createRecord('assignment', {
        convention: this.get('model'),
        person: this.get('person'),
        kind: this.get('kind'),
      });
      assignment.save()
      .then(() => {
        this.set('person', null);
        this.set('kind', null);
        this.get('flashMessages').success('Success');
      })
      .catch((error) => {
        assignment.deleteRecord();
        console.log(error);
        this.get('flashMessages').danger('Error');
      });
    },
  }
});
