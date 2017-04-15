import Ember from 'ember';
import Model from 'ember-data/model';
import DS from 'ember-data';
import {memberAction} from 'ember-api-actions';
const {computed} = Ember;

export default Model.extend({
  nomen: DS.attr('string'),
  status: DS.attr('entry-status'),
  picture: DS.attr('string'),
  tenor: DS.belongsTo('person', {async: true}),
  lead: DS.belongsTo('person', {async: true}),
  baritone: DS.belongsTo('person', {async: true}),
  bass: DS.belongsTo('person', {async: true}),
  men: DS.attr('number'),
  risers: DS.attr('number'),
  is_evaluation: DS.attr('boolean'),
  is_private: DS.attr('boolean'),
  director: DS.belongsTo('person', {async: true}),
  codirector: DS.belongsTo('person', {async: true}),
  representing: DS.belongsTo('entity', {async: true}),
  seed: DS.attr('number'),
  prelim: DS.attr('number'),
  entity: DS.belongsTo('entity', {inverse: 'entries', async: true}),
  session: DS.belongsTo('session', {async: true}),
  appearances: DS.hasMany('appearance', {async: true}),
  contestants: DS.hasMany('contestant', {async: true}),
  submissions: DS.hasMany('submission', {async: true}),
  permissions: DS.attr(),

  scratch: memberAction({path: 'scratch'}),
  penalizeEligibility: memberAction({path: 'penalize-eligibility'}),

  statusOptions: [
    'New',
    'Registered',
    'Accepted',
    'Declined',
    'Dropped',
    'Validated',
    'Scratched',
    'Disqualified',
    'Started',
    'Finished',
    'Published',
  ],


  tp: computed.mapBy(
    'appearances',
    'totPoints'
  ),
  tc: computed.mapBy(
    'appearances',
    'stc'
  ),
  totPoints: computed.sum(
    'tp'
  ),
  stc: computed.sum(
    'tc'
  ),
  totScore: computed(
    'totPoints',
    'stc',
    function() {
      return (this.get('totPoints') / this.get('stc')).toFixed(1);
    }
  ),
  mp: computed.mapBy(
    'appearances',
    'musPoints'
  ),
  mc: computed.mapBy(
    'appearances',
    'smc'
  ),
  musPoints: computed.sum(
    'mp'
  ),
  smc: computed.sum(
    'mc'
  ),
  musScore: computed(
    'musPoints',
    'smc',
    function() {
      return (this.get('musPoints') / this.get('smc')).toFixed(1);
    }
  ),
  pp: computed.mapBy(
    'appearances',
    'perPoints'
  ),
  pc: computed.mapBy(
    'appearances',
    'spc'
  ),
  perPoints: computed.sum(
    'pp'
  ),
  spc: computed.sum(
    'pc'
  ),
  perScore: computed(
    'perPoints',
    'spc',
    function() {
      return (this.get('perPoints') / this.get('spc')).toFixed(1);
    }
  ),
  sp: computed.mapBy(
    'appearances',
    'sngPoints'
  ),
  sc: computed.mapBy(
    'appearances',
    'ssc'
  ),
  sngPoints: computed.sum(
    'sp'
  ),
  ssc: computed.sum(
    'sc'
  ),
  sngScore: computed(
    'sngPoints',
    'ssc',
    function() {
      return (this.get('sngPoints') / this.get('ssc')).toFixed(1);
    }
  ),
  totRank: computed(
    'session.ranks.@each.{score,rank}',
    'totPoints',
    function() {
      return this.get('session.ranks').findBy('score', this.get('totPoints')).rank || null;
    }
  ),
  contestsArray: computed(
    'contestants.@each.contest', function() {
      return this.get('contestants');
  }),
  selectedContests: computed.mapBy(
    'contestsArray',
    'contest.id'
  ),
  numSubmissions: computed(
    'submissions.length', function() {
      return this.get('submissions.length');
  })
});