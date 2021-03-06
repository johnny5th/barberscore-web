import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  flashMessages: Ember.inject.service(),
  isEditing: false,
  isDisabled: Ember.computed.not('isEditing'),
  location: '',
  entityCall: Ember.computed(function() {
    return this.get('store').query('entity', {
      'kind__lt': 20, //TODO Hardcoded
      'page_size': 100,
    });
  }),
  entityOptionsProperties: [
    'kindSort:asc',
    'name:asc',
  ],
  entityOptions: Ember.computed.sort(
    'entityCall',
    'entityOptionsProperties'
  ),
  autosave: task(function* (property, value){
    this.get('model').set(property, value);
    yield timeout(1000);
    try {
      yield this.get('model').save();
      this.get('flashMessages').success("Saved");
    } catch(e) {
      e.errors.forEach((error) => {
        this.get('flashMessages').danger(error.detail);
      })
    }
  }).restartable(),
  actions: {
    setDateRange(foo, bar) {
      this.model.set('dateRange.lower', foo);
      this.model.set('dateRange.upper', bar);
      this.model.save();
    },
    newConvention() {
      let newConvention = this.store.createRecord(
        'convention'
      );
      this.set('model', newConvention);
      this.set('isEditing', true);
    },
    editConvention() {
      this.set('isEditing', true);
    },
    cancelConvention() {
      this.model.rollbackAttributes();
      this.set('isEditing', false);
    },
    deleteConvention() {
      this.model.destroyRecord()
      .then(() => {
        this.get('flashMessages').warning('Deleted');
        this.set('isEditing', false);
        this.transitionToRoute('dashboard.convention-manager');
      });
    },
    saveConvention() {
      // TODO this seems pretty damn hacky.
      if (this.get('model.isNew')) {
        let person = this.get('currentUser.user.person');
        this.model.save()
        .then((response) => {
          let assignment = response.get('assignments').createRecord({
            person:person,
            kind: 'DRCJ'
          });
          assignment.save();
          this.model.get('assignments').pushObject(assignment);
          this.set('isEditing', false);
          this.get('flashMessages').success('Saved');
          this.transitionToRoute('dashboard.convention-manager');
        });
      } else {
        this.model.save()
        .then(() => {
          this.set('isEditing', false);
          this.get('flashMessages').success('Saved');
        });
      }
    },
    startConvention() {
      this.model.start()
      .then(response => {
        this.store.pushPayload('convention', response);
      });
    },
    endConvention() {
      this.model.end()
      .then(response => {
        this.store.pushPayload('convention', response);
      });
    },
  }
});
