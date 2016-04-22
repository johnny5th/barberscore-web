import Ember from 'ember';

export default Ember.Controller.extend({
  isEditing: false,
  actions: {
    newPerformer() {
      let newPerformer = this.store.createRecord(
        'performer'
      );
      this.set('model', newPerformer);
      this.set('isEditing', true);
    },
    editPerformer() {
      this.set('isEditing', true);
    },
    cancelPerformer() {
      this.model.rollbackAttributes();
      this.set('isEditing', false);
    },
    deletePerformer() {
      const flashMessages = Ember.get(this, 'flashMessages');
      let session = this.model.session;
      this.model.destroyRecord()
      .then(() => {
        flashMessages.warning('Deleted');
        this.transitionToRoute('admin.convention.session', session);
      })
      .catch(() => {
        flashMessages.danger('Error');
      });
    },
    savePerformer() {
      const flashMessages = Ember.get(this, 'flashMessages');
      this.model.save()
      .then(() => {
        this.set('isEditing', false);
        flashMessages.success('Saved');
      })
      .catch(() => {
        flashMessages.danger('Error');
      });
    },
    buildPerformer() {
      this.model.build();
    },
    scratchPerformer() {
      this.model.scratch();
    },
    disqualifyPerformer() {
      this.model.disqualify();
    },
    deleteContestant(contestant) {
      contestant.destroyRecord();
    },
  },
});
