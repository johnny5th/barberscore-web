import Ember from 'ember';
// import { task, timeout } from 'ember-concurrency';
import groupBy from 'ember-group-by';

export default Ember.Controller.extend({
  openModal: false,
  flashMessage: Ember.get(this, 'flashMessages'),
  sortedSongsProperties: [
    'num',
  ],
  sortedSongs: Ember.computed.sort(
    'model.songs',
    'sortedSongsProperties'
  ),
  sortedItemsProperties: [
    'num',
  ],
  sortedItems: Ember.computed.sort(
    'model.round.appearances',
    'sortedItemsProperties'
  ),
  isPrevDisabled: Ember.computed(
    'model',
    'sortedItems', function() {
    return this.model == this.get('sortedItems.firstObject');
  }),
  isNextDisabled: Ember.computed(
    'model',
    'sortedItems', function() {
    return this.model == this.get('sortedItems.lastObject');
  }),
  scoresCall: Ember.computed(
    'model.songs', function() {
    let out = Ember.A();
    this.get('model.songs').then((data) => {
      let foo = data;
      foo.forEach(function(item) {
        let bar = item.get('scores');
        bar.forEach(function(foobar) {
          out.pushObject(foobar);
        });
      });
    });
    return out;
  }),
  sortedScoresProperties: [
    'num',
  ],
  sortedScores: Ember.computed.sort(
    'scoresCall',
    'sortedScoresProperties'
  ),
  groupedScores: groupBy(
    'sortedScores',
    'num'
  ),
  mappedScores: Ember.computed.mapBy(
    'sortedScores',
    'points'
  ),
  sumScores: Ember.computed.sum(
    'mappedScores'
  ),
  scoresVariance: Ember.computed.mapBy(
    'scoresCall',
    'hasVariance'
  ),
  hasVariance: Ember.computed(
    'scoresVariance', function() {
      return this.get('scoresVariance').any(
        function(item) {
          return item;
        });
  }),
  actions: {
    previousItem(cursor) {
      let nowCur = this.get('sortedItems').indexOf(cursor);
      let newCur = this.get('sortedItems').objectAt(nowCur-1);
      this.transitionToRoute('dashboard.scoring-manager.round.appearances.appearance', newCur);
    },
    nextItem(cursor) {
      let nowCur = this.get('sortedItems').indexOf(cursor);
      let newCur = this.get('sortedItems').objectAt(nowCur+1);
      this.transitionToRoute('dashboard.scoring-manager.round.appearances.appearance', newCur);
    },
    saveSong(song) {
      song.save()
      .then(() => {
        this.get('flashMessages').success('Success');
      })
      .catch(() => {
        this.get('flashMessages').danger('Error');
      });
    },
    saveScores() {
      this.get('sortedScores').invoke('save');
      this.get('flashMessages').success('Success');
      this.set('openModal', false);
    }
  }
});