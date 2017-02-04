import Ember from 'ember';
// import { task, timeout } from 'ember-concurrency';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  flashMessage: Ember.get(this, 'flashMessages'),
  isEditing: false,
  isDisabled: Ember.computed.not('isEditing'),
  // searchTask: task(function* (term){
  //   yield timeout(600);
  //   return this.get('store').query('person', {'nomen__icontains': term})
  //     .then((data) => data);
  // }),
  actions: {
    newAward() {
      let newAward = this.store.createRecord(
        'award'
      );
      this.set('model', newAward);
      this.set('isEditing', true);
    },
    editAward() {
      this.set('isEditing', true);
    },
    cancelAward() {
      this.model.rollbackAttributes();
      this.set('isEditing', false);
    },
    deleteAward() {
      this.model.destroyRecord()
      .then(() => {
        this.get('flashMessages').warning('Deleted');
        this.transitionToRoute('admin.organization-manager.organization.awards.award');
      })
      .catch((error) => {
        console.log(error);
        this.get('flashMessages').danger('Error!');
      });
    },
    saveAward() {
      this.model.save()
      .then(() => {
        this.set('isEditing', false);
        this.get('flashMessages').success('Saved');
      })
      .catch((failure) => {
        this.model.rollbackAttributes();
        this.get('flashMessages').danger(failure);
      });
    },
  }
});
